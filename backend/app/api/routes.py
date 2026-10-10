import logging

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.ratelimit import contact_limiter
from app.db.session import get_db
from app.repositories import project as project_repo
from app.schemas.contact import ContactAccepted, ContactCreate
from app.schemas.project import ProjectOut
from app.services.contact import submit_inquiry
from app.services.notify import send_inquiry_email

log = logging.getLogger("javian.api")
router = APIRouter(prefix="/api")


@router.get("/health")
def health(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        database = "ok"
    except SQLAlchemyError:
        database = "unavailable"
    return {
        "status": "ok" if database == "ok" else "degraded",
        "version": get_settings().app_version,
        "database": database,
    }


@router.get("/projects", response_model=list[ProjectOut])
def projects(db: Session = Depends(get_db)):
    try:
        return project_repo.list_approved(db)
    except SQLAlchemyError:
        log.exception("projects query failed")
        raise HTTPException(503, "Projects are temporarily unavailable.")


def _client_ip(request: Request) -> str:
    if get_settings().trust_proxy_headers:
        fwd = request.headers.get("x-forwarded-for")
        if fwd:
            return fwd.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


@router.post("/contact", response_model=ContactAccepted, status_code=201)
def contact(payload: ContactCreate, request: Request, background: BackgroundTasks, db: Session = Depends(get_db)):
    s = get_settings()
    if not contact_limiter.allow(_client_ip(request), s.contact_rate_limit, s.contact_rate_window_seconds):
        raise HTTPException(429, "Too many submissions. Please try again later.")
    if payload.website:
        # Honeypot tripped: respond as if accepted so bots learn nothing; store nothing.
        return ContactAccepted(reference="JT-000000")
    try:
        reference, created = submit_inquiry(db, payload)
    except SQLAlchemyError:
        db.rollback()
        log.exception("contact persistence failed")
        raise HTTPException(503, "We couldn't save your inquiry right now. Please try again shortly.")
    if created:  # never for duplicates or honeypot hits
        background.add_task(
            send_inquiry_email,
            reference=reference,
            name=payload.name,
            email=payload.email,
            company=payload.company,
            service=payload.service,
            budget=payload.budget,
            message=payload.message,
        )
    return ContactAccepted(reference=reference)
