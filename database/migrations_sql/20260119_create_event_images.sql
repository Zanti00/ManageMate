-- Migration: Create event_images table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'event_images')
BEGIN
    CREATE TABLE event_images (
        id INT IDENTITY(1,1) PRIMARY KEY,
        event_id BIGINT NOT NULL,
        image_path NVARCHAR(255) NOT NULL,
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        INDEX idx_event_images_event_id (event_id),
        CONSTRAINT fk_event_images_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    );
END
