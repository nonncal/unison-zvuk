"""Conservative normalization for malformed text tags from audio containers."""

import unicodedata


def repair_swapped_ascii(value: str) -> str:
    # Some ID3 writers put a little-endian BOM before big-endian UTF-16 bytes.
    # Only repair an entire string of byte-swapped printable ASCII. Guessing a
    # language or swapping arbitrary CJK text would corrupt valid metadata.
    if len(value) >= 4 and all(0x2000 <= ord(c) <= 0x7E00 and ord(c) % 256 == 0 for c in value):
        candidate = "".join(chr(ord(c) >> 8) for c in value)
        if any(c.isascii() and c.isalpha() for c in candidate):
            return candidate
    return value


def text_metadata(value: object) -> str:
    if not isinstance(value, str):
        return ""
    repaired = repair_swapped_ascii(value)
    return "".join(c for c in repaired if not unicodedata.category(c).startswith("C")).strip()[:200]
