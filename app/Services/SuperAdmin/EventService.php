<?php

namespace App\Services\SuperAdmin;

use App\Repositories\SuperAdmin\EventRepository;

class EventService
{
    public function __construct(private EventRepository $eventRepo) {}

    public function getAllEvents(): array
    {
        return $this->eventRepo->getAll();
    }

    public function getEventById(int $id): ?object
    {
        return $this->eventRepo->findById($id);
    }

    public function approveEvent(int $id): void
    {
        $this->eventRepo->approve($id);
    }

    public function rejectEvent(int $id): void
    {
        $this->eventRepo->reject($id);
    }
}
