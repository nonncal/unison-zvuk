from io import BytesIO

from PIL import Image, ImageOps, UnidentifiedImageError

from app.domain.errors import DomainError


def normalize_cover(raw: bytes) -> bytes:
    try:
        with Image.open(BytesIO(raw)) as image:
            if (
                image.format not in {"PNG", "JPEG", "WEBP"}
                or image.width * image.height > 16_777_216
            ):
                raise ValueError("Unsupported cover")
            image.load()
            normalized = ImageOps.exif_transpose(image).convert("RGB")
            normalized.thumbnail((512, 512))
            output = BytesIO()
            normalized.save(output, format="WEBP", quality=85)
            return output.getvalue()
    except (UnidentifiedImageError, OSError, ValueError, Image.DecompressionBombError) as error:
        raise DomainError(
            "INVALID_COVER", "Выберите PNG, JPEG или WebP до 5 МБ и 16 мегапикселей", 422
        ) from error
