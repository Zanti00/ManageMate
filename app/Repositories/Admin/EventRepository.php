<?php

namespace App\Repositories\Admin;

use Illuminate\Support\Facades\DB;

class EventRepository
{
    public function getEventsByAdmin(int $userId): array
    {
        return DB::select('EXEC GetEventsByAdmin @user_id = :user_id', ['user_id' => $userId]);
    }

    public function getEventById(int $eventId): ?object
    {
        $result = DB::select('EXEC GetEventById @id = :id, @user_id = NULL', ['id' => $eventId]);

        return ! empty($result) ? $result[0] : null;
    }

    public function insertEvent(int $userId, array $eventData): void
    {
        DB::statement(
            'EXEC InsertEvents
            @user_id = :user_id,
            @title = :title,
            @description = :description,
            @start_date = :start_date,
            @end_date = :end_date,
            @start_time = :start_time,
            @end_time = :end_time,
            @registration_start_date = :registration_start_date,
            @registration_end_date = :registration_end_date,
            @registration_start_time = :registration_start_time,
            @registration_end_time = :registration_end_time,
            @location = :location,
            @price = :price',
            array_merge(['user_id' => $userId], $eventData)
        );
    }

    public function getRegistrationTrend(int $eventId): array
    {
        return DB::select('EXEC GetRegistrationTrendByEvent @id = :id', ['id' => $eventId]);
    }

    public function getStudentYearLevelData(int $eventId): array
    {
        return DB::select('EXEC GetStudentYearLevelDataByEvent @event_id = :event_id', ['event_id' => $eventId]);
    }

    public function getTopFiveEventsByAdmin(int $userId): array
    {
        return DB::select('EXEC GetTopFiveEventsByAdmin @user_id = :user_id', ['user_id' => $userId]);
    }
}
