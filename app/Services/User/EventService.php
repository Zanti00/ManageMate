<?php

namespace App\Services\User;

use App\Repositories\User\EventRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class EventService
{
    public function __construct(private EventRepository $eventRepo) {}

    public function getPaginatedEvents(int $userId, int $perPage, int $currentPage, string $url, array $query): LengthAwarePaginator
    {
        $allEvents = $this->eventRepo->getEventsByUser($userId);
        $eventsCollection = collect($allEvents);

        // Slice the collection to get items for current page
        $currentPageItems = $eventsCollection
            ->slice(($currentPage - 1) * $perPage, $perPage)
            ->values();

        // Create paginator
        return new LengthAwarePaginator(
            $currentPageItems,
            $eventsCollection->count(),
            $perPage,
            $currentPage,
            [
                'path' => $url,
                'query' => $query,
            ]
        );
    }

    public function getEventDetails(int $eventId, int $userId): ?object
    {
        $event = $this->eventRepo->getEventById($eventId, $userId);

        if ($event) {
            // Business logic: Convert is_registered to boolean
            $event->is_registered = (bool) $event->is_registered;
        }

        return $event;
    }

    public function getRegisteredEvents(int $userId): array
    {
        return $this->eventRepo->getRegisteredEvents($userId);
    }

    public function registerUserToEvent(int $userId, int $eventId): void
    {
        $this->eventRepo->registerUserToEvent($userId, $eventId);
    }
}
