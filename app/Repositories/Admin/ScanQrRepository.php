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
        DB::statement(
            'EXEC usp_RegisteredEvent_Update @user_id = :user_id, @event_id = :event_id, @attended_at = :attended_at',
            [
                'user_id' => $userId,
                'event_id' => $eventId,
                'attended_at' => $attendedAt,
            ],
        );
    }
}
