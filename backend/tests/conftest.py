import os

os.environ["DATABASE_URL"] = "sqlite:///./test.db"
os.environ["ENVIRONMENT"] = "test"

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from app.core.ratelimit import contact_limiter  # noqa: E402
from app.db.base import Base  # noqa: E402
from app.db.seed import seed_projects  # noqa: E402
from app.db.session import SessionLocal, engine  # noqa: E402
from app.main import app  # noqa: E402


@pytest.fixture()
def client():
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    with SessionLocal() as db:
        seed_projects(db)
    contact_limiter.reset()
    with TestClient(app) as c:
        yield c
