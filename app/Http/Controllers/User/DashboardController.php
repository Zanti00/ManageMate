<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $userId = Auth::id();
        $eventsToday = DB::select('EXEC GetEventsToday');
        $upcomingEvents = DB::select('EXEC GetUpcomingEvents');
        $registeredEvents = DB::select('EXEC CountRegisteredEventsById @id = :id', ['id' => $userId]);

        $totalRegisteredEvents = $registeredEvents[0]->total_rows ?? '0';

        return Inertia::render('user/dashboard', [
            'eventsToday' => $eventsToday,
            'upcomingEvents' => $upcomingEvents,
            'total_rows' => $totalRegisteredEvents,
        ]);
    }
}
