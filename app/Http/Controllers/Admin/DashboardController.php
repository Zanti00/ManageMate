<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $userId = Auth::id();
        $totalEvents = DB::select('EXEC CountEventsByAdmin @user_id = :user_id', ['user_id' => $userId]);
        $totalAttendees = DB::select('EXEC CountTotalAttendeesByAdmin @user_id = :user_id', ['user_id' => $userId]);
        $attendanceRate = DB::select('EXEC CalculateAttendanceRateByAdmin @user_id = :user_id', ['user_id' => $userId]);

        $totalEvents = $totalEvents[0]->total_rows ?? '0';
        $totalAttendees = $totalAttendees[0]->total_attendees ?? '0';
        $attendanceRate = (float) ($attendanceRate[0]->attendance_rate ?? '0');

        return Inertia::render('admin/dashboard',
            [
                'total_events' => $totalEvents,
                'total_attendees' => $totalAttendees,
                'attendance_rate' => $attendanceRate,
            ]);
    }
}
