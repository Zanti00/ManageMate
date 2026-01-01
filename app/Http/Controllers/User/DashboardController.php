<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $eventsToday = DB::select('EXEC GetEventsToday');
        $upcomingEvents = DB::select('EXEC GetUpcomingEvents');

        return Inertia::render('user/dashboard', [
            'eventsToday' => $eventsToday,
            'upcomingEvents' => $upcomingEvents,
        ]);
    }
}
