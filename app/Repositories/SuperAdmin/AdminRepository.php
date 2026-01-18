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
            'EXEC usp_User_InsertAdmin
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
            @phone_number = :phone_number,
            @organization_id = :organization_id',
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

    public function searchAdmins(
        ?string $query = null,
        ?string $status = null,
        int $page = 1,
        int $perPage = 6,
    ): array {
        $statement = 'EXEC usp_User_Search
            @query = :query,
            @page = :page,
            @per_page = :per_page';

        $bindings = [
            'query' => $query ?? '',
            'page' => $page,
            'per_page' => $perPage,
        ];

        if ($status !== null && $status !== '') {
            $statement .= ',
            @status = :status';
            $bindings['status'] = $status;
        }

        $result = DB::select($statement, $bindings);
        $admins = array_map(static fn ($row) => (array) $row, $result);

        $meta = [
            'current_page' => $page,
            'per_page' => $perPage,
            'total' => count($admins),
            'last_page' => max(1, (int) ceil(max(count($admins), 1) / max($perPage, 1))),
        ];

        if (! empty($admins)) {
            $first = $admins[0];

            $total = array_key_exists('total_count', $first) ? (int) $first['total_count'] : $meta['total'];
            $per = array_key_exists('per_page', $first) ? (int) $first['per_page'] : $meta['per_page'];
            $current = array_key_exists('current_page', $first) ? (int) $first['current_page'] : $meta['current_page'];
            $last = array_key_exists('last_page', $first)
                ? (int) $first['last_page']
                : (int) ceil(max($total, 1) / max($per, 1));

            $meta = [
                'current_page' => max(1, $current),
                'per_page' => max(1, $per),
                'total' => max(0, $total),
                'last_page' => max(1, $last),
            ];
        }

        return [
            'data' => $admins,
            'meta' => $meta,
        ];
    }
}
