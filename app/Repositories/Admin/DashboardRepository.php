<?php

namespace App\Repositories\Admin;

use Illuminate\Support\Facades\DB;

class DashboardRepository
{
    public function countEventsByAdmin(int $userId): int
    {
        $result = DB::select('EXEC usp_Event_CountByAdmin @user_id = :user_id', ['user_id' => $userId]);

        return $result[0]->total_events ?? 0;
    }

    public function countTotalAttendeesByAdmin(int $userId): int
    {
        $result = DB::select('EXEC usp_Event_GetTotalAttendeesByAdmin @user_id = :user_id', ['user_id' => $userId]);

        return $result[0]->total_attendees_per_month ?? 0;
    }

    public function calculateAttendanceRate(int $userId): float
    {
        $result = DB::select('EXEC usp_Event_CalculateAttendanceRateByAdmin @user_id = :user_id', ['user_id' => $userId]);

        return (float) ($result[0]->attendance_rate ?? 0);
    }

    public function getTotalAttendancePerMonth(int $userId, int $year): array
    {
        return DB::select(
            'EXEC usp_Event_GetTotalAttendancePerMonthByAdmin @user_id = :user_id, @year = :year',
            ['user_id' => $userId, 'year' => $year]
        );
    }

    public function getTotalEventStatus(int $userId): array
    {
        return DB::select('EXEC usp_Event_StatsByAdmin @user_id = :user_id', ['user_id' => $userId]);
    }

    public function getEventTitleAttendees(int $userId): array
    {
        return DB::select('EXEC usp_Event_GetTitleAttendeesByAdmin @user_id = :user_id', ['user_id' => $userId]);
    }

    public function getTopFiveEventsByAdmin(int $userId): array
    {
        return DB::select('EXEC usp_Event_Top5ByAttendees @user_id = :user_id', ['user_id' => $userId]);
    }
}
