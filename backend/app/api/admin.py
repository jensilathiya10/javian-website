import logging

from fastapi import APIRouter, Depends, HTTPException, Query, Request, Response
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import func, or_, select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.api.routes import _client_ip
from app.core.adminauth import (
    COOKIE,
    SESSION_SECONDS,
    admin_enabled,
    login_limiter,
    make_token,
    password_ok,
    require_admin,
)
from app.core.config import get_settings
from app.db.session import get_db
from app.models.contact import ContactInquiry

log = logging.getLogger("javian.admin")
router = APIRouter(prefix="/api/admin")


class LoginIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    password: str = Field(min_length=1, max_length=200)


class InquiryOut(BaseModel):
    id: int
    reference: str
    name: str
    email: str
    company: str | None
    service: str
    budget: str | None
    message: str
    created_at: str


class InquiryPage(BaseModel):
    total: int
    limit: int
    offset: int
    items: list[InquiryOut]


def _out(row: ContactInquiry) -> InquiryOut:
    # The duplicate-detection fingerprint is deliberately never exposed.
    return InquiryOut(
        id=row.id,
        reference=f"JT-{row.id:06d}",
        name=row.name,
        email=row.email,
        company=row.company,
        service=row.service,
        budget=row.budget,
        message=row.message,
        created_at=row.created_at.isoformat(),
    )


@router.post("/login", status_code=204)
def login(payload: LoginIn, request: Request, response: Response):
    s = get_settings()
    if not admin_enabled(s):
        raise HTTPException(404, "Not Found")
    if not login_limiter.allow(_client_ip(request), 10, 15 * 60):
        raise HTTPException(429, "Too many attempts. Please try again later.")
    if not password_ok(s, payload.password):
        log.warning("admin login failed from %s", _client_ip(request))
        raise HTTPException(401, "Incorrect password.")
    response.set_cookie(
        COOKIE,
        make_token(s),
        max_age=SESSION_SECONDS,
        httponly=True,
        samesite="strict",
        secure=s.environment == "production",
        path="/api/admin",
    )
    response.status_code = 204
    return response


@router.post("/logout", status_code=204)
def logout(response: Response):
    response.delete_cookie(COOKIE, path="/api/admin")
    response.status_code = 204
    return response


@router.get("/me", dependencies=[Depends(require_admin)])
def me():
    return {"admin": True}


@router.get("/inquiries", response_model=InquiryPage, dependencies=[Depends(require_admin)])
def list_inquiries(
    q: str | None = Query(default=None, max_length=100),
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
):
    stmt = select(ContactInquiry)
    if q and q.strip():
        term = q.strip().lower()
        stmt = stmt.where(
            or_(
                *[
                    func.lower(col).contains(term, autoescape=True)
                    for col in (ContactInquiry.name, ContactInquiry.email, ContactInquiry.company, ContactInquiry.message, ContactInquiry.service)
                ]
            )
        )
    try:
        total = db.execute(select(func.count()).select_from(stmt.subquery())).scalar_one()
        rows = db.execute(stmt.order_by(ContactInquiry.created_at.desc(), ContactInquiry.id.desc()).limit(limit).offset(offset)).scalars().all()
    except SQLAlchemyError:
        log.exception("admin inquiries query failed")
        raise HTTPException(503, "Inquiries are temporarily unavailable.")
    return InquiryPage(total=total, limit=limit, offset=offset, items=[_out(r) for r in rows])
