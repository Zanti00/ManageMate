<?php

namespace App\Services\Admin;

use App\Models\User;
use App\Repositories\Admin\EventRepository;
use App\Repositories\Admin\ScanQrRepository;
use Carbon\Carbon;
use InvalidArgumentException;

class ScanQrService
{
    public function __construct(
        private ScanQrRepository $scanRepo,
        private EventRepository $eventRepo,
    ) {}

    public function handleScan(string $payload, int $adminId): array
    {
        [$userId, $eventId] = $this->extractIdentifiers($payload);
        $attendedAt = now()->toDateTimeString();
        $event = $this->eventRepo->getEventById($eventId);

        if (! $event) {
            throw new InvalidArgumentException('Sorry, we could not find the event for this ticket.');
        }

        // Check event ownership
        if ((int) ($event->user_id ?? 0) == (int) $adminId) {
            throw new InvalidArgumentException('This QR code cannot be used for this event. Please verify the correct event or contact the event administrator.');
        }

        $registration = $this->scanRepo->findRegistration($userId, $eventId);
        if (! $registration) {
            throw new InvalidArgumentException('This ticket is not registered for this event.');
        }

        $existingCheckIn = $this->scanRepo->findCheckIn($userId, $eventId);
        if ($existingCheckIn && ! empty($existingCheckIn->checked_in_at)) {
            $formatted = Carbon::parse($existingCheckIn->checked_in_at)
                ->timezone(config('app.timezone'))
                ->format('M j, Y g:i A');

            throw new InvalidArgumentException(
                'This ticket was already used for check-in on '.$formatted.'.',
            );
        }

        $eventStart = $this->determineEventStartMoment($event);
        if ($eventStart && $eventStart->isFuture()) {
            throw new InvalidArgumentException(
                'Check-in is not yet open. The event starts on '.$eventStart->format('M j, Y g:i A').'.',
            );
        }

        $eventEnd = $this->determineEventEndMoment($event);
        if ($eventEnd && $eventEnd->isPast()) {
            throw new InvalidArgumentException(
                'Sorry, this event has already ended. Check-in is closed.',
            );
        }

        $this->scanRepo->markAttendance($userId, $eventId, $attendedAt);

        $user = User::find($userId);

        return [
            'user' => [
                'id' => $user?->id,
                'name' => $this->formatUserName($user),
                'email' => $user?->email,
            ],
            'event' => [
                'id' => $event->id ?? $eventId,
                'title' => $event->title ?? 'Unknown Event',
                'location' => $event->location ?? 'TBA',
                'status' => $event->status ?? null,
                'start_date' => $event->start_date ?? null,
                'end_date' => $event->end_date ?? null,
                'start_time' => $event->start_time ?? null,
                'end_time' => $event->end_time ?? null,
            ],
            'attended_at' => $attendedAt,
        ];
    }

    private function determineEventEndMoment(object $event): ?Carbon
    {
        $date = $event->end_date ?? $event->start_date ?? null;

        if (! $date) {
            return null;
        }

        $time = $event->end_time ?? $event->start_time ?? '23:59:59';

        try {
            return Carbon::parse($date.' '.$time, config('app.timezone'));
        } catch (\Throwable $e) {
            report($e);

            return null;
        }
    }

    private function determineEventStartMoment(object $event): ?Carbon
    {
        $date = $event->start_date ?? $event->end_date ?? null;

        if (! $date) {
            return null;
        }

        $time = $event->start_time ?? '00:00:00';

        try {
            return Carbon::parse($date.' '.$time, config('app.timezone'));
        } catch (\Throwable $e) {
            report($e);

            return null;
        }
    }

    private function extractIdentifiers(string $payload): array
    {
        $userId = null;
        $eventId = null;

        $decoded = json_decode($payload, true);
        $jsonValid = json_last_error() === JSON_ERROR_NONE;

        if ($jsonValid && is_array($decoded)) {
            $userId = isset($decoded['user_id']) ? (int) $decoded['user_id'] : null;
            $eventId = isset($decoded['event_id']) ? (int) $decoded['event_id'] : null;
        }

        if (! $jsonValid) {
            $segments = explode('|', $payload);
            foreach ($segments as $segment) {
                [$key, $value] = array_pad(explode(':', $segment, 2), 2, null);
                if ($key === 'user') {
                    $userId = (int) $value;
                }
                if ($key === 'event') {
                    $eventId = (int) $value;
                }
            }
        }

        if (! $userId || ! $eventId) {
            throw new InvalidArgumentException('Invalid or incomplete ticket. Please try again.');
        }

        return [$userId, $eventId];
    }

    private function formatUserName(?User $user): string
    {
        if (! $user) {
            return 'Unknown User';
        }

        $fullName = trim(collect([
            $user->first_name,
            $user->middle_name,
            $user->last_name,
        ])->filter()->implode(' '));

        if ($fullName !== '') {
            return $fullName;
        }

        return $user->username ?? 'Unknown User';
    }
}
