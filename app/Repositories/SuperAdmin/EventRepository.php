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

    public function search(
        ?string $query = null,
        ?string $status = null,
        int $page = 1,
        int $perPage = 10,
    ): array {
        $result = DB::select(
            'EXEC usp_Event_Search
            @user_id = NULL,
            @query = :query,
            @status = :status,
            @page = :page,
            @per_page = :per_page',
            [
                'query' => $query ?? '',
                'status' => $status,
                'page' => $page,
                'per_page' => $perPage,
            ],
        );

        $events = array_map(static fn ($row) => (array) $row, $result);

        $meta = [
            'current_page' => $page,
            'per_page' => $perPage,
            'total' => count($events),
            'last_page' => max(1, (int) ceil(max(count($events), 1) / max($perPage, 1))),
        ];

        if (! empty($result)) {
            $first = (array) $result[0];

            $total = isset($first['total_count']) ? (int) $first['total_count'] : $meta['total'];
            $per = isset($first['per_page']) ? (int) $first['per_page'] : $meta['per_page'];
            $current = isset($first['current_page']) ? (int) $first['current_page'] : $meta['current_page'];
            $last = isset($first['last_page'])
                ? (int) $first['last_page']
                : (int) ceil(max($total, 1) / max($per, 1));

            $meta = [
                'current_page' => $current,
                'per_page' => $per,
                'total' => $total,
                'last_page' => max(1, $last),
            ];
        }

        return [
            'data' => $events,
            'meta' => $meta,
        ];
    }

    public function getEventImages(int $eventId): array
    {
        return DB::select('EXEC usp_EventImages_GetByEvent @event_id = :event_id', [
            'event_id' => $eventId,
        ]);
    }
}
