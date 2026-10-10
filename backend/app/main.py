import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.admin import router as admin_router
from app.api.routes import router
from app.core.config import get_settings
from app.db.seed import seed_projects
from app.db.session import SessionLocal

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")
log = logging.getLogger("javian")


@asynccontextmanager
async def lifespan(_: FastAPI):
    try:
        with SessionLocal() as db:
            seed_projects(db)
    except Exception:  # DB may not be migrated/reachable yet; /api/health reports it.
        log.warning("project seeding skipped (database not ready)")
    yield


def create_app() -> FastAPI:
    s = get_settings()
    prod = s.environment == "production"
    app = FastAPI(
        title=s.app_name,
        version=s.app_version,
        lifespan=lifespan,
        docs_url=None if prod else "/docs",
        redoc_url=None,
        openapi_url=None if prod else "/openapi.json",
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=s.cors_origins,
        allow_methods=["GET", "POST"],
        allow_headers=["Content-Type"],
        # No allow_credentials: the admin page is same-origin (Vite proxy / nginx), never cross-origin.
        max_age=600,
    )

    @app.middleware("http")
    async def security_headers(request: Request, call_next):
        resp = await call_next(request)
        resp.headers["X-Content-Type-Options"] = "nosniff"
        resp.headers["Referrer-Policy"] = "no-referrer"
        if request.url.path == "/api/projects":
            resp.headers["Cache-Control"] = "public, max-age=300"
        else:
            resp.headers["Cache-Control"] = "no-store"
        return resp

    @app.exception_handler(RequestValidationError)
    async def validation_handler(_: Request, exc: RequestValidationError):
        fields = {}
        for e in exc.errors():
            loc = [str(p) for p in e["loc"] if p != "body"]
            fields[".".join(loc)] = e["msg"]
        return JSONResponse(
            {"detail": "Please check the highlighted fields.", "fields": fields}, status_code=422
        )

    app.include_router(router)
    app.include_router(admin_router)
    return app


app = create_app()
