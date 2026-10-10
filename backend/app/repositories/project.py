from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.project import Project


def list_approved(db: Session) -> list[Project]:
    stmt = select(Project).where(Project.approved.is_(True)).order_by(Project.sort_order)
    return list(db.execute(stmt).scalars())
