"""Bound upload processing attempts and recover interrupted workers."""

import sqlalchemy as sa
from alembic import op

revision = "8210be9ecf46"
down_revision = "0e250803b4e8"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "uploads",
        sa.Column("processing_attempts", sa.Integer(), server_default="0", nullable=False),
    )
    op.add_column(
        "uploads", sa.Column("processing_started_at", sa.DateTime(timezone=True), nullable=True)
    )
    op.add_column("uploads", sa.Column("processing_attempt_id", sa.Uuid(), nullable=True))
    op.create_check_constraint(
        "processing_attempts", "uploads", "processing_attempts BETWEEN 0 AND 3"
    )


def downgrade() -> None:
    op.drop_constraint(op.f("ck_uploads_processing_attempts"), "uploads", type_="check")
    op.drop_column("uploads", "processing_attempt_id")
    op.drop_column("uploads", "processing_started_at")
    op.drop_column("uploads", "processing_attempts")
