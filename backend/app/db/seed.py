from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.project import Project

# Honest content: these are product concepts, not client work.
CONCEPTS = [
    dict(
        slug="operations-hub",
        title="Operations Hub",
        kind="concept",
        summary="A concept workspace that connects orders, inventory and team tasks in one place.",
        problem="Operations teams often run on spreadsheets and chat threads, so nobody sees the same up-to-date picture.",
        approach="A modular platform with a shared data model, role-based views and automation rules for repetitive hand-offs.",
        tags=["ERP", "Dashboards", "React", "FastAPI", "PostgreSQL"],
        sort_order=1,
    ),
    dict(
        slug="knowledge-desk",
        title="Knowledge Desk",
        kind="concept",
        summary="A concept AI assistant that answers questions from a company's own documents.",
        problem="Teams lose time searching policies, manuals and past answers scattered across drives and inboxes.",
        approach="Document ingestion, embeddings and semantic search with retrieval-augmented answers that cite their sources.",
        tags=["AI", "RAG", "Semantic search", "Python"],
        sort_order=2,
    ),
    dict(
        slug="counter-pos",
        title="Counter POS",
        kind="concept",
        summary="A concept point-of-sale and inventory app for retail counters.",
        problem="Shops need fast checkout and stock that updates itself, without juggling separate tools.",
        approach="A touch-friendly checkout flow with live inventory, barcode support and daily reporting.",
        tags=["POS", "Inventory", "Mobile", "Offline-first"],
        sort_order=3,
    ),
    dict(
        slug="client-pulse",
        title="Client Pulse",
        kind="concept",
        summary="A concept CRM that turns inquiries and follow-ups into a clear pipeline.",
        problem="Leads slip through the cracks when follow-ups depend on memory and scattered notes.",
        approach="A lightweight pipeline with reminders, activity history and workflow automation for routine follow-ups.",
        tags=["CRM", "Automation", "SaaS", "TypeScript"],
        sort_order=4,
    ),
]


def seed_projects(db: Session) -> None:
    existing = set(db.execute(select(Project.slug)).scalars())
    for c in CONCEPTS:
        if c["slug"] not in existing:
            db.add(Project(approved=True, **c))
    db.commit()
