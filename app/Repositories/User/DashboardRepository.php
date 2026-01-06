<?php

namespace App\Repositories\User;

use Illuminate\Support\Facades\DB;

class DashboardRepository
{
    public function getDashboardStats(int $userId): ?object
    {
        $result = DB::select('EXEC GetUserDashboardStats @user_id = :user_id', ['user_id' => $userId]);

        return $result[0] ?? null;
    }
}
