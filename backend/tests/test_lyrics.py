import json

import pytest

from app.domain.errors import DomainError
from app.services.catalog import load_catalog, lyrics_document, read_audio
from app.services.lyrics import id3_lyrics, parse_lrc, parse_lyrics


def test_lrc_lines_are_sorted_with_offset_and_repeated_stamps() -> None:
    lines = parse_lrc("[offset:+500]\n[00:10.00]second\n[00:01.5][00:20]refrain\n[00:05]first")
    assert [(line["t"], line["text"]) for line in lines] == [
        (2000, "refrain"),
        (5500, "first"),
        (10500, "second"),
        (20500, "refrain"),
    ]


def test_timestamped_text_is_synced_and_word_stamps_are_dropped() -> None:
    document = parse_lyrics("[ar:Someone]\n[00:01.00]<00:01.00>Hello <00:01.50>world\n[00:04]Bye")
    assert document["kind"] == "synced" and document["source"] == "lrc"
    assert document["lines"] == [{"t": 1000, "text": "Hello world"}, {"t": 4000, "text": "Bye"}]


def test_text_without_timestamps_stays_plain() -> None:
    document = parse_lyrics("﻿First line\r\nSecond line\n\n\n\nThird", "embedded")
    assert document == {
        "kind": "plain",
        "source": "embedded",
        "text": "First line\nSecond line\n\nThird",
    }


@pytest.mark.parametrize("raw", ["", "   \n", "[ar:Someone]", "x" * 20_001])
def test_empty_or_oversized_lyrics_are_rejected(raw: str) -> None:
    with pytest.raises(DomainError) as error:
        parse_lyrics(raw)
    assert error.value.code == "INVALID_LYRICS"


def uslt(text: str, *, encoding: int = 3, version: int = 4) -> bytes:
    codec = {0: "latin-1", 1: "utf-16", 3: "utf-8"}[encoding]
    terminator = b"\x00\x00" if encoding == 1 else b"\x00"
    body = bytes([encoding]) + b"eng" + terminator + text.encode(codec)
    size = len(body)
    raw = (
        bytes([(size >> 21) & 0x7F, (size >> 14) & 0x7F, (size >> 7) & 0x7F, size & 0x7F])
        if version == 4
        else size.to_bytes(4, "big")
    )
    frame = b"USLT" + raw + b"\x00\x00" + body
    total = len(frame)
    header = bytes([(total >> 21) & 0x7F, (total >> 14) & 0x7F, (total >> 7) & 0x7F, total & 0x7F])
    return b"ID3" + bytes([version, 0, 0]) + header + frame


@pytest.mark.parametrize(("encoding", "version"), [(3, 4), (1, 3), (0, 3)])
def test_id3_unsynchronised_lyrics_are_read(encoding: int, version: int) -> None:
    text = "Hello\nWorld" if encoding == 0 else "Привет\nмир"
    assert id3_lyrics(uslt(text, encoding=encoding, version=version) + b"audio") == text


def test_audio_without_a_tag_has_no_lyrics() -> None:
    assert id3_lyrics(b"\xff\xfb\x90\x00" * 100) == ""


def test_catalog_songs_demonstrate_each_way_of_providing_lyrics() -> None:
    documents = {}
    for track in load_catalog():
        document = lyrics_document(track, read_audio(track))
        if document:
            documents[track.slug] = json.loads(document)
    assert documents["silent-night-eastman"]["kind"] == "synced"
    assert documents["silent-night-eastman"]["source"] == "lrc"
    assert documents["auld-lang-syne-bautsch"]["kind"] == "plain"
    assert documents["amazing-grace-southern-aire"]["kind"] == "synced"
    assert documents["amazing-grace-southern-aire"]["source"] == "embedded"
