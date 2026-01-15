<?php

namespace App\Repositories\SuperAdmin;

use Illuminate\Support\Facades\DB;

class EventRepository
{
    public function getAll(): array
    {
        return DB::select('EXEC usp_Event_GetAll');
    }

    public function findById(int $id): ?object
    {
        $result = DB::select('EXEC usp_Event_GetById @event_id = :event_id, @user_id = NULL', ['event_id' => $id]);

        return $result ? $result[0] : null;
    }

    public function approve(int $id): void
    {
        DB::statement('EXEC usp_Event_Approve @event_id = :event_id', ['event_id' => $id]);
    }

    public function reject(int $id): void
    {
        DB::statement('EXEC usp_Event_Reject @event_id = :event_id', ['event_id' => $id]);
    }

    public function setFeatured(int $id): void
    {
        DB::statement('EXEC usp_Event_SetFeatured @event_id = :event_id', [
            'event_id' => $id,
        ]);
    }

    public function getEventImages(int $eventId): array
    {
        return DB::select('EXEC usp_EventImages_GetByEvent @event_id = :event_id', [
            'event_id' => $eventId,
        ]);
    }
}
