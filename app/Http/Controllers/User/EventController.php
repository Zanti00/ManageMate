<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $userId = Auth::id();
        $allEvents = DB::select('EXEC GetEvents @user_id = :user_id', ['user_id' => $userId]);

        // Convert to collection for easier manipulation
        $eventsCollection = collect($allEvents);

        // Get pagination parameters
        $perPage = $request->input('per_page', 9); // 9 items to fit 3x3 grid nicely
        $currentPage = LengthAwarePaginator::resolveCurrentPage();

        // Slice the collection to get items for current page
        $currentPageItems = $eventsCollection->slice(($currentPage - 1) * $perPage, $perPage)->values();

        // Create paginator
        $events = new LengthAwarePaginator(
            $currentPageItems,
            $eventsCollection->count(),
            $perPage,
            $currentPage,
            [
                'path' => $request->url(),
                'query' => $request->query(),
            ]
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
        $userId = Auth::id();

        $event = DB::select(
            'EXEC GetEventById @id = :id, @user_id = :user_id',
            [
                'id' => $id,
                'user_id' => $userId,
            ]
        );

        $event = $event ? $event[0] : null;

        if ($event) {
            $event->is_registered = (bool) $event->is_registered;
        }

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
        $userId = Auth::id();

        $events = DB::select('EXEC GetRegisteredEventsById @user_id = :user_id', ['user_id' => $userId]);

        return Inertia::render('user/event/my-events', [
            'events' => $events,
        ]);
    }

    public function register(string $eventId)
    {

        $userId = Auth::id();

        try {
            DB::statement('EXEC InsertEventById 
            @user_id = :user_id, 
            @event_id = :event_id',
                [
                    'user_id' => $userId,
                    'event_id' => $eventId,
                ]
            );

            return redirect()->back()->with('success', 'Registration successful!');

        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Registration failed. Please try again.');
        }
    }
}
