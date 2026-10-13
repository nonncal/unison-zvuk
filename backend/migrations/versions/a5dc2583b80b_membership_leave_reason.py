"""Distinguish explicit leave from expired offline reservation."""

import sqlalchemy as sa
from alembic import op

revision = "a5dc2583b80b"
down_revision = "1c114c25f8c0"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("participants", sa.Column("left_reason", sa.String(32), nullable=True))
    op.execute("UPDATE participants SET left_reason = 'left' WHERE left_at IS NOT NULL")
    op.create_check_constraint(
        op.f("ck_participants_leave_reason"),
        "participants",
        "(left_at IS NULL AND left_reason IS NULL) OR "
        "(left_at IS NOT NULL AND left_reason IS NOT NULL "
        "AND left_reason IN ('left','offlineTimeout'))",
    )


def downgrade() -> None:
    op.drop_constraint(op.f("ck_participants_leave_reason"), "participants", type_="check")
    op.drop_column("participants", "left_reason")
