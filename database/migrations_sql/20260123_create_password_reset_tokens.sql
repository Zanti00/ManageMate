CREATE TABLE password_reset_tokens (
    email VARCHAR(255) PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE()
);