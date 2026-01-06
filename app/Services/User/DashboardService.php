<?php

namespace App\Services\User;

use App\Repositories\User\DashboardRepository;
use App\Repositories\User\EventRepository;
use Illuminate\Support\Facades\Log;

class DashboardService
{
    public function __construct(
        private DashboardRepository $dashboardRepo,
        private EventRepository $eventRepo
    ) {}

    public function getDashboardData(int $userId): array
    {
        $eventsToday = $this->eventRepo->getEventsToday();
        $upcomingEvents = $this->eventRepo->getUpcomingEvents();
        $stats = $this->dashboardRepo->getDashboardStats($userId);

        // Business logic: Format stats with defaults
        $formattedStats = $this->formatDashboardStats($stats);

        // Log for debugging (business logic)
        Log::info('Dashboard query results', [
            'upcoming_events' => $upcomingEvents,
            'events_today' => $eventsToday,
        ]);

        return [
            'events_today' => $eventsToday,
            'upcoming_events' => $upcomingEvents,
            'total_active_registered_events' => $formattedStats['active_registered_events'],
            'total_events_this_week' => $formattedStats['events_this_week'],
        ];
    }

    private function formatDashboardStats(?object $stats): array
    {
        return [
            'active_registered_events' => (string) ($stats->total_active_registered_events ?? 0),
            'events_this_week' => (string) ($stats->total_events_this_week ?? 0),
        ];
    }
}
