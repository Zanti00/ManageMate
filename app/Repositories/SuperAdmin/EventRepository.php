<?php

namespace App\Repositories\SuperAdmin;

use Illuminate\Support\Facades\DB;

class EventRepository
{
    public function getAll(): array
    {
        return DB::select('EXEC GetAllEvents');
    }

    public function findById(int $id): ?object
    {
        $result = DB::select('EXEC GetEventById @id = :id, @user_id = NULL', ['id' => $id]);

        return $result ? $result[0] : null;
    }

    public function approve(int $id): void
    {
        DB::statement('EXEC ApproveEvent @id = :id', ['id' => $id]);
    }

    public function reject(int $id): void
    {
        DB::statement('EXEC RejectEvent @id = :id', ['id' => $id]);
    }
}
