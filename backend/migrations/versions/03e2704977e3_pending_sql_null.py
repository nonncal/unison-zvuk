"""Use SQL null for absent pending transitions."""

from alembic import op

revision = "03e2704977e3"
down_revision = "a5dc2583b80b"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        "UPDATE playback_states SET pending_transition = NULL "
        "WHERE pending_transition = 'null'::jsonb"
    )


def downgrade() -> None:
    pass
