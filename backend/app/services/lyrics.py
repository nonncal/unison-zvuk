"""Song lyrics: timestamped (.lrc style) or plain text, from a file, a tag or a catalog entry."""

import json
import re
import unicodedata
from typing import Literal

from app.domain.errors import DomainError

MAX_CHARS = 20_000
MAX_LINES = 600
MAX_LINE = 200
STAMP = re.compile(r"\[(\d{1,3}):(\d{2})(?:[.:](\d{1,3}))?\]")
OFFSET = re.compile(r"^\[offset:\s*([+-]?\d+)\s*\]", re.IGNORECASE | re.MULTILINE)
META = re.compile(r"^\[[a-z]{2,8}:[^\]]*\]\s*$", re.IGNORECASE)
WORD_STAMP = re.compile(r"<\d{1,3}:\d{2}(?:[.:]\d{1,3})?>")
Source = Literal["lrc", "text", "embedded"]


def clean(text: str) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n").lstrip("﻿")
    return "".join(
        c for c in text if c in "\n\t" or not unicodedata.category(c).startswith("C")
    ).strip()


def fraction_ms(value: str | None) -> int:
    if not value:
        return 0
    return int(value.ljust(3, "0")[:3])


def parse_lrc(text: str) -> list[dict[str, int | str]]:
    offset = 0
    found = OFFSET.search(text)
    if found:
        offset = int(found.group(1))
    lines: list[dict[str, int | str]] = []
    for raw in text.split("\n"):
        stamps = list(STAMP.finditer(raw))
        if not stamps:
            continue
        words = WORD_STAMP.sub("", raw[stamps[-1].end() :]).strip()[:MAX_LINE]
        for stamp in stamps:
            start = (
                int(stamp.group(1)) * 60_000
                + int(stamp.group(2)) * 1000
                + fraction_ms(stamp.group(3))
            )
            lines.append({"t": max(0, start + offset), "text": words})
    lines.sort(key=lambda line: int(line["t"]))
    return lines[:MAX_LINES]


def parse_lyrics(raw: str, source: Source = "text") -> dict[str, object]:
    """Return the stored document. Text with two or more timestamps becomes synced."""
    text = clean(raw)
    if not text:
        raise DomainError("INVALID_LYRICS", "Файл с текстом пустой", 422)
    if len(text) > MAX_CHARS:
        raise DomainError("INVALID_LYRICS", "Текст длиннее 20 000 символов", 422)
    lines = parse_lrc(text)
    if len([line for line in lines if line["text"]]) >= 2:
        return {"kind": "synced", "source": "lrc" if source == "text" else source, "lines": lines}
    body = "\n".join(line for line in text.split("\n") if not META.match(line.strip()))
    body = re.sub(r"\n{3,}", "\n\n", STAMP.sub("", body)).strip()
    if not body:
        raise DomainError("INVALID_LYRICS", "В файле нет текста песни", 422)
    return {"kind": "plain", "source": source, "text": body}


def dump(document: dict[str, object]) -> str:
    return json.dumps(document, ensure_ascii=False, separators=(",", ":"))


def id3_lyrics(data: bytes) -> str:
    """Unsynchronised lyrics (USLT) from an ID3v2.3/2.4 tag; empty when there are none."""
    if data[:3] != b"ID3" or len(data) < 10:
        return ""
    version = data[3]
    size = sum((data[6 + i] & 0x7F) << (7 * (3 - i)) for i in range(4))
    end, pos = min(len(data), 10 + size), 10
    if data[5] & 0x40 and len(data) >= 14:
        # Extended header: v2.3 stores the size without its own four bytes, v2.4 with them.
        if version == 3:
            pos += 4 + int.from_bytes(data[10:14], "big")
        else:
            pos += sum((data[10 + i] & 0x7F) << (7 * (3 - i)) for i in range(4))
    while pos + 10 <= end:
        frame = data[pos : pos + 4]
        if not frame.strip(b"\x00"):
            break
        raw = data[pos + 4 : pos + 8]
        length = (
            int.from_bytes(raw, "big")
            if version == 3
            else sum((raw[i] & 0x7F) << (7 * (3 - i)) for i in range(4))
        )
        body = data[pos + 10 : pos + 10 + length]
        pos += 10 + length
        if frame != b"USLT" or len(body) < 5:
            continue
        encoding = body[0]
        rest = body[4:]
        codec = {0: "latin-1", 1: "utf-16", 2: "utf-16-be", 3: "utf-8"}.get(encoding, "latin-1")
        step = 2 if encoding in (1, 2) else 1
        index = 0
        while index + step <= len(rest) and rest[index : index + step] != b"\x00" * step:
            index += step
        text = rest[index + step :]
        try:
            return clean(text.decode(codec))
        except UnicodeDecodeError:
            return ""
    return ""
