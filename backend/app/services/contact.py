import hashlib

from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.repositories import contact as repo
from app.schemas.contact import ContactCreate


def _fingerprint(data: ContactCreate) -> str:
    salt = get_settings().secret_salt
    raw = f"{salt}|{data.email.lower()}|{' '.join(data.message.lower().split())}"
    return hashlib.sha256(raw.encode()).hexdigest()


def submit_inquiry(db: Session, data: ContactCreate) -> tuple[str, bool]:
    """Returns (reference, created). A recent duplicate returns the original reference."""
    settings = get_settings()
    fp = _fingerprint(data)
    existing = repo.find_recent_duplicate(db, fp, settings.duplicate_window_seconds)
    if existing:
        return f"JT-{existing.id:06d}", False
    row = repo.create(
        db,
        name=data.name,
        email=data.email.lower(),
        company=data.company,
        service=data.service,
        budget=data.budget,
        message=data.message,
        fingerprint=fp,
    )
    return f"JT-{row.id:06d}", True
