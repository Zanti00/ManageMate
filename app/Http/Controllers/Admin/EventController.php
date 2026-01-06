<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Repositories\Admin\EventRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EventController extends Controller
{
    public function __construct(private EventRepository $eventRepo) {}

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $events = $this->eventRepo->getEventsByAdmin(Auth::id());

        return Inertia::render('admin/event/index', [
            'events' => $events,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/event/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:100',
            'description' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'start_time' => 'required|date_format:H:i:s',
            'end_time' => 'required|date_format:H:i:s|after_or_equal:start_time',
            'registration_start_date' => 'required|date|before_or_equal:end_date',
            'registration_end_date' => 'required|date|after_or_equal:registration_start_date|before_or_equal:end_date',
            'registration_start_time' => 'required|date_format:H:i:s',
            'registration_end_time' => 'required|date_format:H:i:s|after_or_equal:registration_start_time',
            'location' => 'required|string|max:100',
            'price' => 'required|numeric|min:0',
        ]);

        try {
            $this->eventRepo->insertEvent(Auth::id(), $validated);

            return redirect()->route('admin.event.index')
                ->with('success', 'Event created successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to create event: '.$e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $event = $this->eventRepo->getEventById((int) $id);
        $registrationTrendData = $this->eventRepo->getRegistrationTrend((int) $id);
        $studentYearLevelData = $this->eventRepo->getStudentYearLevelData((int) $id);
        $programDistributionData = $this->eventRepo->getProgramDistributionData((int) $id);
        $checkInTimelineData = $this->eventRepo->getCheckInTimelineData((int) $id);
        $eventAttendees = $this->eventRepo->getAttendeesByEvent((int) $id);

        return Inertia::render('admin/event/view', [
            'event' => $event,
            'registration_trend_labels' => array_column($registrationTrendData, 'date_label'),
            'registration_trend_data' => array_column($registrationTrendData, 'total_registrations'),
            'student_year_level_data' => $studentYearLevelData,
            'program_distribution_data' => $programDistributionData,
            'check_in_timeline_data' => $checkInTimelineData,
            'event_attendees' => $eventAttendees,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        // return Inertia::render('admin/event/edit');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
