from collections.abc import Iterator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import get_settings

_settings = get_settings()
_kwargs: dict = {"pool_pre_ping": True}
if _settings.database_url.startswith("postgresql"):
    _kwargs.update(pool_size=5, max_overflow=5, pool_recycle=1800, connect_args={"connect_timeout": 5})

engine = create_engine(_settings.database_url, **_kwargs)
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


def get_db() -> Iterator[Session]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
