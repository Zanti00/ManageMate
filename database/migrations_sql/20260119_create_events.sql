-- Migration: Create events table with organization_id
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'events')
BEGIN
    CREATE TABLE events (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        user_id BIGINT NOT NULL,
        organization_id INT NULL,
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        title NVARCHAR(255) NOT NULL,
        description NVARCHAR(MAX) NOT NULL,
        attendees BIGINT NULL,
        registries BIGINT NULL,
        status NVARCHAR(20) NOT NULL DEFAULT 'pending',
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        registration_start_date DATE NOT NULL,
        registration_end_date DATE NOT NULL,
        registration_start_time TIME NOT NULL,
        registration_end_time TIME NOT NULL,
        location NVARCHAR(255) NOT NULL,
        price FLOAT NOT NULL,
        earnings FLOAT NULL,
        is_deleted BIT NOT NULL DEFAULT 0,
        is_featured BIT NOT NULL DEFAULT 0,
        CONSTRAINT fk_events_user FOREIGN KEY (user_id) REFERENCES users(id),
        CONSTRAINT fk_events_organization FOREIGN KEY (organization_id) REFERENCES organizations(id),
        CONSTRAINT chk_events_status CHECK (status IN ('pending', 'active', 'rejected', 'closed'))
    );
END
