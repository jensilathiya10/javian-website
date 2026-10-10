from sqlalchemy import JSON, Boolean, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(120))
    kind: Mapped[str] = mapped_column(String(40))  # concept | internal | client
    summary: Mapped[str] = mapped_column(Text)
    problem: Mapped[str] = mapped_column(Text)
    approach: Mapped[str] = mapped_column(Text)
    tags: Mapped[list] = mapped_column(JSON, default=list)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    approved: Mapped[bool] = mapped_column(Boolean, default=False)
