from botocore.exceptions import ClientError

from app.config import load_settings
from app.resources import Resources


def main() -> None:
    resources = Resources(load_settings())
    try:
        resources.storage.head_bucket(Bucket=resources.bucket)
    except ClientError as error:
        if error.response["ResponseMetadata"]["HTTPStatusCode"] != 404:
            raise
        resources.storage.create_bucket(Bucket=resources.bucket)
    finally:
        resources.storage.close()


if __name__ == "__main__":
    main()
