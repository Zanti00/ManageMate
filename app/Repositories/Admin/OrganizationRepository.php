<?php

namespace App\Repositories\Admin;

use Illuminate\Support\Facades\DB;

class OrganizationRepository
{
    /**
     * Fetch organization info by event id using usp_Organization_GetByEvent
     */
    public function findByEventId(int $eventId): ?object
    {
        $result = DB::select('EXEC usp_Organization_GetByEvent @event_id = :event_id', ['event_id' => $eventId]);

        return ! empty($result) ? $result[0] : null;
    }
}
