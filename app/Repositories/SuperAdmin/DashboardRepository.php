<?php

namespace App\Repositories\SuperAdmin;

use Illuminate\Support\Facades\DB;

class DashboardRepository
{
    public function getDashboardStats(): ?object
    {
        return DB::table('vw_SuperAdminDashboardStats')->first();
    }

    public function getEventStatusOverview(): ?object
    {
        return DB::table('vw_Event_AllStats')->first();
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
