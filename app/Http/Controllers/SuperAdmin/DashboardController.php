<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $dashboardStats = DB::select('EXEC GetSuperadminDashboardStats');

        $stats = $dashboardStats[0] ?? null;

        $activeAdmins = $stats ? (string) ($stats->active_admins ?? 0) : '0';
        $pendingEvents = $stats ? (string) ($stats->pending_events ?? 0) : '0';
        $activeEvents = $stats ? (string) ($stats->active_events ?? 0) : '0';

        return Inertia::render('superadmin/dashboard', [
            'active_admins' => $activeAdmins,
            'pending_events' => $pendingEvents,
            'active_events' => $activeEvents,
        ]);
    }
}
