-- Migration: Create users table with organization_id
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'users')
BEGIN
    CREATE TABLE users (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        username NVARCHAR(255) NULL,
        first_name NVARCHAR(255) NOT NULL,
        middle_name NVARCHAR(255) NULL,
        last_name NVARCHAR(255) NOT NULL,
        position_title NVARCHAR(255) NULL,
        year_level TINYINT NULL,
        program NVARCHAR(255) NULL,
        email NVARCHAR(255) NOT NULL UNIQUE,
        phone_number NVARCHAR(255) NULL,
        password NVARCHAR(255) NOT NULL,
        organization_id INT NULL,
        is_deleted BIT NULL DEFAULT 0,
        role NVARCHAR(20) NOT NULL DEFAULT 'user',
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        remember_token VARCHAR(100) NULL,
        CONSTRAINT fk_users_organization FOREIGN KEY (organization_id) REFERENCES organizations(id),
        CONSTRAINT chk_users_role CHECK (role IN ('user', 'admin', 'superadmin'))
    );
END
