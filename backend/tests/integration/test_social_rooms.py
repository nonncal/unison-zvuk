import asyncio
from datetime import UTC, datetime, timedelta
from io import BytesIO
from urllib.parse import parse_qs, urlsplit
from uuid import UUID, uuid4

import pytest
from httpx import AsyncClient
from PIL import Image
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncEngine, async_sessionmaker

from app.config import Settings
from app.contracts import models as wire
from app.db import models as dbm
from app.domain.errors import DomainError
from app.domain.playback import Playback
from app.domain.playlist import edit, next_track, step
from app.domain.rooms import Rooms
from app.services.security import Security
from tests.integration.test_database import seed_room
from tests.integration.test_playback import FixedClock, command, track
from tests.integration.test_rooms import clients as social_clients  # noqa: F401

pytestmark = pytest.mark.integration


def token(room: dict[str, object]) -> str:
    return parse_qs(urlsplit(str(room["inviteUrl"])).fragment)["invite"][0]


async def create(client: AsyncClient, **options: object) -> dict[str, object]:
    result = await client.post(
        "/api/v1/rooms",
        headers={"Idempotency-Key": str(uuid4())},
        json={"displayName": "Ведущий", "title": "Новая комната", **options},
    )
    assert result.status_code == 201, result.text
    return dict(result.json())


async def join(
    client: AsyncClient, room: dict[str, object], name: str = "Гость"
) -> dict[str, object]:
    result = await client.post(
        f"/api/v1/rooms/{room['roomId']}/entry",
        json={"inviteToken": token(room), "displayName": name},
    )
    assert result.status_code == 200, result.text
    return dict(result.json())


async def test_capacity_ten_and_concurrent_last_seat(
    database: AsyncEngine, settings: Settings
) -> None:
    sessions = async_sessionmaker(database, expire_on_commit=False)
    security = Security(settings)
    rooms = Rooms(settings, security)
    async with sessions.begin() as db:
        host, _ = await security.new_session(db)
        result = await rooms.create(
            db,
            host,
            uuid4(),
            wire.CreateRoom.model_validate({"displayName": "Ведущий", "capacity": 10}),
        )
        invitation = token(result.model_dump(mode="json", by_alias=True))
        ids = []
        for _i in range(10):
            session, _ = await security.new_session(db)
            ids.append(session.id)
        for i in range(8):
            member_session = await db.get(dbm.Session, ids[i])
            assert member_session
            await rooms.join(
                db,
                member_session,
                result.room_id,
                wire.JoinRoom.model_validate(
                    {"inviteToken": invitation, "displayName": f"Друг {i}"}
                ),
            )

    async def take(index: int) -> str:
        try:
            async with sessions.begin() as db:
                actor = await db.get(dbm.Session, ids[index])
                assert actor
                await rooms.join(
                    db,
                    actor,
                    result.room_id,
                    wire.JoinRoom.model_validate(
                        {"inviteToken": invitation, "displayName": f"Последний {index}"}
                    ),
                )
                return "joined"
        except DomainError as error:
            return error.code

    assert sorted(await asyncio.gather(take(8), take(9))) == ["ROOM_FULL", "joined"]
    async with sessions() as db:
        assert (
            await db.scalar(
                select(func.count())
                .select_from(dbm.Participant)
                .where(dbm.Participant.room_id == result.room_id, dbm.Participant.left_at.is_(None))
            )
            == 10
        )


