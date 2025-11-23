from sqlalchemy import Column, Integer, String, Date, DateTime, Text, Float
from sqlalchemy.sql import func

from .database import Base


class WeatherRequest(Base):
    __tablename__ = "weather_requests"

    id = Column(Integer, primary_key=True, index=True)
    location_input = Column(String(255), index=True)
    normalized_name = Column(String(255), index=True)
    lat = Column(Float)
    lon = Column(Float)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    temps_json = Column(Text, nullable=True)
    notes = Column(String(255), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
