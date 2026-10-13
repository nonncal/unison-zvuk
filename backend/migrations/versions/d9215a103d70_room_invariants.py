"""Enforce room capacity and host consistency at transaction commit."""

from alembic import op

revision = "d9215a103d70"
down_revision = "b15de69c1309"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("""
        CREATE FUNCTION validate_room_membership() RETURNS trigger LANGUAGE plpgsql AS $$
        DECLARE target uuid; room_capacity integer; room_host uuid;
                members integer; hosts integer; matching_hosts integer;
        BEGIN
            IF TG_TABLE_NAME = 'rooms' THEN
                target := NEW.id;
            ELSIF TG_OP = 'DELETE' THEN
                target := OLD.room_id;
            ELSE
                target := NEW.room_id;
            END IF;
            SELECT capacity, host_participant_id INTO room_capacity, room_host
                FROM rooms WHERE id = target FOR UPDATE;
            IF NOT FOUND THEN RETURN NULL; END IF;
            SELECT count(*), count(*) FILTER (WHERE role = 'host'),
                   count(*) FILTER (WHERE role = 'host' AND id = room_host)
                INTO members, hosts, matching_hosts
                FROM participants WHERE room_id = target AND left_at IS NULL;
            IF members > room_capacity OR
               (members > 0 AND (hosts != 1 OR matching_hosts != 1)) OR
               (members = 0 AND room_host IS NOT NULL) THEN
                RAISE EXCEPTION 'room membership invariant violated'
                    USING ERRCODE = '23514', CONSTRAINT = 'room_membership';
            END IF;
            RETURN NULL;
        END $$
    """)
    op.execute("""
        CREATE CONSTRAINT TRIGGER rooms_membership
        AFTER INSERT OR UPDATE ON rooms DEFERRABLE INITIALLY DEFERRED
        FOR EACH ROW EXECUTE FUNCTION validate_room_membership()
    """)
    op.execute("""
        CREATE CONSTRAINT TRIGGER participants_membership
        AFTER INSERT OR UPDATE OR DELETE ON participants DEFERRABLE INITIALLY DEFERRED
        FOR EACH ROW EXECUTE FUNCTION validate_room_membership()
    """)
    op.execute("""
        CREATE FUNCTION prevent_participant_move() RETURNS trigger LANGUAGE plpgsql AS $$
        BEGIN
            IF NEW.room_id != OLD.room_id OR NEW.session_id != OLD.session_id THEN
                RAISE EXCEPTION 'membership identity is immutable' USING ERRCODE = '23514';
            END IF;
            RETURN NEW;
        END $$
    """)
    op.execute("""
        CREATE TRIGGER participants_immutable_identity BEFORE UPDATE ON participants
        FOR EACH ROW EXECUTE FUNCTION prevent_participant_move()
    """)


def downgrade() -> None:
    op.execute("DROP TRIGGER participants_immutable_identity ON participants")
    op.execute("DROP FUNCTION prevent_participant_move()")
    op.execute("DROP TRIGGER participants_membership ON participants")
    op.execute("DROP TRIGGER rooms_membership ON rooms")
    op.execute("DROP FUNCTION validate_room_membership()")