async def test_moderated_entry_permissions_revocation_and_rejection(
    social_clients: list[AsyncClient],  # noqa: F811
) -> None:
    host, guest, other, _ = social_clients
    room = await create(host, capacity=10, moderated=True)
    base = f"/api/v1/rooms/{room['roomId']}"
    assert (await join(guest, room))["status"] == "pending"
    assert (await guest.get(base)).status_code == 403
    assert (await guest.get(base + "/tracks")).status_code == 403
    assert (await other.get(base + "/waiting")).status_code == 403
    pending = (await host.get(base + "/waiting")).json()["items"]
    assert len(pending) == 1
    assert (
        await other.post(base + f"/waiting/{pending[0]['id']}", json={"admit": True})
    ).status_code == 403
    assert (
        await host.post(base + f"/waiting/{pending[0]['id']}", json={"admit": True})
    ).status_code == 200
    joined = await join(guest, room)
    assert joined["status"] == "admitted"
    membership = joined["membership"]
    assert isinstance(membership, dict)
    pid = membership["participantId"]
    denied = await guest.post(
        base + "/player", json={"expectedPlaybackRevision": 0, "action": "options", "repeat": "all"}
    )
    assert denied.status_code == 403
    assert (
        await host.patch(base + f"/participants/{pid}/permission", json={"canEdit": True})
    ).status_code == 200
    updated = await guest.post(
        base + "/player", json={"expectedPlaybackRevision": 0, "action": "options", "repeat": "all"}
    )
    assert updated.status_code == 200 and updated.json()["playlist"]["repeat"] == "all"
    assert (
        await host.patch(base + f"/participants/{pid}/permission", json={"canEdit": False})
    ).status_code == 200
    assert (
        await guest.post(
            base + "/player",
            json={"expectedPlaybackRevision": 1, "action": "options", "shuffle": True},
        )
    ).status_code == 403
    assert (await join(other, room))["status"] == "pending"
    waiting = (await host.get(base + "/waiting")).json()["items"]
    await host.post(base + f"/waiting/{waiting[0]['id']}", json={"admit": False})
    assert (await other.get(base + "/admission")).json()["status"] == "rejected"
    assert (await other.get(base)).status_code == 403


async def test_rotation_kick_and_explicit_host_transfer(
    social_clients: list[AsyncClient],  # noqa: F811
) -> None:
    host, guest, other, _ = social_clients
    room = await create(host, capacity=10)
    base = f"/api/v1/rooms/{room['roomId']}"
    joined = await join(guest, room)
    m = joined["membership"]
    assert isinstance(m, dict)
    pid = m["participantId"]
    rotated = await host.post(base + "/invite/rotate", json={})
    assert rotated.status_code == 200 and rotated.json()["inviteUrl"] != room["inviteUrl"]
    assert (
        await other.post("/api/v1/invites/preview", json={"inviteToken": token(room)})
    ).status_code == 404
    assert (await guest.get(base)).status_code == 200
    transferred = await host.post(base + f"/participants/{pid}/action", json={"action": "transfer"})
    assert transferred.status_code == 200
    snap = transferred.json()
    assert len([p for p in snap["participants"] if p["role"] == "host"]) == 1
    assert snap["room"]["hostParticipantId"] == pid
    assert (await host.post(base + "/invite/rotate", json={})).status_code == 403
    old = room["participantId"]
    removed = await guest.post(base + f"/participants/{old}/action", json={"action": "remove"})
    assert removed.status_code == 200
    assert (await host.get(base)).status_code == 403
    assert (await host.post(base + "/resume", json={})).status_code == 403
    assert (
        await host.post(
            base + "/entry", json={"inviteToken": token(rotated.json()), "displayName": "Назад"}
        )
    ).status_code == 403


