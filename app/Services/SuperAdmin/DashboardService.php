<?php

namespace App\Services\SuperAdmin;

use App\Repositories\SuperAdmin\DashboardRepository;

class DashboardService
{
    public function __construct(private DashboardRepository $dashboardRepo) {}

    public function getDashboardData(): array
    {
        $stats = $this->dashboardRepo->getDashboardStats();

        return [
            'active_admins' => (string) ($stats->active_admins ?? 0),
            'pending_events' => (string) ($stats->pending_events ?? 0),
            'active_events' => (string) ($stats->active_events ?? 0),
        ];
    }
}
