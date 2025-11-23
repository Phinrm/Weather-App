from datetime import date, datetime
from typing import Any, Optional

from pydantic import BaseModel, Field, validator


class WeatherSearchRequest(BaseModel):
    location: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    notes: Optional[str] = None

    @validator("end_date")
    def check_dates(cls, v, values):
        start = values.get("start_date")
        if v and start and v < start:
            raise ValueError("end_date must be on or after start_date")
        return v


class CurrentWeather(BaseModel):
    description: str
    icon: str
    temperature: float
    feels_like: float
    humidity: int
    wind_speed: float


class DailyForecast(BaseModel):
    date: date
    min_temp: float
    max_temp: float
    icon: str
    description: str


class WeatherSearchResponse(BaseModel):
    location_name: str
    lat: float
    lon: float
    current: CurrentWeather
    forecast: list[DailyForecast]


class WeatherRequestBase(BaseModel):
    id: int
    location_input: str
    normalized_name: str
    lat: float
    lon: float
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    temps_json: Optional[str] = None
    notes: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        orm_mode = True


class WeatherRequestUpdate(BaseModel):
    location_input: Optional[str] = Field(None)
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    notes: Optional[str] = None


class ExportFormat(BaseModel):
    format: str = Field("json", pattern="^(json|csv|markdown)$")
