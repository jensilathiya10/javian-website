import base64
import hashlib
import hmac
import time

from fastapi import HTTPException, Request

from app.core.config import Settings, get_settings
from app.core.ratelimit import SlidingWindowLimiter

COOKIE = "javian_admin"
SESSION_SECONDS = 8 * 3600
login_limiter = SlidingWindowLimiter()


def admin_enabled(s: Settings) -> bool:
    """Admin exists only when a password is set (and, in production, the signing salt is not the default)."""
    if not s.admin_password:
        return False
    if s.environment == "production" and s.secret_salt == "change-me":
        return False
    return True


def _sign(s: Settings, expires: int) -> str:
    key = hashlib.sha256(f"admin-session|{s.secret_salt}".encode()).digest()
    return hmac.new(key, f"admin|{expires}".encode(), hashlib.sha256).hexdigest()


def make_token(s: Settings, now: float | None = None) -> str:
    expires = int((now if now is not None else time.time()) + SESSION_SECONDS)
    return base64.urlsafe_b64encode(f"{expires}.{_sign(s, expires)}".encode()).decode()


def verify_token(s: Settings, token: str | None, now: float | None = None) -> bool:
    if not token:
        return False
    try:
        expires_text, sig = base64.urlsafe_b64decode(token.encode()).decode().split(".", 1)
        expires = int(expires_text)
    except Exception:  # noqa: BLE001 - any malformed token is simply invalid
        return False
    if expires < (now if now is not None else time.time()):
        return False
    return hmac.compare_digest(sig, _sign(s, expires))


def password_ok(s: Settings, candidate: str) -> bool:
    # Compare digests so length differences do not leak and the comparison is constant time.
    a = hashlib.sha256(candidate.encode()).digest()
    b = hashlib.sha256((s.admin_password or "").encode()).digest()
    return hmac.compare_digest(a, b)


def require_admin(request: Request) -> None:
    s = get_settings()
    if not admin_enabled(s):
        raise HTTPException(404, "Not Found")  # do not reveal that an admin area exists
    if not verify_token(s, request.cookies.get(COOKIE)):
        raise HTTPException(401, "Please sign in.")
