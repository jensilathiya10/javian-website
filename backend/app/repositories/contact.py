from datetime import datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.contact import ContactInquiry


def find_recent_duplicate(db: Session, fingerprint: str, window_seconds: int) -> ContactInquiry | None:
    since = datetime.now(timezone.utc) - timedelta(seconds=window_seconds)
    stmt = select(ContactInquiry).where(
        ContactInquiry.fingerprint == fingerprint, ContactInquiry.created_at >= since
    )
    return db.execute(stmt.limit(1)).scalar_one_or_none()


def create(db: Session, **fields) -> ContactInquiry:
    row = ContactInquiry(**fields)
    db.add(row)
    db.commit()
    return row
