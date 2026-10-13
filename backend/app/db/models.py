from datetime import datetime
from typing import Any
from uuid import UUID, uuid4

from sqlalchemy import (
    BigInteger,
    CheckConstraint,
    DateTime,
    ForeignKey,
    ForeignKeyConstraint,
    Identity,
    Index,
    MetaData,
    String,
    UniqueConstraint,
    func,
    text,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    metadata = MetaData(
        naming_convention={
            "ix": "ix_%(table_name)s_%(column_0_name)s",
            "uq": "uq_%(table_name)s_%(column_0_name)s",
            "ck": "ck_%(table_name)s_%(constraint_name)s",
            "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
            "pk": "pk_%(table_name)s",
        }
    )


class Session(Base):
    __tablename__ = "sessions"
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    token_hash: Mapped[str] = mapped_column(String(64), unique=True)
    csrf_hash: Mapped[str] = mapped_column(String(64))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)


class Room(Base):
    __tablename__ = "rooms"
    __table_args__ = (
        CheckConstraint("status IN ('active','closed','expired')", name="status"),
        CheckConstraint("capacity = 2", name="capacity"),
        CheckConstraint("char_length(title) BETWEEN 1 AND 64", name="title_length"),
        ForeignKeyConstraint(
            ["id", "host_participant_id"],
            ["participants.room_id", "participants.id"],
            name="fk_rooms_host_membership",
            use_alter=True,
            deferrable=True,
            initially="DEFERRED",
        ),
    )
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    title: Mapped[str] = mapped_column(String(64))
    host_participant_id: Mapped[UUID | None]
    status: Mapped[str] = mapped_column(String(16), default="active")
    capacity: Mapped[int] = mapped_column(default=2)
    invite_token_hash: Mapped[str] = mapped_column(String(64), unique=True)
    invite_token_encrypted: Mapped[str] = mapped_column(String(256))
    presence_seq: Mapped[int] = mapped_column(BigInteger, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)
    empty_since: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    closed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class Participant(Base):
    __tablename__ = "participants"
    __table_args__ = (
        UniqueConstraint("room_id", "session_id", name="uq_participants_room_session"),
        UniqueConstraint("room_id", "id", name="uq_participants_room_identity"),
        CheckConstraint("role IN ('host','listener')", name="role"),
        CheckConstraint("char_length(display_name) BETWEEN 1 AND 32", name="name_length"),
        CheckConstraint("connection_generation >= 0", name="generation"),
        CheckConstraint(
            "(left_at IS NULL AND left_reason IS NULL) OR "
            "(left_at IS NOT NULL AND left_reason IS NOT NULL "
            "AND left_reason IN ('left','offlineTimeout'))",
            name="leave_reason",
        ),
        Index(
            "uq_participants_active_host",
            "room_id",
            unique=True,
            postgresql_where=text("role = 'host' AND left_at IS NULL"),
        ),
    )
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    room_id: Mapped[UUID] = mapped_column(ForeignKey("rooms.id", ondelete="CASCADE"), index=True)
    session_id: Mapped[UUID] = mapped_column(ForeignKey("sessions.id", ondelete="RESTRICT"))
    display_name: Mapped[str] = mapped_column(String(32))
    role: Mapped[str] = mapped_column(String(16), default="listener")
    connection_generation: Mapped[int] = mapped_column(BigInteger, default=0)
    joined_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    last_seen_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    left_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    left_reason: Mapped[str | None] = mapped_column(String(32))


class Asset(Base):
    __tablename__ = "assets"
    __table_args__ = (CheckConstraint("size_bytes > 0", name="size"),)
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    object_key: Mapped[str] = mapped_column(String(512), unique=True)
    checksum: Mapped[str] = mapped_column(String(64))
    content_type: Mapped[str] = mapped_column(String(128))
    size_bytes: Mapped[int] = mapped_column(BigInteger)
    media_version: Mapped[str] = mapped_column(String(128))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), index=True)


