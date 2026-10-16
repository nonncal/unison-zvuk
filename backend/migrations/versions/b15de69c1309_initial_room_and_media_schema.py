"""initial room and media schema"""

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision = "b15de69c1309"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "assets",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("object_key", sa.String(length=512), nullable=False),
        sa.Column("checksum", sa.String(length=64), nullable=False),
        sa.Column("content_type", sa.String(length=128), nullable=False),
        sa.Column("size_bytes", sa.BigInteger(), nullable=False),
        sa.Column("media_version", sa.String(length=128), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=True),
        sa.CheckConstraint("size_bytes > 0", name=op.f("ck_assets_size")),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_assets")),
        sa.UniqueConstraint("object_key", name=op.f("uq_assets_object_key")),
    )
    op.create_index(op.f("ix_assets_expires_at"), "assets", ["expires_at"], unique=False)
    op.create_table(
        "rooms",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("title", sa.String(length=64), nullable=False),
        sa.Column("host_participant_id", sa.Uuid(), nullable=True),
        sa.Column("status", sa.String(length=16), nullable=False),
        sa.Column("capacity", sa.Integer(), nullable=False),
        sa.Column("invite_token_hash", sa.String(length=64), nullable=False),
        sa.Column("invite_token_encrypted", sa.String(length=256), nullable=False),
        sa.Column("presence_seq", sa.BigInteger(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("empty_since", sa.DateTime(timezone=True), nullable=True),
        sa.Column("closed_at", sa.DateTime(timezone=True), nullable=True),
        sa.CheckConstraint("status IN ('active','closed','expired')", name=op.f("ck_rooms_status")),
        sa.CheckConstraint("capacity = 2", name=op.f("ck_rooms_capacity")),
        sa.CheckConstraint(
            "char_length(title) BETWEEN 1 AND 64", name=op.f("ck_rooms_title_length")
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_rooms")),
        sa.UniqueConstraint("invite_token_hash", name=op.f("uq_rooms_invite_token_hash")),
    )
    op.create_index(op.f("ix_rooms_expires_at"), "rooms", ["expires_at"], unique=False)
    op.create_table(
        "sessions",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("token_hash", sa.String(length=64), nullable=False),
        sa.Column("csrf_hash", sa.String(length=64), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_sessions")),
        sa.UniqueConstraint("token_hash", name=op.f("uq_sessions_token_hash")),
    )
    op.create_index(op.f("ix_sessions_expires_at"), "sessions", ["expires_at"], unique=False)
    op.create_table(
        "http_receipts",
        sa.Column("session_id", sa.Uuid(), nullable=False),
        sa.Column("operation", sa.String(length=128), nullable=False),
        sa.Column("request_id", sa.Uuid(), nullable=False),
        sa.Column("payload_hash", sa.String(length=64), nullable=False),
        sa.Column("response", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("status_code", sa.Integer(), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(
            ["session_id"], ["sessions.id"], name=op.f("fk_http_receipts_session_id_sessions")
        ),
        sa.PrimaryKeyConstraint(
            "session_id", "operation", "request_id", name=op.f("pk_http_receipts")
        ),
    )
    op.create_index(
        op.f("ix_http_receipts_expires_at"), "http_receipts", ["expires_at"], unique=False
    )
    op.create_table(
        "outbox",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("room_id", sa.Uuid(), nullable=False),
        sa.Column("revision", sa.BigInteger(), nullable=False),
        sa.Column("event_type", sa.String(length=64), nullable=False),
        sa.Column("payload", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("sent_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(
            ["room_id"], ["rooms.id"], name=op.f("fk_outbox_room_id_rooms"), ondelete="CASCADE"
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_outbox")),
    )
    op.create_index(
        "ix_outbox_pending",
        "outbox",
        ["created_at"],
        unique=False,
        postgresql_where=sa.text("sent_at IS NULL"),
    )
    op.create_table(
        "participants",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("room_id", sa.Uuid(), nullable=False),
        sa.Column("session_id", sa.Uuid(), nullable=False),
        sa.Column("display_name", sa.String(length=32), nullable=False),
        sa.Column("role", sa.String(length=16), nullable=False),
        sa.Column("connection_generation", sa.BigInteger(), nullable=False),
        sa.Column(
            "joined_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False
        ),
        sa.Column(
            "last_seen_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("left_at", sa.DateTime(timezone=True), nullable=True),
        sa.CheckConstraint("role IN ('host','listener')", name=op.f("ck_participants_role")),
        sa.CheckConstraint(
            "char_length(display_name) BETWEEN 1 AND 32", name=op.f("ck_participants_name_length")
        ),
        sa.CheckConstraint("connection_generation >= 0", name=op.f("ck_participants_generation")),
        sa.ForeignKeyConstraint(
            ["room_id"],
            ["rooms.id"],
            name=op.f("fk_participants_room_id_rooms"),
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["session_id"],
            ["sessions.id"],
            name=op.f("fk_participants_session_id_sessions"),
            ondelete="RESTRICT",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_participants")),
        sa.UniqueConstraint("room_id", "id", name="uq_participants_room_identity"),
        sa.UniqueConstraint("room_id", "session_id", name="uq_participants_room_session"),
    )
    op.create_index(op.f("ix_participants_room_id"), "participants", ["room_id"], unique=False)
    op.create_index(
        "uq_participants_active_host",
        "participants",
        ["room_id"],
        unique=True,
        postgresql_where=sa.text("role = 'host' AND left_at IS NULL"),
    )
    op.create_table(
        "tracks",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("scope", sa.String(length=16), nullable=False),
        sa.Column("room_id", sa.Uuid(), nullable=True),
        sa.Column("title", sa.String(length=200), nullable=False),
        sa.Column("artist", sa.String(length=200), nullable=False),
        sa.Column("duration_ms", sa.BigInteger(), nullable=True),
        sa.Column("source_asset_id", sa.Uuid(), nullable=True),
        sa.Column("playback_asset_id", sa.Uuid(), nullable=True),
        sa.Column("status", sa.String(length=16), nullable=False),
        sa.Column("error_code", sa.String(length=64), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.CheckConstraint(
            "(scope = 'catalog' AND room_id IS NULL) OR (scope = 'room' AND room_id IS NOT NULL)",
            name=op.f("ck_tracks_scope"),
        ),
        sa.CheckConstraint(
            "status != 'ready' OR (playback_asset_id IS NOT NULL AND duration_ms > 0)",
            name=op.f("ck_tracks_ready_asset"),
        ),
        sa.CheckConstraint(
            "status IN ('uploading','processing','ready','failed')", name=op.f("ck_tracks_status")
        ),
        sa.CheckConstraint("duration_ms BETWEEN 0 AND 900000", name=op.f("ck_tracks_duration")),
        sa.ForeignKeyConstraint(
            ["playback_asset_id"],
            ["assets.id"],
            name=op.f("fk_tracks_playback_asset_id_assets"),
            ondelete="RESTRICT",
        ),
        sa.ForeignKeyConstraint(
            ["room_id"], ["rooms.id"], name=op.f("fk_tracks_room_id_rooms"), ondelete="CASCADE"
        ),
        sa.ForeignKeyConstraint(
            ["source_asset_id"],
            ["assets.id"],
            name=op.f("fk_tracks_source_asset_id_assets"),
            ondelete="RESTRICT",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_tracks")),
    )
    op.create_index(op.f("ix_tracks_room_id"), "tracks", ["room_id"], unique=False)
    op.create_index(op.f("ix_tracks_status"), "tracks", ["status"], unique=False)
    op.create_table(
        "command_receipts",
        sa.Column("room_id", sa.Uuid(), nullable=False),
        sa.Column("participant_id", sa.Uuid(), nullable=False),
        sa.Column("request_id", sa.Uuid(), nullable=False),
        sa.Column("payload_hash", sa.String(length=64), nullable=False),
        sa.Column("response", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(
            ["room_id", "participant_id"],
            ["participants.room_id", "participants.id"],
            name=op.f("fk_command_receipts_room_id_participants"),
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint(
            "room_id", "participant_id", "request_id", name=op.f("pk_command_receipts")
        ),
    )
    op.create_index(
        op.f("ix_command_receipts_expires_at"), "command_receipts", ["expires_at"], unique=False
    )
    op.create_table(
        "playback_states",
        sa.Column("room_id", sa.Uuid(), nullable=False),
        sa.Column("playback_revision", sa.BigInteger(), nullable=False),
        sa.Column("track_id", sa.Uuid(), nullable=True),
        sa.Column("media_version", sa.String(length=128), nullable=True),
        sa.Column("status", sa.String(length=16), nullable=False),
        sa.Column("position_ms", sa.BigInteger(), nullable=False),
        sa.Column("duration_ms", sa.BigInteger(), nullable=False),
        sa.Column("anchor_server_time_ms", sa.BigInteger(), nullable=False),
        sa.Column("pending_transition", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("epoch", sa.Uuid(), nullable=False),
        sa.CheckConstraint(
            "(status = 'empty' AND track_id IS NULL AND media_version IS NULL AND duration_ms = 0) "
            "OR (status != 'empty' AND track_id IS NOT NULL "
            "AND media_version IS NOT NULL AND duration_ms > 0)",
            name=op.f("ck_playback_states_track"),
        ),
        sa.CheckConstraint(
            "status IN ('empty','paused','playing','ended')", name=op.f("ck_playback_states_status")
        ),
        sa.CheckConstraint("playback_revision >= 0", name=op.f("ck_playback_states_revision")),
        sa.CheckConstraint(
            "position_ms BETWEEN 0 AND duration_ms AND duration_ms <= 900000",
            name=op.f("ck_playback_states_position"),
        ),
        sa.ForeignKeyConstraint(
            ["room_id"],
            ["rooms.id"],
            name=op.f("fk_playback_states_room_id_rooms"),
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["track_id"],
            ["tracks.id"],
            name=op.f("fk_playback_states_track_id_tracks"),
            ondelete="RESTRICT",
        ),
        sa.PrimaryKeyConstraint("room_id", name=op.f("pk_playback_states")),
    )
    op.create_table(
        "uploads",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("room_id", sa.Uuid(), nullable=False),
        sa.Column("owner_participant_id", sa.Uuid(), nullable=False),
        sa.Column("track_id", sa.Uuid(), nullable=False),
        sa.Column("object_key", sa.String(length=512), nullable=False),
        sa.Column("content_type", sa.String(length=128), nullable=False),
        sa.Column("expected_size", sa.BigInteger(), nullable=False),
        sa.Column("actual_size", sa.BigInteger(), nullable=True),
        sa.Column("status", sa.String(length=16), nullable=False),
        sa.Column("job_id", sa.Uuid(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.CheckConstraint(
            "status IN ('reserved','processing','ready','failed','cancelled')",
            name=op.f("ck_uploads_status"),
        ),
        sa.CheckConstraint("expected_size BETWEEN 1 AND 52428800", name=op.f("ck_uploads_size")),
        sa.ForeignKeyConstraint(
            ["room_id", "owner_participant_id"],
            ["participants.room_id", "participants.id"],
            name=op.f("fk_uploads_room_id_participants"),
        ),
        sa.ForeignKeyConstraint(
            ["room_id"], ["rooms.id"], name=op.f("fk_uploads_room_id_rooms"), ondelete="CASCADE"
        ),
        sa.ForeignKeyConstraint(
            ["track_id"], ["tracks.id"], name=op.f("fk_uploads_track_id_tracks"), ondelete="CASCADE"
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_uploads")),
        sa.UniqueConstraint("object_key", name=op.f("uq_uploads_object_key")),
        sa.UniqueConstraint("track_id", name=op.f("uq_uploads_track_id")),
    )
    op.create_index(
        "ix_uploads_status_expires_at", "uploads", ["status", "expires_at"], unique=False
    )

    op.create_foreign_key(
        "fk_rooms_host_membership",
        "rooms",
        "participants",
        ["id", "host_participant_id"],
        ["room_id", "id"],
        deferrable=True,
        initially="DEFERRED",
    )


def downgrade():
    op.drop_constraint("fk_rooms_host_membership", "rooms", type_="foreignkey")
    op.drop_index("ix_uploads_status_expires_at", table_name="uploads")
    op.drop_table("uploads")
    op.drop_table("playback_states")
    op.drop_index(op.f("ix_command_receipts_expires_at"), table_name="command_receipts")
    op.drop_table("command_receipts")
    op.drop_index(op.f("ix_tracks_status"), table_name="tracks")
    op.drop_index(op.f("ix_tracks_room_id"), table_name="tracks")
    op.drop_table("tracks")
    op.drop_index(
        "uq_participants_active_host",
        table_name="participants",
        postgresql_where=sa.text("role = 'host' AND left_at IS NULL"),
    )
    op.drop_index(op.f("ix_participants_room_id"), table_name="participants")
    op.drop_table("participants")
    op.drop_index(
        "ix_outbox_pending", table_name="outbox", postgresql_where=sa.text("sent_at IS NULL")
    )
    op.drop_table("outbox")
    op.drop_index(op.f("ix_http_receipts_expires_at"), table_name="http_receipts")
    op.drop_table("http_receipts")
    op.drop_index(op.f("ix_sessions_expires_at"), table_name="sessions")
    op.drop_table("sessions")
    op.drop_index(op.f("ix_rooms_expires_at"), table_name="rooms")
    op.drop_table("rooms")
    op.drop_index(op.f("ix_assets_expires_at"), table_name="assets")
    op.drop_table("assets")
