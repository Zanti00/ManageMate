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
        $eventsWithImages = $this->attachImages($allEvents);
        $eventsCollection = collect($eventsWithImages);

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
            $this->attachImages([$event]);
        }

        return $event;
    }

    public function getRegisteredEvents(int $userId): array
    {
        $events = $this->eventRepo->getRegisteredEvents($userId);

        return $this->attachImages($events);
    }

    public function registerUserToEvent(int $userId, int $eventId): void
    {
        $this->eventRepo->registerUserToEvent($userId, $eventId);
    }

    private function attachImages(array $events): array
    {
        foreach ($events as $event) {
            if (! isset($event->id)) {
                continue;
            }

            $images = $this->eventRepo->getEventImages((int) $event->id);
            $paths = array_values(array_filter(array_map(
                static fn ($image) => $image->image_path ?? null,
                $images,
            )));
            $event->images = $paths;
            if (! empty($paths)) {
                $event->image_path = $paths[0];
            }
        }

        return $events;
    }
}
