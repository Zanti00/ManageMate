<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Services\SuperAdmin\EventService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    public function __construct(private EventService $eventService) {}

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $events = $this->eventService->getAllEvents();

        return Inertia::render('superadmin/event/index', [
            'events' => $events,
        ]);
    }

    public function search(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'query' => 'nullable|string|max:150',
            'status' => 'nullable|string|in:all,Pending,Active,Rejected,Closed,Deleted',
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:50',
        ]);

        $query = trim((string) ($validated['query'] ?? ''));
        $status = $validated['status'] ?? null;
        $page = (int) ($validated['page'] ?? 1);
        $perPage = (int) ($validated['per_page'] ?? 10);

        if ($status === 'all' || $status === '') {
            $status = null;
        }

        $result = $this->eventService->searchEvents(
            $query,
            $status,
            $page,
            $perPage,
        );

        return response()->json($result);
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
        $event = $this->eventService->getEventById((int) $id);

        return Inertia::render('superadmin/event/view', ['event' => $event]);
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

    public function approve_event(string $id)
    {
        try {
            $this->eventService->approveEvent((int) $id);

            return redirect()->route('superadmin.event.index')
                ->with('success', 'Event approved successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to approve event: '.$e->getMessage()]);
        }
    }

    public function reject_event(string $id)
    {
        try {
            $this->eventService->rejectEvent((int) $id);

            return redirect()->route('superadmin.event.index')
                ->with('success', 'Event rejected successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to reject event: '.$e->getMessage()]);
        }
    }

    public function feature_event(string $id)
    {
        try {
            $this->eventService->featureEvent((int) $id);

            return redirect()->route('superadmin.event.index')
                ->with('success', 'Event featured successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to reject event: '.$e->getMessage()]);
        }
    }
}
