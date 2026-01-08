<?php

namespace App\Services\SuperAdmin;

use App\Repositories\SuperAdmin\DashboardRepository;

class DashboardService
{
    public function __construct(private DashboardRepository $dashboardRepo) {}

    public function getDashboardData(): array
    {
        $year = (int) now()->year;

        $stats = $this->dashboardRepo->getDashboardStats();
        $eventOverviewData = $this->dashboardRepo->getEventStatusOverview();
        $platformGrowthData = $this->dashboardRepo->getPlatformGrowthTrends($year);

        return [
            'active_admins' => (string) ($stats->active_admins ?? 0),
            'pending_events' => (string) ($stats->pending_events ?? 0),
            'active_events' => (string) ($stats->active_events ?? 0),
            'pending_events_status' => (int) ($eventOverviewData->pending_events ?? 0),
            'active_events_status' => (int) ($eventOverviewData->active_events ?? 0),
            'rejected_events_status' => (int) ($eventOverviewData->rejected_events ?? 0),
            'closed_events_status' => (int) ($eventOverviewData->closed_events ?? 0),
            'platform_growth_data' => $platformGrowthData,
        ];
    }
}
