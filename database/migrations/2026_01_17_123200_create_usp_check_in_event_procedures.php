<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::unprepared(<<<'SQL'
IF OBJECT_ID('dbo.usp_Check_In_Event_Insert', 'P') IS NOT NULL
    DROP PROCEDURE dbo.usp_Check_In_Event_Insert;
SQL);

        DB::unprepared(<<<'SQL'
CREATE PROCEDURE dbo.usp_Check_In_Event_Insert
    @user_id INT,
    @event_id INT,
    @checked_in_at DATETIME2(0)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO check_in_events (user_id, event_id, created_at, updated_at)
    VALUES (@user_id, @event_id, @checked_in_at, @checked_in_at);
END
SQL);

        DB::unprepared(<<<'SQL'
IF OBJECT_ID('dbo.usp_Check_In_Event_FindById', 'P') IS NOT NULL
    DROP PROCEDURE dbo.usp_Check_In_Event_FindById;
SQL);

        DB::unprepared(<<<'SQL'
CREATE PROCEDURE dbo.usp_Check_In_Event_FindById
    @user_id INT,
    @event_id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1
        id,
        user_id,
        event_id,
        created_at AS checked_in_at
    FROM check_in_events
    WHERE user_id = @user_id
      AND event_id = @event_id
    ORDER BY created_at DESC;
END
SQL);
    }

    public function down(): void
    {
        DB::unprepared(<<<'SQL'
IF OBJECT_ID('dbo.usp_Check_In_Event_FindById', 'P') IS NOT NULL
    DROP PROCEDURE dbo.usp_Check_In_Event_FindById;
SQL);

        DB::unprepared(<<<'SQL'
IF OBJECT_ID('dbo.usp_Check_In_Event_Insert', 'P') IS NOT NULL
    DROP PROCEDURE dbo.usp_Check_In_Event_Insert;
SQL);
    }
};
