"""Persist removal separately from a voluntary exit or temporary disconnect."""

from alembic import op

revision = "10ab15cd0002"
down_revision = "10ab15cd0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.drop_constraint(op.f("ck_participants_leave_reason"), "participants", type_="check")
    op.create_check_constraint(
        "leave_reason",
        "participants",
        "(left_at IS NULL AND left_reason IS NULL) OR "
        "(left_at IS NOT NULL AND left_reason IS NOT NULL "
        "AND left_reason IN ('left','offlineTimeout','removed'))",
    )


def downgrade() -> None:
    op.execute("UPDATE participants SET left_reason='left' WHERE left_reason='removed'")
    op.drop_constraint(op.f("ck_participants_leave_reason"), "participants", type_="check")
    op.create_check_constraint(
        "leave_reason",
        "participants",
        "(left_at IS NULL AND left_reason IS NULL) OR "
        "(left_at IS NOT NULL AND left_reason IS NOT NULL "
        "AND left_reason IN ('left','offlineTimeout'))",
    )
