-- Migration: Create organizations table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'organizations')
BEGIN
    CREATE TABLE organizations (
        id INT IDENTITY(1,1) PRIMARY KEY,
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        name NVARCHAR(255) NOT NULL,
        abbreviation NVARCHAR(50) NOT NULL,
        type NVARCHAR(255) NOT NULL,
        email NVARCHAR(255) NOT NULL,
        address NVARCHAR(255) NOT NULL,
        is_deleted BIT NULL DEFAULT 0
    );
END
