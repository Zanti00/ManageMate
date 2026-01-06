<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Services\User\EventService;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EventController extends Controller
{
    public function __construct(private EventService $eventService) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 9); // 9 items for 3x3 grid
        $currentPage = LengthAwarePaginator::resolveCurrentPage();

        $events = $this->eventService->getPaginatedEvents(
            Auth::id(),
            $perPage,
            $currentPage,
            $request->url(),
            $request->query()
        );

        return Inertia::render('user/event/index', [
            'events' => $events,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $event = $this->eventService->getEventDetails((int) $id, Auth::id());

        return Inertia::render('user/event/view', [
            'event' => $event,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
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

    public function myevents()
    {
        $events = $this->eventService->getRegisteredEvents(Auth::id());

        return Inertia::render('user/event/my-events', [
            'events' => $events,
        ]);
    }

    public function register(string $eventId)
    {
        try {
            $this->eventService->registerUserToEvent(Auth::id(), (int) $eventId);

            return redirect()->back()->with('success', 'Registration successful!');

        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Registration failed. Please try again.');
        }
    }
}
