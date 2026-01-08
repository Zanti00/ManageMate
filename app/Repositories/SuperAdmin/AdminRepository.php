<?php

namespace App\Repositories\SuperAdmin;

use Illuminate\Support\Facades\DB;

class AdminRepository
{
    public function getAll(): array
    {
        return DB::select('EXEC GetAdmins');
    }

    public function findById(int $id): ?object
    {
        $result = DB::select('EXEC GetAdminById :id', ['id' => $id]);

        return $result ? $result[0] : null;
    }

    public function insert(array $data): void
    {
        DB::statement(
            'EXEC InsertAdmins
            @username = :username,
            @first_name = :first_name,
            @middle_name = :middle_name,
            @last_name = :last_name,
            @position_title = :position_title,
            @email = :email,
            @phone_number = :phone_number,
            @password = :password,
            @role = :role',
            $data
        );
    }

    public function update(int $id, array $data): void
    {
        DB::statement(
            'EXEC EditAdmin
            @id = :id,
            @username = :username,
            @first_name = :first_name,
            @middle_name = :middle_name,
            @last_name = :last_name,
            @position_title = :position_title,
            @email = :email,
            @phone_number = :phone_number',
            array_merge(['id' => $id], $data)
        );
    }

    public function delete(int $id): void
    {
        DB::statement('EXEC DeleteAdmin @id = :id', ['id' => $id]);
    }

    public function restore(int $id): void
    {
        DB::statement('EXEC RestoreAdmin @id = :id', ['id' => $id]);
    }

    public function getEventStats(int $userId): ?object
    {
        $result = DB::select('EXEC CountEventStatsByAdmin @user_id = :user_id', ['user_id' => $userId]);

        return $result[0] ?? null;
    }

    public function getMonthlyPerformanceById(int $userId, int $year): array
    {
        return DB::select('EXEC SP_GET_ATTENDEES_EVENTS_TOTAL_COUNT_BY_ADMIN @p_user_id = :p_user_id, @p_year = :p_year', ['p_user_id' => $userId, 'p_year' => $year]);
    }

    public function getTotalEventStatusById(int $userId): ?object
    {
        $result = DB::select('EXEC GetTotalEventStatusByAdmin @user_id = :user_id', ['user_id' => $userId]);

        return $result[0] ?? null;
    }

    public function getEvents(int $userId): array
    {
        return DB::select('EXEC GetEventsByAdmin @user_id = :user_id', ['user_id' => $userId]);
    }
}
