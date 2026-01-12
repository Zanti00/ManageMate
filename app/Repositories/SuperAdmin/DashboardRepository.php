<?php

namespace App\Repositories\SuperAdmin;

use Illuminate\Support\Facades\DB;

class DashboardRepository
{
    public function getDashboardStats(): ?object
    {
        $result = DB::select('EXEC usp_SuperadminDashboardStats');

        return $result[0] ?? null;
    }

    public function getEventStatusOverview(): ?object
    {
        $result = DB::select('EXEC usp_Event_AllStats');

        return $result[0] ?? null;
    }

    public function getPlatformGrowthTrends(int $year): array
    {
        return DB::select('EXEC usp_Event_User_TotalCountPerMonth @year = :year', ['year' => $year]);
    }

    public function getTopPerformingOrganizations(): array
    {
        return DB::select('EXEC usp_Organization_TopPerformingByAttendees');
    }

    public function getTopPerformingEvents(): array
    {
        return DB::select('EXEC usp_Event_Top3ByAttendees');
    }
}
