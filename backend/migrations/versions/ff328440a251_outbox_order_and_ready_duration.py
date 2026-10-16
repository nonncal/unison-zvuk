"""Order committed events and require duration for ready tracks."""

import sqlalchemy as sa
from alembic import op

revision = "ff328440a251"
down_revision = "03e2704977e3"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "outbox", sa.Column("sequence", sa.BigInteger(), sa.Identity(always=True), nullable=False)
    )
    op.create_unique_constraint(op.f("uq_outbox_sequence"), "outbox", ["sequence"])
    op.drop_constraint(op.f("ck_tracks_ready_asset"), "tracks", type_="check")
    op.create_check_constraint(
        op.f("ck_tracks_ready_asset"),
        "tracks",
        "status != 'ready' OR (playback_asset_id IS NOT NULL "
        "AND duration_ms IS NOT NULL AND duration_ms > 0)",
    )


def downgrade() -> None:
    op.drop_constraint(op.f("ck_tracks_ready_asset"), "tracks", type_="check")
    op.create_check_constraint(
        op.f("ck_tracks_ready_asset"),
        "tracks",
        "status != 'ready' OR (playback_asset_id IS NOT NULL AND duration_ms > 0)",
    )
    op.drop_constraint(op.f("uq_outbox_sequence"), "outbox", type_="unique")
    op.drop_column("outbox", "sequence")
