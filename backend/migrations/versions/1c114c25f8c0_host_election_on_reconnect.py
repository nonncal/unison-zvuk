"""Allow vacant host while participants await reconnect."""

from alembic import op

revision = "1c114c25f8c0"
down_revision = "d9215a103d70"
branch_labels = None
depends_on = None


def function(host_check: str) -> str:
    return (
        """
        CREATE OR REPLACE FUNCTION validate_room_membership()
        RETURNS trigger LANGUAGE plpgsql AS $$
        DECLARE target uuid; room_capacity integer; room_host uuid;
                members integer; hosts integer; matching_hosts integer;
        BEGIN
            IF TG_TABLE_NAME = 'rooms' THEN target := NEW.id;
            ELSIF TG_OP = 'DELETE' THEN target := OLD.room_id;
            ELSE target := NEW.room_id; END IF;
            SELECT capacity, host_participant_id INTO room_capacity, room_host
                FROM rooms WHERE id = target FOR UPDATE;
            IF NOT FOUND THEN RETURN NULL; END IF;
            SELECT count(*), count(*) FILTER (WHERE role = 'host'),
                   count(*) FILTER (WHERE role = 'host' AND id = room_host)
                INTO members, hosts, matching_hosts
                FROM participants WHERE room_id = target AND left_at IS NULL;
            IF members > room_capacity OR
    """
        + host_check
        + """
               (members = 0 AND room_host IS NOT NULL) THEN
                RAISE EXCEPTION 'room membership invariant violated'
                    USING ERRCODE = '23514', CONSTRAINT = 'room_membership';
            END IF;
            RETURN NULL;
        END $$
    """
    )


def upgrade() -> None:
    op.execute(
        function("""
        (room_host IS NOT NULL AND (hosts != 1 OR matching_hosts != 1)) OR
        (room_host IS NULL AND hosts != 0) OR
    """)
    )


def downgrade() -> None:
    op.execute(
        function("""
        (members > 0 AND (hosts != 1 OR matching_hosts != 1)) OR
    """)
    )
