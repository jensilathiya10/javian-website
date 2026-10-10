# Javian Technologies website

React + Vite + TypeScript + Tailwind frontend, FastAPI + SQLAlchemy + Alembic backend, PostgreSQL.

## Run locally

```bash
# 1. Database (host port 55432; override with DB_HOST_PORT)
docker compose up -d db

# 2. Backend
cd backend
python -m venv .venv && .venv/Scripts/activate      # Linux/macOS: source .venv/bin/activate
pip install -r requirements-dev.txt
cp .env.example .env                                 # then edit values
alembic upgrade head
uvicorn app.main:app --reload --port 8000

# 3. Frontend (proxies /api to :8000)
cd frontend
npm install
npm run dev                                          # http://localhost:5173
```

Use `127.0.0.1` rather than `localhost` in `DATABASE_URL` on Windows: `localhost` can resolve to IPv6 and stall.

## Everything in Docker

```bash
SECRET_SALT=$(python -c "import secrets;print(secrets.token_urlsafe(48))") docker compose up -d --build
# site: http://localhost:8080  (nginx serves the SPA and proxies /api)
```

## Tests

```bash
cd backend && pytest        # API, validation, dedupe, honeypot, rate limit (SQLite)
cd frontend && npm test     # validation + contact form states
```

## API

| Endpoint | Purpose |
| --- | --- |
| `GET /api/health` | status, version, database state |
| `GET /api/projects` | approved projects (cacheable 5 min) |
| `POST /api/contact` | store an inquiry (validated, rate limited, de-duplicated, honeypot) |
| `/api/admin/*` | password-protected inquiry viewer (login, logout, me, inquiries); 404 when disabled |

New inquiries can also be emailed to you: set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `NOTIFY_TO` (comma-separated) and optionally `NOTIFY_FROM` in `backend/.env`. Mail is sent in the background after the inquiry is saved; a mail failure is logged and never loses or fails the inquiry. Duplicates and honeypot hits send nothing. Replying to the email answers the visitor (Reply-To).

### Admin page (view inquiries)

Open `/admin`. It exists only when `ADMIN_PASSWORD` is set in `backend/.env` (generate one with `python -c "import secrets;print(secrets.token_urlsafe(24))"`); without it every `/api/admin/*` route answers 404. Sign in sets a signed, HTTP-only, SameSite=Strict cookie valid for 8 hours (`Secure` in production); login attempts are limited to 10 per 15 minutes per IP. In production the admin stays disabled while `SECRET_SALT` is still `change-me`. The page lists inquiries newest first with search and pagination, and renders messages as plain text. It is excluded in `robots.txt` and marked `noindex`. Inquiries can also still be read with SQL: `select * from contact_inquiries order by created_at desc;`.
Services are static frontend content, and the optional AI chat endpoint was not built (no genuine AI feature yet).

## Still to configure before launch

- `VITE_CONTACT_EMAIL` (frontend): no email is shown until set. No social links were supplied, so none are shown.
- Replace `example.com` in `frontend/public/sitemap.xml` and `robots.txt` with the real domain.
- Review `/privacy` with legal counsel (marked as a draft on the page).
- Set `SECRET_SALT`, `CORS_ORIGINS`, Postgres credentials; keep `TRUST_PROXY_HEADERS=true` only behind a trusted proxy.
- Rate limiting is in-process memory; use Redis if you run several API replicas.
- Work items are labeled concepts. Replace them (in `backend/app/db/seed.py` / DB `projects` table) when real projects are available. The frontend also holds a fallback copy in `src/lib/projects.ts`.
- Add a CI workflow running the two test commands and `npm run build`.
