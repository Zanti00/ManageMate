<?php

namespace App\Repositories\User;

use Illuminate\Support\Facades\DB;

class EventRepository
{
    public function getEventsByUser(int $userId): array
    {
        return DB::select('EXEC GetEvents @user_id = :user_id', ['user_id' => $userId]);
    }

    public function getEventById(int $eventId, int $userId): ?object
    {
        $result = DB::select(
            'EXEC GetEventById @id = :id, @user_id = :user_id',
            ['id' => $eventId, 'user_id' => $userId]
        );

        return $result ? $result[0] : null;
    }

    public function getRegisteredEvents(int $userId): array
    {
        return DB::select('EXEC GetRegisteredEventsById @user_id = :user_id', ['user_id' => $userId]);
    }

    public function registerUserToEvent(int $userId, int $eventId): void
    {
        DB::statement(
            'EXEC InsertEventById @user_id = :user_id, @event_id = :event_id',
            ['user_id' => $userId, 'event_id' => $eventId]
        );
    }

    public function getEventsToday(): array
    {
        return DB::select('EXEC GetEventsToday');
    }

    public function getUpcomingEvents(): array
    {
        return DB::select('EXEC GetUpcomingEvents');
    }
}
