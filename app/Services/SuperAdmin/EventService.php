<?php

namespace App\Services\SuperAdmin;

use App\Repositories\SuperAdmin\EventRepository;
use Illuminate\Support\Facades\Log;

class EventService
{
    public function __construct(private EventRepository $eventRepo) {}

    public function getAllEvents(): array
    {
        return $this->eventRepo->getAll();
    }

    public function searchEvents(
        ?string $query,
        ?string $status,
        int $page,
        int $perPage,
    ): array {
        $payload = $this->eventRepo->search($query, $status, $page, $perPage);
        $items = $payload['data'] ?? [];

        $events = array_map(static function ($event) {
            $record = (array) $event;
            $isDeleted = (int) ($record['is_deleted'] ?? 0) === 1;
            $record['status'] = $isDeleted
                ? 'Deleted'
                : ($record['status'] ?? 'Pending');

            return $record;
        }, $items);

        $meta = $payload['meta'] ?? null;

        if (! $meta) {
            $total = count($events);
            $meta = [
                'current_page' => $page,
                'per_page' => $perPage,
                'total' => $total,
                'last_page' => max(1, (int) ceil(max($total, 1) / max($perPage, 1))),
            ];
        }

        return [
            'data' => $events,
            'meta' => $meta,
        ];
    }

    public function getEventById(int $id): ?object
    {
        $event = $this->eventRepo->findById($id);

        if (! $event) {
            return null;
        }

        $images = $this->eventRepo->getEventImages($id);
        $event->images = array_column($images, 'image_path');

        if (! empty($event->images) && empty($event->image_path)) {
            $event->image_path = $event->images[0];
        }

        return $event;
    }

    public function approveEvent(int $id): void
    {
        $this->eventRepo->approve($id);
    }

    public function rejectEvent(int $id): void
    {
        $this->eventRepo->reject($id);
    }

    public function featureEvent(int $id): void
    {
        $this->eventRepo->setFeatured($id);
    }

    // public function getMonthlyPerformanceData(int $id): array
    // {
    //     $year = (int) now()->year;

    //     $result = $this->eventRepo->getMonthlyPerformanceById($id, $year);

    //     Log::info('query result', [
    //         'result' => $result,
    //     ]);

    //     return $result;
    // }
}
