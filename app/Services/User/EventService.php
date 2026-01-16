<?php

namespace App\Services\User;

use App\Repositories\User\EventRepository;
use Carbon\Carbon;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

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

    public function searchEvents(int $userId, ?string $query, ?string $status, int $page, int $perPage): array
    {
        $perPage = max(1, $perPage);
        $normalizedStatus = $this->normalizeDisplayStatus($status);
        $searchTerm = Str::lower(trim((string) $query));

        $events = collect($this->attachImages($this->eventRepo->getEventsByUser($userId)))
            ->map(function ($event) {
                $event->display_status = $this->determineDisplayStatus($event);

                return $event;
            })
            ->filter(function ($event) use ($searchTerm, $normalizedStatus) {
                $matchesQuery = $this->matchesQuery($event, $searchTerm);
                $matchesStatus = $normalizedStatus === null
                    || $event->display_status === $normalizedStatus;

                return $matchesQuery && $matchesStatus;
            })
            ->values();

        $total = $events->count();
        $lastPage = max(1, (int) ceil($total / $perPage));
        $currentPage = max(1, min($page, $lastPage));
        $slice = $events
            ->slice(($currentPage - 1) * $perPage, $perPage)
            ->values()
            ->map(static fn ($event) => (array) $event)
            ->all();

        return [
            'data' => $slice,
            'meta' => [
                'current_page' => $currentPage,
                'per_page' => $perPage,
                'total' => $total,
                'last_page' => $lastPage,
            ],
        ];
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

    private function matchesQuery(object $event, string $searchTerm): bool
    {
        if ($searchTerm === '') {
            return true;
        }

        $haystacks = [
            $event->title ?? '',
            $event->location ?? '',
            $event->description ?? '',
        ];

        foreach ($haystacks as $haystack) {
            if ($haystack === null) {
                continue;
            }

            if (Str::contains(Str::lower((string) $haystack), $searchTerm)) {
                return true;
            }
        }

        return false;
    }

    private function normalizeDisplayStatus(?string $status): ?string
    {
        if (! $status) {
            return null;
        }

        return match (Str::lower($status)) {
            'upcoming' => 'upcoming',
            'ongoing' => 'ongoing',
            'closed' => 'closed',
            'all' => null,
            default => null,
        };
    }

    private function determineDisplayStatus(object $event): string
    {
        if (empty($event->start_date) || empty($event->end_date)) {
            return 'upcoming';
        }

        try {
            $startDate = Carbon::parse($event->start_date);
            $endDate = Carbon::parse($event->end_date);
        } catch (\Throwable $e) {
            report($e);

            return 'upcoming';
        }

        $now = Carbon::now();

        if ($now->lt($startDate)) {
            return 'upcoming';
        }

        if ($now->gte($startDate) && $now->lte($endDate)) {
            return 'ongoing';
        }

        return 'closed';
    }
}
