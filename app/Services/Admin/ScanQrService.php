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

    public function handleScan(string $payload): array
    {
        [$userId, $eventId] = $this->extractIdentifiers($payload);
        $attendedAt = now()->toDateTimeString();
        $event = $this->eventRepo->getEventById($eventId);

        if (! $event) {
            throw new InvalidArgumentException('Event details could not be found for this QR code.');
        }

        $registration = $this->scanRepo->findRegistration($userId, $eventId);
        if ($registration && ! empty($registration->attended_at)) {
            $formatted = Carbon::parse($registration->attended_at)
                ->timezone(config('app.timezone'))
                ->format('M j, Y g:i A');

            throw new InvalidArgumentException(
                'This QR code was already scanned on '.$formatted.'.',
            );
        }

        $eventEnd = $this->determineEventEndMoment($event);
        if ($eventEnd && $eventEnd->isPast()) {
            throw new InvalidArgumentException(
                'This event already ended on '.$eventEnd->format('M j, Y g:i A').'.',
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
            throw new InvalidArgumentException('QR code is invalid or incomplete.');
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
