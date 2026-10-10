"""initial: contact_inquiries and projects

Revision ID: 0001
Revises:
"""
import sqlalchemy as sa
from alembic import op

revision = "0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "contact_inquiries",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("name", sa.String(120), nullable=False),
        sa.Column("email", sa.String(254), nullable=False),
        sa.Column("company", sa.String(160)),
        sa.Column("service", sa.String(60), nullable=False),
        sa.Column("budget", sa.String(60)),
        sa.Column("message", sa.Text, nullable=False),
        sa.Column("fingerprint", sa.String(64), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_contact_inquiries_fingerprint", "contact_inquiries", ["fingerprint"])
    op.create_index("ix_contact_fingerprint_created", "contact_inquiries", ["fingerprint", "created_at"])
    op.create_table(
        "projects",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("slug", sa.String(80), nullable=False),
        sa.Column("title", sa.String(120), nullable=False),
        sa.Column("kind", sa.String(40), nullable=False),
        sa.Column("summary", sa.Text, nullable=False),
        sa.Column("problem", sa.Text, nullable=False),
        sa.Column("approach", sa.Text, nullable=False),
        sa.Column("tags", sa.JSON, nullable=False),
        sa.Column("sort_order", sa.Integer, nullable=False),
        sa.Column("approved", sa.Boolean, nullable=False),
    )
    op.create_index("ix_projects_slug", "projects", ["slug"], unique=True)


def downgrade() -> None:
    op.drop_table("projects")
    op.drop_table("contact_inquiries")
