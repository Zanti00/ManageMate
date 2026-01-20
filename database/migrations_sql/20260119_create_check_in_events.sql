-- Migration: Create check_in_events table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'check_in_events')
BEGIN
    CREATE TABLE check_in_events (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        user_id BIGINT NOT NULL,
        event_id BIGINT NOT NULL,
        CONSTRAINT fk_check_in_events_user FOREIGN KEY (user_id) REFERENCES users(id),
        CONSTRAINT fk_check_in_events_event FOREIGN KEY (event_id) REFERENCES events(id)
    );
END
