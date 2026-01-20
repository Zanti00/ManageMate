-- Migration: Create cache and cache_locks tables
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'cache')
BEGIN
    CREATE TABLE cache (
        [key] NVARCHAR(255) PRIMARY KEY,
        [value] NVARCHAR(MAX) NOT NULL,
        expiration INT NOT NULL
    );
END

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'cache_locks')
BEGIN
    CREATE TABLE cache_locks (
        [key] NVARCHAR(255) PRIMARY KEY,
        owner NVARCHAR(255) NOT NULL,
        expiration INT NOT NULL
    );
END
