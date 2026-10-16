"""Consistent PostgreSQL + private audio backup; restore only into an empty project."""

import argparse
import hashlib
import json
import os
import subprocess
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WRITERS = ["frontend", "api", "worker", "catalog-init", "transcoder", "storage"]
ARCHIVE = (
    "import sys,tarfile; t=tarfile.open(fileobj=sys.stdout.buffer,mode='w|'); "
    "t.add('/data',arcname='data'); t.close()"
)
EXTRACT = (
    "import sys,tarfile; t=tarfile.open(fileobj=sys.stdin.buffer,mode='r|'); "
    "t.extractall('/',filter='data')"
)


def digest(path: Path) -> str:
    checksum = hashlib.sha256()
    with path.open("rb") as file:
        for chunk in iter(lambda: file.read(1024 * 1024), b""):
            checksum.update(chunk)
    return checksum.hexdigest()


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--env-file", type=Path, required=True)
    parser.add_argument("--project", required=True)
    parser.add_argument("--production", action="store_true")
    parser.add_argument("action", choices=["backup", "restore"])
    parser.add_argument("directory", type=Path)
    args = parser.parse_args()
    directory = args.directory.expanduser().resolve()
    if directory.is_relative_to(ROOT):
        parser.error("Backups must be outside the repository")
    command = [
        "docker",
        "compose",
        "--env-file",
        str(args.env_file.resolve()),
        "-p",
        args.project,
        "-f",
        str(ROOT / "compose.yaml"),
        "-f",
        str(ROOT / "compose.app.yaml"),
    ]
    if args.production:
        command += ["-f", str(ROOT / "compose.production.yaml")]

    def run(*arguments: str, **kwargs: object) -> subprocess.CompletedProcess:
        return subprocess.run([*command, *arguments], cwd=ROOT, check=True, **kwargs)

    running = run(
        "ps", "--status", "running", "--services", capture_output=True, text=True
    ).stdout.split()
    if args.action == "backup":
        if "postgres" not in running or "storage" not in running:
            parser.error("Backup requires a running PostgreSQL and storage")
        directory.mkdir(mode=0o700, parents=True, exist_ok=False)
        os.umask(0o077)
        paused = [service for service in WRITERS if service in running]
        try:
            if paused:
                run("stop", "-t", "60", *paused)
            with (directory / "postgres.dump").open("xb") as file:
                run(
                    "exec",
                    "-T",
                    "postgres",
                    "sh",
                    "-c",
                    'exec pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc',
                    stdout=file,
                )
            with (directory / "audio.tar").open("xb") as file:
                run("run", "--rm", "--no-deps", "-T", "audio-archive", "-c", ARCHIVE, stdout=file)
            metadata = {
                "format": 1,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "sha256": {
                    name: digest(directory / name) for name in ["postgres.dump", "audio.tar"]
                },
            }
            (directory / "manifest.json").write_text(json.dumps(metadata, indent=2) + "\n")
        finally:
            if paused:
                run("start", *paused)
        print(f"Backup completed: {directory}. Store the original runtime credentials separately.")
    else:
        if any(service in running for service in WRITERS):
            parser.error(
                "Restore requires an empty, stopped target project; use a new project name"
            )
        manifest = json.loads((directory / "manifest.json").read_text())
        if manifest.get("format") != 1:
            parser.error("Unsupported backup format")
        for name in ["postgres.dump", "audio.tar"]:
            if digest(directory / name) != manifest["sha256"][name]:
                parser.error(f"Checksum mismatch: {name}")
        run("up", "-d", "--wait", "postgres")
        tables = run(
            "exec",
            "-T",
            "postgres",
            "sh",
            "-c",
            'exec psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Atc '
            "\"SELECT count(*) FROM information_schema.tables WHERE table_schema='public'\"",
            capture_output=True,
            text=True,
        ).stdout.strip()
        if tables != "0":
            parser.error("Target PostgreSQL is not empty; refusing to overwrite data")
        run(
            "run",
            "--rm",
            "--no-deps",
            "-T",
            "audio-archive",
            "-c",
            "from pathlib import Path; assert not any(Path('/data').iterdir()), "
            "'Target audio volume is not empty'",
        )
        with (directory / "audio.tar").open("rb") as file:
            run("run", "--rm", "--no-deps", "-T", "audio-archive", "-c", EXTRACT, stdin=file)
        with (directory / "postgres.dump").open("rb") as file:
            run(
                "exec",
                "-T",
                "postgres",
                "sh",
                "-c",
                'exec pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --no-owner --exit-on-error',
                stdin=file,
            )
        print("Restore completed. Start the target stack with the original runtime credentials.")


if __name__ == "__main__":
    main()
