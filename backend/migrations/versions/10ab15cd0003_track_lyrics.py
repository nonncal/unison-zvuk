"""Store optional lyrics (synced or plain) on tracks."""

import sqlalchemy as sa
from alembic import op

revision = "10ab15cd0003"
down_revision = "10ab15cd0002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("tracks", sa.Column("lyrics", sa.Text(), nullable=True))
    op.add_column(
        "tracks", sa.Column("lyrics_version", sa.Integer(), server_default="0", nullable=False)
    )


def downgrade() -> None:
    op.drop_column("tracks", "lyrics_version")
    op.drop_column("tracks", "lyrics")
