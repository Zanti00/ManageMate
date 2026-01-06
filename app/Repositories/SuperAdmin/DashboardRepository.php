<?php

namespace App\Repositories\SuperAdmin;

use Illuminate\Support\Facades\DB;

class DashboardRepository
{
    public function getDashboardStats(): ?object
    {
        $result = DB::select('EXEC GetSuperadminDashboardStats');

        return $result[0] ?? null;
    }
}
