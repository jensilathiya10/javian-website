import re
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

Service = Literal["web", "mobile", "business-software", "ai-automation", "saas", "design", "other"]
Budget = Literal["under-5k", "5k-15k", "15k-50k", "50k-plus", "not-sure"]

_CONTROL = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]")


class ContactCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    company: str | None = Field(default=None, max_length=160)
    service: Service
    budget: Budget | None = None
    message: str = Field(min_length=20, max_length=4000)
    # Honeypot: real users never see or fill this field.
    website: str | None = Field(default=None, max_length=200)

    @field_validator("name", "company", "message", mode="before")
    @classmethod
    def strip_control_chars(cls, v):
        if isinstance(v, str):
            return _CONTROL.sub("", v).strip() or None
        return v

    @field_validator("name", "message")
    @classmethod
    def required_text(cls, v):
        if not v:
            raise ValueError("must not be empty")
        return v


class ContactAccepted(BaseModel):
    status: Literal["received"] = "received"
    reference: str
    message: str = "Thanks, your inquiry was received. We'll reply by email."