async def test_playlist_repeat_shuffle_previous_conflicts_and_auto_once(
    database: AsyncEngine, settings: Settings
) -> None:
    sessions = async_sessionmaker(database, expire_on_commit=False)
    clock = FixedClock()
    rooms = Rooms(settings, Security(settings), clock)
    playback = Playback(rooms, clock)
    async with sessions.begin() as db:
        rid, host_id, _ = await seed_room(db)
        ids = [await track(db) for _ in range(3)]
        room = await rooms.room(db, rid)
        room.playlist = {"trackIds": [str(i) for i in ids]}
        await playback.mutate(
            db, rid, host_id, 0, command("select", 0, {"trackId": str(ids[0])}), True, []
        )
        state = await db.get(dbm.PlaybackState, rid)
        actor = await db.get(dbm.Participant, host_id)
        assert state and actor

        async def action(value: str, **kwargs: object) -> None:
            assert actor is not None and state is not None
            await edit(
                db,
                room,
                actor,
                state,
                wire.PlayerAction.model_validate(
                    {"action": value, "expectedPlaybackRevision": state.playback_revision, **kwargs}
                ),
                clock.value,
            )

        await action("next")
        assert state.track_id == ids[1]
        await action("previous")
        assert state.track_id == ids[0]
        before = state.track_id
        await action("move", trackId=str(ids[2]), toIndex=0)
        await db.refresh(room, ["playlist"])
        assert room.playlist["trackIds"] == [str(ids[2]), str(ids[0]), str(ids[1])]
        await action("move", trackId=str(ids[2]), toIndex=2)
        await db.refresh(room, ["playlist"])
        assert room.playlist["trackIds"] == [str(i) for i in ids]
        await action("remove", trackId=str(ids[1]))
        await db.refresh(room, ["playlist"])
        assert str(ids[1]) not in room.playlist["trackIds"]
        await action("add", trackId=str(ids[1]))
        await db.refresh(room, ["playlist"])
        assert str(ids[1]) in room.playlist["trackIds"]
        assert state.track_id == before
        await action("options", shuffle=True, repeat="all")
        await action("next")
        assert state.track_id != before
        await action("options", repeat="one", shuffle=False)
        state.status = "playing"
        state.anchor_server_time_ms = clock.value - state.duration_ms
        chosen = state.track_id
        await playback.advance(db, room, state, clock.value)
        revision = state.playback_revision
        assert state.track_id == chosen and state.position_ms == 0 and state.status == "playing"
        await playback.advance(db, room, state, clock.value)
        assert state.playback_revision == revision
        # A shuffle cycle with repeat off must visit each other song once, then stop.
        await action("options", repeat="off", shuffle=True)
        state.track_id = ids[0]
        seen = {ids[0]}
        for _ in range(2):
            expected = next_track(room, state)
            assert next_track(room, state) == expected
            assert await step(db, room, state, clock.value, automatic=True, lead_ms=700)
            assert str(state.track_id) == expected
            assert state.anchor_server_time_ms == clock.value + 700
            assert state.track_id not in seen
            seen.add(state.track_id)
        assert seen == set(ids)
        assert not await step(db, room, state, clock.value, automatic=True)
        # Broken queue items are skipped even while repeat-one is selected.
        broken = await db.get(dbm.Track, state.track_id)
        assert broken is not None
        broken.status = "failed"
        await db.flush()
        await action("options", repeat="one", shuffle=False)
        assert await step(db, room, state, clock.value, automatic=True)
        assert state.track_id != broken.id
        assert str(broken.id) in room.playlist["skippedTrackIds"]
    with pytest.raises(DomainError, match="CONFLICT"):
        async with sessions.begin() as db:
            room = await rooms.room(db, rid)
            state = await db.get(dbm.PlaybackState, rid)
            actor = await db.get(dbm.Participant, host_id)
            assert state and actor
            await edit(
                db,
                room,
                actor,
                state,
                wire.PlayerAction.model_validate(
                    {"action": "options", "expectedPlaybackRevision": 0, "shuffle": True}
                ),
                clock.value,
            )


