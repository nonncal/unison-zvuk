"""Record media provenance, upload completion and storage cleanup."""

import sqlalchemy as sa
from alembic import op

revision = "0e250803b4e8"
down_revision = "ff328440a251"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("tracks", sa.Column("source_uri", sa.String(512), nullable=True))
    op.add_column("tracks", sa.Column("license_id", sa.String(64), nullable=True))
    op.add_column("tracks", sa.Column("license_uri", sa.String(512), nullable=True))
    op.add_column("uploads", sa.Column("complete_checksum", sa.String(64), nullable=True))
    op.add_column("uploads", sa.Column("purged_at", sa.DateTime(timezone=True), nullable=True))


def downgrade() -> None:
    op.drop_column("uploads", "purged_at")
    op.drop_column("uploads", "complete_checksum")
    op.drop_column("tracks", "license_uri")
    op.drop_column("tracks", "license_id")
    op.drop_column("tracks", "source_uri")
