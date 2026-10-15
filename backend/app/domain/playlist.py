"""Persistent shared playlist. All writes hold the room row lock."""

import secrets
from copy import deepcopy
from typing import Any
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.contracts import models as wire
from app.db import models as dbm
from app.domain.errors import DomainError


def editor(room: dbm.Room, actor: dbm.Participant) -> None:
    if room.host_participant_id != actor.id and not actor.can_edit:
        raise DomainError("FORBIDDEN", "Ведущий ещё не выдал вам право редактирования", 403)


def contents(room: dbm.Room) -> dict[str, Any]:
    return {
        "trackIds": [],
        "history": [],
        "bag": [],
        "repeat": "off",
        "shuffle": False,
        "shuffleStarted": False,
        **deepcopy(room.playlist or {}),
    }


async def ready_track(db: AsyncSession, room: dbm.Room, track_id: UUID) -> dbm.Track:
    track = await db.scalar(
        select(dbm.Track).where(
            dbm.Track.id == track_id,
            (dbm.Track.scope == "catalog") | (dbm.Track.room_id == room.id),
        )
    )
    if (
        track is None
        or track.status != "ready"
        or not track.playback_asset_id
        or not track.duration_ms
    ):
        raise DomainError("TRACK_NOT_READY", "Композиция недоступна или ещё обрабатывается", 409)
    return track


async def step(
    db: AsyncSession,
    room: dbm.Room,
    state: dbm.PlaybackState,
    now: int,
    *,
    previous: bool = False,
    automatic: bool = False,
) -> bool:
    data = contents(room)
    original: list[str] = data["trackIds"]
    available = {
        str(i)
        for i in (
            await db.scalars(
                select(dbm.Track.id).where(
                    dbm.Track.id.in_([UUID(i) for i in original]),
                    dbm.Track.status == "ready",
                    dbm.Track.playback_asset_id.is_not(None),
                    dbm.Track.duration_ms > 0,
                    (dbm.Track.scope == "catalog") | (dbm.Track.room_id == room.id),
                )
            )
        ).all()
    }
    ids = [i for i in original if i in available]
    data["skippedTrackIds"] = [i for i in original if i not in available]
    room.playlist = data
    current = str(state.track_id) if state.track_id else None
    history: list[str] = [i for i in data["history"] if i in ids]
    target: str | None = None
    if automatic and data["repeat"] == "one" and current in ids:
        target = current
    elif previous:
        target = (
            history.pop()
            if history
            else (ids[max(0, ids.index(current) - 1)] if current in ids else None)
        )
    elif data["shuffle"]:
        bag = [i for i in data["bag"] if i in ids and i != current]
        if not bag and (not data["shuffleStarted"] or data["repeat"] == "all"):
            bag = [i for i in ids if i != current]
            secrets.SystemRandom().shuffle(bag)
        target = (
            bag.pop(0) if bag else (current if data["repeat"] == "all" and current in ids else None)
        )
        data["bag"] = bag
        data["shuffleStarted"] = True
    elif ids:
        index = ids.index(current) + 1 if current in ids else 0
        if index < len(ids):
            target = ids[index]
        elif data["repeat"] == "all":
            target = ids[0]
    if not target:
        return False
    track = await ready_track(db, room, UUID(target))
    asset = await db.get(dbm.Asset, track.playback_asset_id)
    assert asset is not None and track.duration_ms is not None
    if current and not previous and current != target:
        history.append(current)
    data["history"] = history[-100:]
    room.playlist = data
    state.track_id = track.id
    state.media_version = asset.media_version
    state.duration_ms = track.duration_ms
    state.position_ms = 0
    state.anchor_server_time_ms = now + 1000
    state.status = "playing" if automatic or state.status == "playing" else "paused"
    state.pending_transition = None
    return True


async def edit(
    db: AsyncSession,
    room: dbm.Room,
    actor: dbm.Participant,
    state: dbm.PlaybackState,
    payload: wire.PlayerAction,
    now: int,
) -> None:
    editor(room, actor)
    if state.playback_revision != payload.expected_playback_revision:
        raise DomainError("CONFLICT", "Очередь или плеер изменились. Повторите действие.", 409)
    if state.pending_transition:
        raise DomainError("PENDING_TRANSITION", "Дождитесь применения предыдущей команды", 409)
    data = contents(room)
    ids: list[str] = data["trackIds"]
    if payload.action in {"next", "previous"}:
        if not await step(db, room, state, now, previous=payload.action == "previous"):
            raise DomainError("QUEUE_END", "В очереди больше нет композиций", 409)
    elif payload.action == "options":
        if payload.repeat is not None:
            data["repeat"] = payload.repeat
        if payload.shuffle is not None:
            data["shuffle"] = payload.shuffle
            data["bag"] = []
            data["shuffleStarted"] = False
        room.playlist = data
    else:
        if payload.track_id is None:
            raise DomainError("VALIDATION_ERROR", "Выберите композицию", 422)
        track_id = str(payload.track_id)
        if payload.action == "add":
            await ready_track(db, room, payload.track_id)
            if track_id not in ids:
                if len(ids) >= 100:
                    raise DomainError("QUEUE_FULL", "В очереди уже 100 композиций", 409)
                ids.append(track_id)
        else:
            if track_id not in ids:
                raise DomainError("NOT_FOUND", "Композиция уже удалена из очереди", 404)
            ids.remove(track_id)
            if payload.action == "move":
                if payload.to_index is None or payload.to_index > len(ids):
                    raise DomainError("VALIDATION_ERROR", "Неверное место в очереди", 422)
                ids.insert(payload.to_index, track_id)
        data["trackIds"] = ids
        data["bag"] = []
        data["shuffleStarted"] = False
        room.playlist = data
    state.playback_revision += 1
    await db.flush()
