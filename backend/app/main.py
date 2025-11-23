from __future__ import annotations

from datetime import date
from io import StringIO
import csv
import json
from typing import List

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from .config import settings
from .database import Base, engine, get_db
from .models import WeatherRequest
from .schemas import (
    WeatherSearchRequest,
    WeatherSearchResponse,
    WeatherRequestBase,
    WeatherRequestUpdate,
    ExportFormat,
    CurrentWeather,
    DailyForecast,
)
from .weather_client import WeatherClient
from .youtube_client import YouTubeClient

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Weather App API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # in prod, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/weather/search", response_model=WeatherSearchResponse)
def search_weather(payload: WeatherSearchRequest, db: Session = Depends(get_db)):
    client = WeatherClient()
    geo = client.geocode(payload.location)
    if not geo:
        raise HTTPException(status_code=400, detail="Location not found")

    lat = geo["lat"]
    lon = geo["lon"]
    api_data = client.get_current_and_forecast(lat, lon)

    current_raw = api_data["current"]
    forecast_raw = api_data["forecast"]

    # WeatherAPI current structure:
    # current: {
    #   "temp_c", "feelslike_c", "humidity", "wind_kph",
    #   "condition": { "text", "icon", ... }
    # }
    current = CurrentWeather(
        description=current_raw["condition"]["text"],
        icon=current_raw["condition"]["icon"],
        temperature=current_raw["temp_c"],
        feels_like=current_raw["feelslike_c"],
        humidity=current_raw["humidity"],
        wind_speed=round(current_raw["wind_kph"] / 3.6, 1),  # convert kph → m/s
    )

    days = []
    for d in client.summarize_forecast(forecast_raw):
        days.append(
            DailyForecast(
                date=date.fromisoformat(d["date"]),
                min_temp=d["min_temp"],
                max_temp=d["max_temp"],
                icon=d["icon"],
                description=d["description"],
            )
        )

    # If there's a date range, store a record in DB
    temps_json = None
    if payload.start_date and payload.end_date:
        temps_json = json.dumps(
            {
                "forecast_days": [d.dict() for d in days],
            },
            default=str,
        )
        record = WeatherRequest(
            location_input=payload.location,
            normalized_name=geo["name"],
            lat=lat,
            lon=lon,
            start_date=payload.start_date,
            end_date=payload.end_date,
            temps_json=temps_json,
            notes=payload.notes,
        )
        db.add(record)
        db.commit()
        db.refresh(record)

    return WeatherSearchResponse(
        location_name=geo["name"],
        lat=lat,
        lon=lon,
        current=current,
        forecast=days,
    )


@app.get("/api/records", response_model=List[WeatherRequestBase])
def list_records(db: Session = Depends(get_db)):
    records = db.query(WeatherRequest).order_by(WeatherRequest.created_at.desc()).all()
    return records


@app.get("/api/records/{record_id}", response_model=WeatherRequestBase)
def get_record(record_id: int, db: Session = Depends(get_db)):
    record = db.query(WeatherRequest).filter(WeatherRequest.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    return record


@app.put("/api/records/{record_id}", response_model=WeatherRequestBase)
def update_record(
    record_id: int, payload: WeatherRequestUpdate, db: Session = Depends(get_db)
):
    record = db.query(WeatherRequest).filter(WeatherRequest.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    # Simple updates with basic validation
    if payload.location_input:
        record.location_input = payload.location_input
    if payload.start_date:
        record.start_date = payload.start_date
    if payload.end_date:
        if record.start_date and payload.end_date < record.start_date:
            raise HTTPException(status_code=400, detail="end_date must be after start_date")
        record.end_date = payload.end_date
    if payload.notes is not None:
        record.notes = payload.notes

    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@app.delete("/api/records/{record_id}")
def delete_record(record_id: int, db: Session = Depends(get_db)):
    record = db.query(WeatherRequest).filter(WeatherRequest.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    db.delete(record)
    db.commit()
    return {"status": "deleted"}


@app.get("/api/export")
def export_data(fmt: str, db: Session = Depends(get_db)):
    fmt = fmt.lower()
    records = db.query(WeatherRequest).order_by(WeatherRequest.created_at.desc()).all()

    if fmt == "json":
        data = [WeatherRequestBase.from_orm(r).dict() for r in records]
        return data

    if fmt == "csv":
        output = StringIO()
        writer = csv.writer(output)
        writer.writerow(
            ["id", "location_input", "normalized_name", "lat", "lon", "start_date", "end_date", "notes", "created_at"]
        )
        for r in records:
            writer.writerow(
                [
                    r.id,
                    r.location_input,
                    r.normalized_name,
                    r.lat,
                    r.lon,
                    r.start_date,
                    r.end_date,
                    r.notes,
                    r.created_at,
                ]
            )
        output.seek(0)
        return StreamingResponse(
            output,
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=weather_export.csv"},
        )

    if fmt == "markdown":
        lines = ["# Saved Weather Requests", ""]
        for r in records:
            lines.append(f"## #{r.id} - {r.normalized_name or r.location_input}")
            lines.append(f"- Location input: `{r.location_input}`")
            lines.append(f"- Coords: `{r.lat}, {r.lon}`")
            lines.append(f"- Date range: `{r.start_date}` to `{r.end_date}`")
            lines.append(f"- Notes: {r.notes or '-'}")
            lines.append(f"- Created at: `{r.created_at}`")
            lines.append("")
        md = "\n".join(lines)
        return {"markdown": md}

    raise HTTPException(status_code=400, detail="Unsupported export format")


@app.get("/api/extras")
def get_extras(location_name: str, lat: float, lon: float):
    yt_client = YouTubeClient()

    # Always build a map URL from the dynamic coords
    map_url = f"https://www.google.com/maps?q={lat},{lon}&z=11&output=embed"

    videos = []
    try:
        videos = yt_client.search_location_videos(location_name)
    except Exception as e:
        # Log the error, but don't break the endpoint
        print("YouTube error:", e)
        videos = []

    return {
        "videos": videos,
        "mapUrl": map_url,   # <-- NOTE camelCase here
    }
@app.get("/")
def root():
    return {"message": "Weather API is running", "docs": "/docs"}