class Track(Base):
    __tablename__ = "tracks"
    __table_args__ = (
        CheckConstraint("status IN ('uploading','processing','ready','failed')", name="status"),
        CheckConstraint(
            "(scope = 'catalog' AND room_id IS NULL) OR (scope = 'room' AND room_id IS NOT NULL)",
            name="scope",
        ),
        CheckConstraint("duration_ms BETWEEN 0 AND 900000", name="duration"),
        CheckConstraint(
            "status != 'ready' OR (playback_asset_id IS NOT NULL "
            "AND duration_ms IS NOT NULL AND duration_ms > 0)",
            name="ready_asset",
        ),
    )
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    scope: Mapped[str] = mapped_column(String(16))
    room_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("rooms.id", ondelete="CASCADE"), index=True
    )
    title: Mapped[str] = mapped_column(String(200))
    artist: Mapped[str] = mapped_column(String(200), default="")
    duration_ms: Mapped[int | None] = mapped_column(BigInteger)
    source_asset_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("assets.id", ondelete="RESTRICT")
    )
    playback_asset_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("assets.id", ondelete="RESTRICT")
    )
    status: Mapped[str] = mapped_column(String(16), default="uploading", index=True)
    error_code: Mapped[str | None] = mapped_column(String(64))
    source_uri: Mapped[str | None] = mapped_column(String(512))
    license_id: Mapped[str | None] = mapped_column(String(64))
    license_uri: Mapped[str | None] = mapped_column(String(512))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class PlaybackState(Base):
    __tablename__ = "playback_states"
    __table_args__ = (
        CheckConstraint("playback_revision >= 0", name="revision"),
        CheckConstraint("status IN ('empty','paused','playing','ended')", name="status"),
        CheckConstraint(
            "position_ms BETWEEN 0 AND duration_ms AND duration_ms <= 900000", name="position"
        ),
        CheckConstraint(
            "(status = 'empty' AND track_id IS NULL AND media_version IS NULL "
            "AND duration_ms = 0) OR (status != 'empty' AND track_id IS NOT NULL "
            "AND media_version IS NOT NULL AND duration_ms > 0)",
            name="track",
        ),
    )
    room_id: Mapped[UUID] = mapped_column(
        ForeignKey("rooms.id", ondelete="CASCADE"), primary_key=True
    )
    playback_revision: Mapped[int] = mapped_column(BigInteger, default=0)
    track_id: Mapped[UUID | None] = mapped_column(ForeignKey("tracks.id", ondelete="RESTRICT"))
    media_version: Mapped[str | None] = mapped_column(String(128))
    status: Mapped[str] = mapped_column(String(16), default="empty")
    position_ms: Mapped[int] = mapped_column(BigInteger, default=0)
    duration_ms: Mapped[int] = mapped_column(BigInteger, default=0)
    anchor_server_time_ms: Mapped[int] = mapped_column(BigInteger)
    pending_transition: Mapped[dict[str, Any] | None] = mapped_column(JSONB(none_as_null=True))
    epoch: Mapped[UUID] = mapped_column(default=uuid4)


class Upload(Base):
    __tablename__ = "uploads"
    __table_args__ = (
        CheckConstraint(
            "status IN ('reserved','processing','ready','failed','cancelled')", name="status"
        ),
        CheckConstraint("expected_size BETWEEN 1 AND 52428800", name="size"),
        ForeignKeyConstraint(
            ["room_id", "owner_participant_id"], ["participants.room_id", "participants.id"]
        ),
        Index("ix_uploads_status_expires_at", "status", "expires_at"),
    )
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    room_id: Mapped[UUID] = mapped_column(ForeignKey("rooms.id", ondelete="CASCADE"))
    owner_participant_id: Mapped[UUID]
    track_id: Mapped[UUID] = mapped_column(ForeignKey("tracks.id", ondelete="CASCADE"), unique=True)
    object_key: Mapped[str] = mapped_column(String(512), unique=True)
    content_type: Mapped[str] = mapped_column(String(128))
    expected_size: Mapped[int] = mapped_column(BigInteger)
    actual_size: Mapped[int | None] = mapped_column(BigInteger)
    complete_checksum: Mapped[str | None] = mapped_column(String(64))
    purged_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    status: Mapped[str] = mapped_column(String(16), default="reserved")
    job_id: Mapped[UUID | None]
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))


class CommandReceipt(Base):
    __tablename__ = "command_receipts"
    __table_args__ = (
        ForeignKeyConstraint(
            ["room_id", "participant_id"],
            ["participants.room_id", "participants.id"],
            ondelete="CASCADE",
        ),
    )
    room_id: Mapped[UUID] = mapped_column(primary_key=True)
    participant_id: Mapped[UUID] = mapped_column(primary_key=True)
    request_id: Mapped[UUID] = mapped_column(primary_key=True)
    payload_hash: Mapped[str] = mapped_column(String(64))
    response: Mapped[dict[str, Any]] = mapped_column(JSONB)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)


class HttpReceipt(Base):
    __tablename__ = "http_receipts"
    session_id: Mapped[UUID] = mapped_column(ForeignKey("sessions.id"), primary_key=True)
    operation: Mapped[str] = mapped_column(String(128), primary_key=True)
    request_id: Mapped[UUID] = mapped_column(primary_key=True)
    payload_hash: Mapped[str] = mapped_column(String(64))
    response: Mapped[dict[str, Any]] = mapped_column(JSONB)
    status_code: Mapped[int]
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)


class Outbox(Base):
    __tablename__ = "outbox"
    __table_args__ = (
        Index("ix_outbox_pending", "created_at", postgresql_where=text("sent_at IS NULL")),
    )
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    sequence: Mapped[int] = mapped_column(BigInteger, Identity(always=True), unique=True)
    room_id: Mapped[UUID] = mapped_column(ForeignKey("rooms.id", ondelete="CASCADE"))
    revision: Mapped[int] = mapped_column(BigInteger)
    event_type: Mapped[str] = mapped_column(String(64))
    payload: Mapped[dict[str, Any]] = mapped_column(JSONB)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
