import os
import subprocess
import textwrap

import pytest

pytestmark = pytest.mark.system


def test_running_transcoder_enforces_file_network_output_and_time_limits() -> None:
    container = os.environ.get("UNISON_TRANSCODER_CONTAINER")
    if not container:
        pytest.skip("Set UNISON_TRANSCODER_CONTAINER for an isolated running transcoder")
    source = textwrap.dedent("""
        import shutil
        from pathlib import Path
        from uuid import uuid4
        from app.services.media_jobs import job_directory
        from app.workers.transcoder import ProcessingFailure, execute
        root = Path('/jobs')
        directory = job_directory(root, uuid4())
        peer = job_directory(root, uuid4())
        try:
            (directory / 'source.bin').write_bytes(b'wave')
            (directory / 'out' / 'tmp').mkdir(parents=True)
            (peer / 'secret').write_bytes(b'private peer source')
            execute(directory, ['/usr/local/bin/python3', '-c',
                "from pathlib import Path; import socket; "
                "assert not Path('/jobs').exists(); assert not Path('/app').exists(); "
                "assert not Path('/proc').exists(); assert Path('/input').read_bytes() == b'wave'; "
                "s=socket.socket(); s.settimeout(0.2); "
                "result=s.connect_ex(('1.1.1.1',443)); assert result != 0"],
                'isolation.txt', 5, 8192)
            for command, output, seconds, bound, expected in [
                (['/usr/bin/dd', 'if=/dev/zero', 'of=/work/large.bin', 'bs=1048576', 'count=1'],
                    'limit.txt', 5, 4096, 'OUTPUT_LIMIT'),
                (['/usr/bin/sleep', '5'], 'timeout.txt', 1, 8192, 'PROCESSING_TIMEOUT'),
            ]:
                try:
                    execute(directory, command, output, seconds, bound)
                except ProcessingFailure as error:
                    assert error.code == expected, (error.code, expected)
                else:
                    raise AssertionError('resource limit was bypassed')
            assert (directory / 'out' / 'large.bin').stat().st_size <= 4096
            print('filesystem, network, output and timeout isolation passed')
        finally:
            shutil.rmtree(directory)
            shutil.rmtree(peer)
    """)
    result = subprocess.run(
        ["docker", "exec", "-i", container, "/app/.venv/bin/python", "-"],
        input=source,
        text=True,
        capture_output=True,
        timeout=20,
        check=False,
    )
    assert result.returncode == 0, result.stderr
    assert "isolation passed" in result.stdout
