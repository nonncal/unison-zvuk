"""Room capacity, collaboration, persistent playlist and admission requests."""

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision = "10ab15cd0001"
down_revision = "8210be9ecf46"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.drop_constraint(op.f("ck_rooms_capacity"), "rooms", type_="check")
    op.create_check_constraint("capacity", "rooms", "capacity BETWEEN 2 AND 10")
    op.add_column(
        "rooms", sa.Column("moderated", sa.Boolean(), nullable=False, server_default=sa.false())
    )
    op.add_column(
        "rooms",
        sa.Column(
            "playlist", postgresql.JSONB(), nullable=False, server_default=sa.text("'{}'::jsonb")
        ),
    )
    op.execute(
        "UPDATE rooms SET playlist=jsonb_build_object('trackIds',coalesce("
        "(SELECT jsonb_agg(id::text ORDER BY title) FROM tracks "
        "WHERE scope='catalog' AND status='ready'),'[]'::jsonb))"
    )
    op.add_column(
        "participants",
        sa.Column("can_edit", sa.Boolean(), nullable=False, server_default=sa.false()),
    )
    op.add_column("tracks", sa.Column("cover_data", sa.LargeBinary(), nullable=True))
    op.add_column(
        "tracks", sa.Column("cover_version", sa.Integer(), nullable=False, server_default="0")
    )
    op.create_table(
        "admissions",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column(
            "room_id", sa.Uuid(), sa.ForeignKey("rooms.id", ondelete="CASCADE"), nullable=False
        ),
        sa.Column(
            "session_id",
            sa.Uuid(),
            sa.ForeignKey("sessions.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("display_name", sa.String(32), nullable=False),
        sa.Column("status", sa.String(16), nullable=False),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()
        ),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("room_id", "session_id"),
        sa.CheckConstraint(
            "status IN ('pending','approved','admitted','rejected','cancelled')", name="status"
        ),
    )
    op.create_index("ix_admissions_room_id", "admissions", ["room_id"])
    op.create_index("ix_admissions_expires_at", "admissions", ["expires_at"])


def downgrade() -> None:
    # Refuse to discard group data by shrinking occupied rooms below their membership.
    op.execute(
        "DO $$ BEGIN IF EXISTS(SELECT 1 FROM rooms WHERE capacity>2) "
        "THEN RAISE EXCEPTION 'Group rooms must be migrated before downgrade'; "
        "END IF; END $$"
    )
    op.drop_table("admissions")
    op.drop_column("tracks", "cover_version")
    op.drop_column("tracks", "cover_data")
    op.drop_column("participants", "can_edit")
    op.drop_column("rooms", "playlist")
    op.drop_column("rooms", "moderated")
    op.drop_constraint(op.f("ck_rooms_capacity"), "rooms", type_="check")
    op.create_check_constraint("capacity", "rooms", "capacity=2")
