<?php

namespace App\Repositories\Admin;

use Illuminate\Support\Facades\DB;

class EventRepository
{
    public function getEventsByAdmin(int $userId): array
    {
        return DB::select('EXEC usp_Event_GetByAdmin @user_id = :user_id', ['user_id' => $userId]);
    }

    public function searchEvents(
        int $userId,
        ?string $query = null,
        ?string $status = null,
        int $page = 1,
        int $perPage = 6,
    ): array {
        $result = DB::select(
            'EXEC usp_Event_Search
            @user_id = :user_id,
            @query = :query,
            @status = :status,
            @page = :page,
            @per_page = :per_page',
            [
                'user_id' => $userId,
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

    public function getEventById(int $eventId, ?int $userId = null): ?object
    {
        $result = DB::select(
            'EXEC usp_Event_GetById @event_id = :event_id, @user_id = NULL',
            [
                'event_id' => $eventId,
            ],
        );

        return ! empty($result) ? $result[0] : null;
    }

    public function updateEvent(int $eventId, int $userId, array $eventData): void
    {
        DB::statement(
            'EXEC usp_Event_Update
            @event_id = :event_id,
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
            array_merge(
                [
                    'event_id' => $eventId,
                    'user_id' => $userId,
                    'price' => (float) $eventData['price'],
                ],
                $eventData,
            ),
        );
    }

    public function insertEvent(int $userId, array $eventData): int
    {
        $userOrganizationId = $this->getUserOrganizationId($userId);

        DB::statement(
            'EXEC usp_Event_Insert
            @user_id = :user_id,
            @organization_id = :organization_id,
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
            array_merge([
                'user_id' => $userId,
                'organization_id' => $userOrganizationId,
            ], $eventData)
        );

        $eventId = (int) DB::getPdo()->lastInsertId();

        return $eventId;
    }

    public function insertEventImages(int $eventId, array $imagePaths): void
    {
        foreach ($imagePaths as $path) {
            DB::statement(
                'EXEC usp_EventImages_Insert @event_id = :event_id, @image_path = :image_path',
                [
                    'event_id' => $eventId,
                    'image_path' => $path,
                ]
            );
        }
    }

    public function deleteEventImages(int $eventId): void
    {
        DB::statement('EXEC usp_EventImages_DeleteByEvent @event_id = :event_id', [
            'event_id' => $eventId,
        ]);
    }

    public function getEventImages(int $eventId): array
    {
        return DB::select('EXEC usp_EventImages_GetByEvent @event_id = :event_id', [
            'event_id' => $eventId,
        ]);
    }

    public function getRegistrationTrend(int $eventId): array
    {
        return DB::select('EXEC usp_Event_RegistrationTrend @event_id = :event_id', ['event_id' => $eventId]);
    }

    public function getStudentYearLevelData(int $eventId): array
    {
        return DB::select('EXEC usp_Event_StudentYearLevelData @event_id = :event_id', ['event_id' => $eventId]);
    }

    public function getProgramDistributionData(int $eventId): array
    {
        return DB::select('EXEC usp_Event_ProgramDistributionData @event_id = :event_id', ['event_id' => $eventId]);
    }

    public function getCheckInTimelineData(int $eventId): array
    {
        return DB::select('EXEC usp_Event_CheckInTimelineData @event_id = :event_id', ['event_id' => $eventId]);
    }

    public function getAttendeesByEvent(int $eventId): array
    {
        return DB::select('EXEC usp_Event_GetAttendees @event_id = :event_id', ['event_id' => $eventId]);
    }

    public function deleteEventById(int $eventId): void
    {
        DB::statement('EXEC usp_Event_Delete @event_id = :event_id', ['event_id' => $eventId]);
    }

    public function getUserOrganizationId(int $userId): ?int
    {
        $result = DB::select('EXEC usp_User_GetOrganizationId @user_id = :user_id', ['user_id' => $userId]);

        return ! empty($result) ? (int) $result[0]->organization_id : null;
    }
}
