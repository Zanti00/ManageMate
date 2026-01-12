<?php

namespace App\Services\Admin;

use App\Repositories\Admin\DashboardRepository;
use App\Repositories\Admin\EventRepository;

class DashboardService
{
    public function __construct(
        private DashboardRepository $dashboardRepo,
        private EventRepository $eventRepo
    ) {}

    public function getDashboardData(int $userId): array
    {
        $year = (int) now()->year;

        $totalEvents = $this->dashboardRepo->countEventsByAdmin($userId);
        $totalAttendees = $this->dashboardRepo->countTotalAttendeesByAdmin($userId);
        $attendanceRate = $this->dashboardRepo->calculateAttendanceRate($userId);
        $attendanceTrendData = $this->dashboardRepo->getTotalAttendancePerMonth($userId, $year);
        $eventStatusData = $this->dashboardRepo->getTotalEventStatus($userId);
        $eventAttendanceTrendData = $this->dashboardRepo->getEventTitleAttendees($userId);
        $topFiveEvents = $this->eventRepo->getTopFiveEventsByAdmin($userId);

        $statusRow = $eventStatusData[0] ?? null;
        $formattedStatusData = [
            $statusRow->pending_events ?? 0,
            $statusRow->active_events ?? 0,
            $statusRow->rejected_events ?? 0,
        ];

        return [
            'total_events' => $totalEvents,
            'overall_total_attendees' => $totalAttendees,
            'attendance_rate' => $attendanceRate,
            'monthly_attendance_trend_data' => $attendanceTrendData,
            'event_status_data' => $formattedStatusData,
            'event_attendance_trend_data' => $eventAttendanceTrendData,
            'top_five_events' => $topFiveEvents,
        ];
    }
}
