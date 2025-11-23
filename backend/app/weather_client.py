from __future__ import annotations

from typing import Any
import requests

from .config import settings


class WeatherClient:
    """
    Wrapper around WeatherAPI.com.

    Docs:
    - https://www.weatherapi.com/docs/
    """

    BASE_URL = "https://api.weatherapi.com/v1"

    def __init__(self, api_key: str | None = None):
        self.api_key = api_key or settings.weatherapi_key
        if not self.api_key:
            raise RuntimeError("WEATHERAPI_KEY is not configured")

    def geocode(self, query: str) -> dict[str, Any] | None:
        """
        Use WeatherAPI's search endpoint to normalize the location and get lat/lon.
        Accepts city name, zip/postal, coordinates, landmark text, etc.
        """
        params = {
            "key": self.api_key,
            "q": query,
        }
        resp = requests.get(f"{self.BASE_URL}/search.json", params=params, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        if not data:
            return None

        loc = data[0]
        name_parts = [loc.get("name"), loc.get("region"), loc.get("country")]
        name = ", ".join([p for p in name_parts if p])
        return {
            "name": name,
            "lat": loc.get("lat"),
            "lon": loc.get("lon"),
        }

    def get_current_and_forecast(self, lat: float, lon: float) -> dict[str, Any]:
        """
        Use WeatherAPI forecast endpoint to get current conditions + up-to-5-day forecast.
        """
        params = {
            "key": self.api_key,
            "q": f"{lat},{lon}",
            "days": 5,
            "aqi": "no",
            "alerts": "no",
        }
        resp = requests.get(f"{self.BASE_URL}/forecast.json", params=params, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        return {
            "location": data["location"],
            "current": data["current"],
            "forecast": data["forecast"],
        }

    @staticmethod
    def summarize_forecast(forecast_json: dict) -> list[dict]:
        """
        Convert WeatherAPI's daily forecast into the simplified list the rest
        of the app expects.
        """
        days: list[dict] = []
        for day in forecast_json.get("forecastday", [])[:5]:
            d = day["day"]
            days.append(
                {
                    "date": day["date"],             # 'YYYY-MM-DD'
                    "min_temp": d["mintemp_c"],
                    "max_temp": d["maxtemp_c"],
                    "icon": d["condition"]["icon"],  # full URL or //cdn...
                    "description": d["condition"]["text"],
                }
            )
        return days
