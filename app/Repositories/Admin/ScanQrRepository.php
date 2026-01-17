<?php

namespace App\Repositories\Admin;

use Illuminate\Support\Facades\DB;

class ScanQrRepository
{
    public function findRegistration(int $userId, int $eventId): ?object
    {
        $result = DB::select(
            'EXEC usp_RegisteredEvent_Check @user_id = :user_id, @event_id = :event_id',
            [
                'user_id' => $userId,
                'event_id' => $eventId,
            ],
        );

        return $result[0] ?? null;
    }

    public function markAttendance(int $userId, int $eventId, string $attendedAt): void
    {
        DB::transaction(function () use ($userId, $eventId, $attendedAt): void {
            DB::statement(
                'EXEC usp_Check_In_Event_Insert @user_id = :user_id, @event_id = :event_id, @checked_in_at = :checked_in_at',
                [
                    'user_id' => $userId,
                    'event_id' => $eventId,
                    'checked_in_at' => $attendedAt,
                ],
            );

            $this->incrementEventAttendance($eventId);
        });
    }

    public function findCheckIn(int $userId, int $eventId): ?object
    {
        $result = DB::select(
            'EXEC usp_Check_In_Event_FindById @user_id = :user_id, @event_id = :event_id',
            [
                'user_id' => $userId,
                'event_id' => $eventId,
            ],
        );

        return $result[0] ?? null;
    }

    private function incrementEventAttendance(int $eventId): void
    {
        DB::statement(
            'EXEC usp_Event_UpdateAttendees @event_id = :event_id',
            [
                'event_id' => $eventId,
            ],
        );
    }
}
