from datetime import datetime, timezone

from sqlalchemy import DateTime, Index, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


def _now() -> datetime:
    return datetime.now(timezone.utc)


class ContactInquiry(Base):
    __tablename__ = "contact_inquiries"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(254))
    company: Mapped[str | None] = mapped_column(String(160), nullable=True)
    service: Mapped[str] = mapped_column(String(60))
    budget: Mapped[str | None] = mapped_column(String(60), nullable=True)
    message: Mapped[str] = mapped_column(Text)
    # salted sha256 of normalized email+message, used only for duplicate detection
    fingerprint: Mapped[str] = mapped_column(String(64), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)

    __table_args__ = (Index("ix_contact_fingerprint_created", "fingerprint", "created_at"),)
