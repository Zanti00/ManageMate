<?php

namespace App\Repositories\SuperAdmin;

use Illuminate\Support\Facades\DB;

class DashboardRepository
{
    public function getDashboardStats(): ?object
    {
        $result = DB::select('EXEC GetSuperadminDashboardStats');

        return $result[0] ?? null;
    }

    public function getEventStatusOverview(): ?object
    {
        $result = DB::select('EXEC GetAllEventStatus');

        return $result[0] ?? null;
    }

    public function getPlatformGrowthTrends(int $year): array
    {
        return DB::select('EXEC SP_GET_ADMINS_EVENTS_TOTAL_COUNT_PER_MONTH @p_year = :p_year', ['p_year' => $year]);
    }
}
