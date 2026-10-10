import pytest

from app.core import adminauth
from app.core.config import Settings

VALID = {
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "company": "Analytical Co",
    "service": "ai-automation",
    "budget": "15k-50k",
    "message": "We want to automate our invoice processing workflow.",
}
PW = "correct horse battery staple"


def use_settings(monkeypatch, **kw):
    s = Settings(secret_salt="test-salt", **kw)
    monkeypatch.setattr(adminauth, "get_settings", lambda: s)
    monkeypatch.setattr("app.api.admin.get_settings", lambda: s)
    adminauth.login_limiter.reset()
    return s


@pytest.fixture()
def admin(client, monkeypatch):
    use_settings(monkeypatch, admin_password=PW)
    return client


def sign_in(c, pw=PW):
    return c.post("/api/admin/login", json={"password": pw})


def test_admin_is_invisible_when_not_configured(client, monkeypatch):
    use_settings(monkeypatch, admin_password=None)
    assert client.get("/api/admin/inquiries").status_code == 404
    assert client.post("/api/admin/login", json={"password": "x"}).status_code == 404


def test_production_refuses_default_salt(client, monkeypatch):
    s = Settings(admin_password=PW, environment="production", secret_salt="change-me")
    monkeypatch.setattr(adminauth, "get_settings", lambda: s)
    monkeypatch.setattr("app.api.admin.get_settings", lambda: s)
    assert client.post("/api/admin/login", json={"password": PW}).status_code == 404


def test_requires_sign_in(admin):
    assert admin.get("/api/admin/inquiries").status_code == 401
    assert admin.get("/api/admin/me").status_code == 401


def test_wrong_password_rejected(admin):
    r = sign_in(admin, "nope")
    assert r.status_code == 401 and "javian_admin" not in r.cookies
    assert admin.get("/api/admin/inquiries").status_code == 401


def test_login_sets_httponly_strict_cookie_and_unlocks(admin):
    r = sign_in(admin)
    assert r.status_code == 204
    cookie = r.headers["set-cookie"].lower()
    assert "httponly" in cookie and "samesite=strict" in cookie and "path=/api/admin" in cookie
    assert admin.get("/api/admin/me").json() == {"admin": True}


def test_lists_inquiries_without_internal_fields(admin):
    admin.post("/api/contact", json=VALID)
    sign_in(admin)
    data = admin.get("/api/admin/inquiries").json()
    assert data["total"] == 1
    item = data["items"][0]
    assert item["reference"].startswith("JT-") and item["email"] == "ada@example.com"
    assert "fingerprint" not in item
    assert "fingerprint" not in str(data)


def test_search_and_pagination(admin):
    for i, name in enumerate(["Alice Smith", "Bob Jones", "Carol Smith"]):
        admin.post("/api/contact", json={**VALID, "name": name, "email": f"u{i}@example.com", "message": f"Unique message body number {i} for tests"})
    sign_in(admin)
    assert admin.get("/api/admin/inquiries", params={"q": "smith"}).json()["total"] == 2
    assert admin.get("/api/admin/inquiries", params={"q": "ZZZ-none"}).json()["total"] == 0
    page = admin.get("/api/admin/inquiries", params={"limit": 2, "offset": 0}).json()
    assert page["total"] == 3 and len(page["items"]) == 2
    rest = admin.get("/api/admin/inquiries", params={"limit": 2, "offset": 2}).json()
    assert len(rest["items"]) == 1
    # newest first
    assert page["items"][0]["name"] == "Carol Smith"


def test_search_treats_wildcards_literally(admin):
    admin.post("/api/contact", json=VALID)
    sign_in(admin)
    assert admin.get("/api/admin/inquiries", params={"q": "%"}).json()["total"] == 0
    assert admin.get("/api/admin/inquiries", params={"q": "_"}).json()["total"] == 0


def test_limit_is_capped(admin):
    sign_in(admin)
    assert admin.get("/api/admin/inquiries", params={"limit": 1000}).status_code == 422
    assert admin.get("/api/admin/inquiries", params={"offset": -1}).status_code == 422


def test_logout_locks_again(admin):
    sign_in(admin)
    assert admin.post("/api/admin/logout").status_code == 204
    admin.cookies.clear()
    assert admin.get("/api/admin/inquiries").status_code == 401


def test_tampered_and_expired_tokens_rejected(admin, monkeypatch):
    s = use_settings(monkeypatch, admin_password=PW)
    good = adminauth.make_token(s)
    assert adminauth.verify_token(s, good)
    assert not adminauth.verify_token(s, good[:-3] + "AAA")
    assert not adminauth.verify_token(s, "not-a-token")
    assert not adminauth.verify_token(s, None)
    old = adminauth.make_token(s, now=0)  # expired long ago
    assert not adminauth.verify_token(s, old)
    # a token signed with a different salt is rejected
    other = Settings(secret_salt="another-salt", admin_password=PW)
    assert not adminauth.verify_token(s, adminauth.make_token(other))
    admin.cookies.set("javian_admin", old, path="/api/admin")
    assert admin.get("/api/admin/inquiries").status_code == 401


def test_login_is_rate_limited(admin):
    codes = [sign_in(admin, "wrong").status_code for _ in range(12)]
    assert codes[:10] == [401] * 10 and codes[10] == 429
    assert sign_in(admin).status_code == 429  # even the right password waits out the lockout
