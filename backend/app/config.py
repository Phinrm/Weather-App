from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # WeatherAPI key
    weatherapi_key: str | None = None
    # Optional YouTube key
    youtube_api_key: str | None = None

    # Database URL
    database_url: str = "sqlite:///./weather.db"

    # Pydantic v2 config
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()
