from functools import lru_cache

from pydantic import field_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict
from typing import Annotated


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "Javian Technologies API"
    app_version: str = "1.0.0"
    environment: str = "development"
    database_url: str = "postgresql+psycopg://javian:javian@127.0.0.1:55432/javian"
    # Comma-separated list in the environment.
    cors_origins: Annotated[list[str], NoDecode] = ["http://localhost:5173"]
    # Salt for duplicate-detection fingerprints. Set a long random value in production.
    secret_salt: str = "change-me"
    contact_rate_limit: int = 5  # submissions per window, per client IP
    contact_rate_window_seconds: int = 3600
    duplicate_window_seconds: int = 86400
    trust_proxy_headers: bool = False
    # Email notification for new inquiries. Off unless SMTP_HOST and NOTIFY_TO are both set.
    smtp_host: str | None = None
    smtp_port: int = 587  # 587 = STARTTLS, 465 = implicit TLS
    smtp_user: str | None = None
    smtp_password: str | None = None
    smtp_starttls: bool = True
    notify_to: str | None = None  # comma-separated recipients
    notify_from: str | None = None
    # Admin area (view inquiries). Disabled, and the endpoints answer 404, unless a password is set.
    admin_password: str | None = None

    @field_validator("cors_origins", mode="before")
    @classmethod
    def split_origins(cls, v):
        if isinstance(v, str):
            return [o.strip() for o in v.split(",") if o.strip()]
        return v


@lru_cache
def get_settings() -> Settings:
    return Settings()
