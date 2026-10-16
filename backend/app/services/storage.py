from __future__ import annotations

import asyncio
from datetime import UTC, datetime, timedelta
from typing import TYPE_CHECKING, Any

from botocore.exceptions import BotoCoreError, ClientError

if TYPE_CHECKING:
    from mypy_boto3_s3.type_defs import HeadObjectOutputTypeDef

from app.db.models import Asset, Upload
from app.domain.errors import DomainError
from app.resources import Resources


class Storage:
    def __init__(self, resources: Resources) -> None:
        self.resources = resources

    def upload_url(self, upload: Upload) -> tuple[str, dict[str, str]]:
        params: dict[str, Any] = {
            "Bucket": self.resources.bucket,
            "Key": upload.object_key,
            "ContentType": upload.content_type,
            "ContentLength": upload.expected_size,
            "IfNoneMatch": "*",
        }
        seconds = max(1, min(600, int((upload.expires_at - datetime.now(UTC)).total_seconds())))
        url = self.resources.signer.generate_presigned_url(
            "put_object", Params=params, ExpiresIn=seconds, HttpMethod="PUT"
        )
        return url, {"Content-Type": upload.content_type, "If-None-Match": "*"}

    async def head(self, key: str) -> HeadObjectOutputTypeDef:
        try:
            return await asyncio.to_thread(
                self.resources.storage.head_object, Bucket=self.resources.bucket, Key=key
            )
        except ClientError as error:
            status = error.response.get("ResponseMetadata", {}).get("HTTPStatusCode")
            if status == 404:
                raise DomainError("UPLOAD_NOT_FOUND", "Файл ещё не загружен", 404) from error
            raise DomainError("MEDIA_UNAVAILABLE", "Хранилище временно недоступно", 503) from error
        except BotoCoreError as error:
            raise DomainError("MEDIA_UNAVAILABLE", "Хранилище временно недоступно", 503) from error

    def playback_url(self, asset: Asset) -> tuple[str, datetime]:
        url = self.resources.signer.generate_presigned_url(
            "get_object",
            Params={
                "Bucket": self.resources.bucket,
                "Key": asset.object_key,
                "ResponseContentType": asset.content_type,
            },
            ExpiresIn=300,
            HttpMethod="GET",
        )
        return url, datetime.now(UTC) + timedelta(seconds=300)
