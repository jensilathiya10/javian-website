from sqlalchemy import select

from app.db.session import SessionLocal
from app.models.contact import ContactInquiry

VALID = {
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "company": "Analytical Co",
    "service": "ai-automation",
    "budget": "15k-50k",
    "message": "We want to automate our invoice processing workflow.",
}


def count_rows():
    with SessionLocal() as db:
        return len(db.execute(select(ContactInquiry)).scalars().all())


def test_health(client):
    r = client.get("/api/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok" and r.json()["version"]


def test_projects(client):
    r = client.get("/api/projects")
    assert r.status_code == 200
    data = r.json()
    assert len(data) == 4 and {"slug", "title", "tags"} <= data[0].keys()
    assert all(p["kind"] == "concept" for p in data)


def test_contact_stores(client):
    r = client.post("/api/contact", json=VALID)
    assert r.status_code == 201 and r.json()["reference"].startswith("JT-")
    with SessionLocal() as db:
        rows = db.execute(select(ContactInquiry)).scalars().all()
    assert len(rows) == 1 and rows[0].email == "ada@example.com"


def test_contact_invalid(client):
    bad_payloads = [
        {**VALID, "email": "nope"},
        {**VALID, "message": "short"},
        {**VALID, "service": "hacking"},
        {**VALID, "extra": "x"},
        {k: v for k, v in VALID.items() if k != "name"},
    ]
    for bad in bad_payloads:
        r = client.post("/api/contact", json=bad)
        assert r.status_code == 422, bad
        assert "fields" in r.json()
    assert count_rows() == 0


def test_duplicate_not_stored_twice(client):
    a = client.post("/api/contact", json=VALID).json()["reference"]
    b = client.post("/api/contact", json=VALID).json()["reference"]
    assert a == b and count_rows() == 1


def test_honeypot_not_stored(client):
    r = client.post("/api/contact", json={**VALID, "website": "http://spam"})
    assert r.status_code == 201 and count_rows() == 0


def test_rate_limit(client):
    codes = [
        client.post("/api/contact", json={**VALID, "message": f"Unique message number {i} for testing"}).status_code
        for i in range(7)
    ]
    assert codes[:5] == [201] * 5 and codes[5] == 429


def test_no_public_listing_of_inquiries(client):
    assert client.get("/api/contact").status_code == 405
    assert client.get("/api/inquiries").status_code == 404
