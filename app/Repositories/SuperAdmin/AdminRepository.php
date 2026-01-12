<?php

namespace App\Repositories\SuperAdmin;

use Illuminate\Support\Facades\DB;

class AdminRepository
{
    public function getAll(): array
    {
        return DB::select('EXEC usp_User_GetAdmins');
    }

    public function findById(int $id): ?object
    {
        $result = DB::select('EXEC usp_User_GetAdminById @user_id = :user_id', ['user_id' => $id]);

        return $result ? $result[0] : null;
    }

    public function insert(array $data): void
    {
        DB::statement(
            'EXEC usp_InsertAdmin
            @username = :username,
            @first_name = :first_name,
            @middle_name = :middle_name,
            @last_name = :last_name,
            @position_title = :position_title,
            @email = :email,
            @phone_number = :phone_number,
            @password = :password,
            @role = :role,
            @organization_id = :organization_id',
            $data
        );
    }

    public function update(int $id, array $data): void
    {
        DB::statement(
            'EXEC usp_User_UpdateAdminById
            @user_id = :user_id,
            @username = :username,
            @first_name = :first_name,
            @middle_name = :middle_name,
            @last_name = :last_name,
            @position_title = :position_title,
            @email = :email,
            @phone_number = :phone_number',
            array_merge(['user_id' => $id], $data)
        );
    }

    public function delete(int $id): void
    {
        DB::statement('EXEC usp_User_DeleteAdmin @user_id = :user_id', ['user_id' => $id]);
    }

    public function restore(int $id): void
    {
        DB::statement('EXEC usp_User_RestoreAdmin @user_id = :user_id', ['user_id' => $id]);
    }

    public function getEventStats(int $userId): ?object
    {
        $result = DB::select('EXEC usp_Event_StatsByAdmin @user_id = :user_id', ['user_id' => $userId]);

        return $result[0] ?? null;
    }

    public function getMonthlyPerformanceById(int $userId, int $year): array
    {
        return DB::select('EXEC usp_Event_MonthlyStatsByAdmin @user_id = :user_id, @year = :year', ['user_id' => $userId, 'year' => $year]);
    }

    public function getEvents(int $userId): array
    {
        return DB::select('EXEC usp_Event_GetByAdmin @user_id = :user_id', ['user_id' => $userId]);
    }
}
