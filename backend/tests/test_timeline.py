from uuid import uuid4

import pytest
from pytest import MonkeyPatch

from app.db.models import PlaybackState
from app.domain.playback import lead_time, position_at, promote
from app.services.clock import Clock


def test_pending_seek_keeps_old_timeline_until_effective_time() -> None:
    state = PlaybackState(
        room_id=uuid4(),
        status="playing",
        position_ms=10_000,
        anchor_server_time_ms=1000,
        duration_ms=30_000,
        playback_revision=12,
        pending_transition={
            "type": "seek",
            "nextStatus": "playing",
            "positionMs": 20_000,
            "effectiveAtServerTimeMs": 2000,
        },
    )
    assert position_at(state, 1999) == 10_999
    assert not promote(state, 1999)
    assert promote(state, 2000)
    assert state.playback_revision == 12 and state.pending_transition is None
    assert position_at(state, 2100) == 20_100
    assert position_at(state, 100_000) == 30_000
    assert not promote(state, 2100)


@pytest.mark.parametrize("rtts,lead", [([], 750), ([1], 500), ([500], 1250), ([50, 1000], 1500)])
def test_lead_is_bounded(rtts: list[int], lead: int) -> None:
    assert lead_time(rtts) == lead


def test_clock_tracks_monotonic_time_and_detects_wall_jump(monkeypatch: MonkeyPatch) -> None:
    values = {"wall": 1_000_000_000_000, "mono": 2_000_000_000}
    monkeypatch.setattr("time.time_ns", lambda: values["wall"])
    monkeypatch.setattr("time.monotonic_ns", lambda: values["mono"])
    clock = Clock()
    epoch = clock.epoch
    values["mono"] += 30_000_000
    values["wall"] += 30_000_000
    assert clock.now_ms() == 1_000_030
    assert not clock.reset_if_jumped()
    values["wall"] += 200_000_000
    assert clock.now_ms() == 1_000_030
    assert clock.reset_if_jumped()
    assert clock.epoch != epoch and clock.now_ms() == 1_000_230
