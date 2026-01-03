<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $userId = Auth::id();
        $eventsToday = DB::select('EXEC GetEventsToday');
        $upcomingEvents = DB::select('EXEC GetUpcomingEvents');
        $dashboardStats = DB::select('EXEC GetUserDashboardStats @user_id = :user_id', ['user_id' => $userId]);

        $stats = $dashboardStats[0] ?? null;

        $activeRegisteredEvents = $stats ? (string) ($stats->total_active_registered_events ?? 0) : '0';
        $eventsThisWeek = $stats ? (string) ($stats->total_events_this_week ?? 0) : '0';

        Log::info('query results', [
            'upcoming_events' => $upcomingEvents,
            'eventsToday' => $eventsToday,
        ]);

        return Inertia::render('user/dashboard', [
            'events_today' => $eventsToday,
            'upcoming_events' => $upcomingEvents,
            'total_active_registered_events' => $activeRegisteredEvents,
            'total_events_this_week' => $eventsThisWeek,
        ]);
    }
}