async def test_waiting_expiry_cancel_and_reserved_capacity(
    social_clients: list[AsyncClient],  # noqa: F811
    database: AsyncEngine,
) -> None:
    host, guest, third, _ = social_clients
    room = await create(host, capacity=2, moderated=True)
    base = f"/api/v1/rooms/{room['roomId']}"
    await join(guest, room)
    await join(third, room, "Третий")
    items = (await host.get(base + "/waiting")).json()["items"]
    assert (
        await host.post(base + f"/waiting/{items[0]['id']}", json={"admit": True})
    ).status_code == 200
    assert (
        await host.post(base + f"/waiting/{items[1]['id']}", json={"admit": True})
    ).status_code == 409
    await guest.delete(base + "/admission")
    assert (await guest.get(base + "/admission")).json()["status"] == "cancelled"
    sessions = async_sessionmaker(database)
    async with sessions.begin() as db:
        row = await db.get(dbm.Admission, UUID(items[1]["id"]))
        assert row
        row.expires_at = datetime.now(UTC) - timedelta(seconds=1)
    assert (await third.get(base + "/admission")).json()["status"] == "expired"


async def test_real_cover_validation_and_access(
    social_clients: list[AsyncClient],  # noqa: F811
    database: AsyncEngine,
) -> None:
    host, guest, other, _ = social_clients
    room = await create(host)
    base = f"/api/v1/rooms/{room['roomId']}"
    await join(guest, room)
    sessions = async_sessionmaker(database)
    async with sessions.begin() as db:
        tid = await track(db, UUID(str(room["roomId"])))
    path = base + f"/tracks/{tid}/cover"
    original = await host.get(path)
    assert original.status_code == 200 and original.headers["content-type"].startswith(
        "image/svg+xml"
    )
    assert (await other.get(path)).status_code == 403
    assert (await guest.put(path, content=b"invalid")).status_code == 403
    assert (await host.put(path, content=b"invalid")).status_code == 422
    image = BytesIO()
    Image.new("RGB", (32, 32), "blue").save(image, "PNG")
    assert (
        await host.put(path, content=image.getvalue(), headers={"Content-Type": "image/png"})
    ).status_code == 204
    actual = await guest.get(path)
    assert actual.status_code == 200 and actual.headers["content-type"].startswith("image/webp")
    assert Image.open(BytesIO(actual.content)).size == (32, 32)


async def test_suggestions_need_membership_and_host_approval(
    social_clients,  # noqa: F811
    database,
):
    host, guest, other, _ = social_clients
    room = await create(host, capacity=10)
    await join(guest, room)
    sessions = async_sessionmaker(database, expire_on_commit=False)
    async with sessions.begin() as db:
        ids = [str(await track(db)) for _ in range(4)]
    base = f"/api/v1/rooms/{room['roomId']}"
    assert (await other.post(base + "/suggestions", json={"trackId": ids[0]})).status_code == 403
    for tid in ids[:3]:
        response = await guest.post(base + "/suggestions", json={"trackId": tid})
        assert response.status_code == 200, response.text
    assert (await guest.post(base + "/suggestions", json={"trackId": ids[3]})).status_code == 409
    snapshot = (await guest.get(base)).json()
    assert snapshot["playlist"]["trackIds"] == []
    items = snapshot["playlist"]["suggestions"]
    assert len(items) == 3
    # Duplicate submission does not grow the queue or consume the quota.
    assert (
        len(
            (await guest.post(base + "/suggestions", json={"trackId": ids[0]})).json()["playlist"][
                "suggestions"
            ]
        )
        == 3
    )
    path = base + f"/suggestions/{items[0]['id']}"
    assert (await guest.post(path, json={"accept": True})).status_code == 403
    responses = await asyncio.gather(
        host.post(path, json={"accept": True}), host.post(path, json={"accept": True})
    )
    assert all(r.status_code == 200 for r in responses)
    snap = (await guest.get(base)).json()
    assert snap["playlist"]["trackIds"] == [ids[0]]
    assert len(snap["playlist"]["suggestions"]) == 2
    assert snap["playbackRevision"] == 1 and snap["playback"]["status"] == "empty"
    declined = await host.post(base + f"/suggestions/{items[1]['id']}", json={"accept": False})
    assert declined.status_code == 200
    assert len(declined.json()["playlist"]["suggestions"]) == 1
    assert (await guest.post(base + "/suggestions", json={"trackId": ids[0]})).status_code == 409
