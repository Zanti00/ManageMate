<?php

namespace App\Services\User;

use App\Repositories\User\EventRepository;
use Carbon\Carbon;
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

    public function buildTicketSnapshot(?object $event): array
    {
        $event ??= (object) [];

        $dateRange = $this->formatRange(
            $this->formatDateValue($event->start_date ?? null),
            $this->formatDateValue($event->end_date ?? null),
        );

        $timeRange = $this->formatRange(
            $this->formatTimeValue($event->start_time ?? null),
            $this->formatTimeValue($event->end_time ?? null),
        );

        return [
            'date_range' => $dateRange ?? 'TBA',
            'time_range' => $timeRange ?? 'TBA',
            'location' => $event->location ?? 'See event page for details',
            'price_label' => $this->formatPriceValue($event->price ?? null),
            'cta_url' => isset($event->id)
                ? route('user.event.show', (int) $event->id)
                : route('dashboard'),
        ];
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

    private function formatDateValue(?string $date): ?string
    {
        if (! $date) {
            return null;
        }

        try {
            return Carbon::parse($date)->format('M j, Y');
        } catch (\Throwable $e) {
            report($e);

            return null;
        }
    }

    private function formatTimeValue(?string $time): ?string
    {
        if (! $time) {
            return null;
        }

        try {
            $normalized = preg_match('/^\d{2}:\d{2}$/', $time) ? $time.':00' : $time;
            $normalized = preg_replace('/\.\d+$/', '', $normalized);

            return Carbon::createFromFormat('H:i:s', $normalized)->format('g:i A');
        } catch (\Throwable $e) {
            report($e);

            return null;
        }
    }

    private function formatRange(?string $start, ?string $end): ?string
    {
        if (! $start && ! $end) {
            return null;
        }

        if ($start && $end && $start === $end) {
            return $start;
        }

        if ($start && $end) {
            return $start.' - '.$end;
        }

        return $start ?? $end;
    }

    private function formatPriceValue(mixed $price): string
    {
        if ($price === null) {
            return 'Free';
        }

        $numeric = (float) $price;

        if ($numeric <= 0) {
            return 'Free';
        }

        return '$'.number_format($numeric, 2);
    }
}
