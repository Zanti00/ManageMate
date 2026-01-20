-- Migration: Create sessions table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'sessions')
BEGIN
    CREATE TABLE sessions (
        id NVARCHAR(255) PRIMARY KEY,
        user_id BIGINT NULL,
        ip_address NVARCHAR(45) NULL,
        user_agent NVARCHAR(MAX) NULL,
        payload NVARCHAR(MAX) NOT NULL,
        last_activity INT NOT NULL,
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        INDEX idx_sessions_user_id (user_id),
        CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id)
    );
END
