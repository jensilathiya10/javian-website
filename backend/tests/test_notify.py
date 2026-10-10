import pytest
from sqlalchemy import select

from app.core.config import Settings
from app.db.session import SessionLocal
from app.models.contact import ContactInquiry
from app.services import notify

VALID = {
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "company": "Analytical Co",
    "service": "ai-automation",
    "budget": "15k-50k",
    "message": "We want to automate our invoice processing workflow.",
}


class FakeSMTP:
    sent: list = []
    calls: list = []
    fail = False

    def __init__(self, host, port, timeout=None):
        FakeSMTP.calls.append(("connect", host, port))

    def __enter__(self):
        return self

    def __exit__(self, *a):
        return False

    def starttls(self):
        FakeSMTP.calls.append(("starttls",))

    def login(self, user, password):
        FakeSMTP.calls.append(("login", user))

    def send_message(self, msg):
        if FakeSMTP.fail:
            raise OSError("smtp down")
        FakeSMTP.sent.append(msg)


@pytest.fixture()
def mail(monkeypatch):
    FakeSMTP.sent, FakeSMTP.calls, FakeSMTP.fail = [], [], False
    s = Settings(
        smtp_host="smtp.test", smtp_port=587, smtp_user="mailer@javian.test", smtp_password="pw",
        notify_to="owner@javian.test, second@javian.test", notify_from="Javian <noreply@javian.test>",
    )
    monkeypatch.setattr(notify, "get_settings", lambda: s)
    monkeypatch.setattr(notify.smtplib, "SMTP", FakeSMTP)
    return FakeSMTP


def test_new_inquiry_sends_one_email(client, mail):
    r = client.post("/api/contact", json=VALID)
    assert r.status_code == 201
    assert len(mail.sent) == 1
    msg = mail.sent[0]
    ref = r.json()["reference"]
    assert ref in msg["Subject"] and "Ada Lovelace" in msg["Subject"]
    assert msg["To"] == "owner@javian.test, second@javian.test"
    assert msg["Reply-To"] == "ada@example.com"
    body = msg.get_content()
    assert "invoice processing" in body and "Analytical Co" in body and "15k-50k" in body
    assert ("starttls",) in mail.calls and ("login", "mailer@javian.test") in mail.calls


def test_duplicate_and_honeypot_send_nothing(client, mail):
    client.post("/api/contact", json=VALID)
    client.post("/api/contact", json=VALID)  # duplicate
    client.post("/api/contact", json={**VALID, "email": "bot@example.com", "website": "http://spam"})
    assert len(mail.sent) == 1


def test_disabled_when_not_configured(client, monkeypatch):
    FakeSMTP.sent, FakeSMTP.calls = [], []
    monkeypatch.setattr(notify, "get_settings", lambda: Settings(smtp_host=None, notify_to=None))
    monkeypatch.setattr(notify.smtplib, "SMTP", FakeSMTP)
    assert client.post("/api/contact", json=VALID).status_code == 201
    assert FakeSMTP.calls == [] and FakeSMTP.sent == []


def test_mail_failure_never_breaks_or_loses_the_inquiry(client, mail):
    mail.fail = True
    r = client.post("/api/contact", json=VALID)
    assert r.status_code == 201
    with SessionLocal() as db:
        assert len(db.execute(select(ContactInquiry)).scalars().all()) == 1


def test_visitor_text_cannot_inject_headers(client, mail):
    evil = {**VALID, "name": "Eve\r\nBcc: attacker@evil.test", "company": "Co\r\nX-Injected: 1"}
    assert client.post("/api/contact", json=evil).status_code == 201
    msg = mail.sent[0]
    assert "\n" not in msg["Subject"] and "\r" not in msg["Subject"]
    assert msg["Bcc"] is None and msg["X-Injected"] is None
    assert "attacker@evil.test" not in (msg["To"] or "")


def test_implicit_tls_port_uses_ssl(client, monkeypatch):
    used = []

    class FakeSSL(FakeSMTP):
        def __init__(self, host, port, timeout=None):
            used.append(port)

    FakeSSL.sent = []
    s = Settings(smtp_host="smtp.test", smtp_port=465, notify_to="owner@javian.test")
    monkeypatch.setattr(notify, "get_settings", lambda: s)
    monkeypatch.setattr(notify.smtplib, "SMTP_SSL", FakeSSL)
    assert client.post("/api/contact", json=VALID).status_code == 201
    assert used == [465]
