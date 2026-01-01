<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $events = DB::select('EXEC GetAllEvents');

        return Inertia::render('superadmin/event/index', [
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
        $event = DB::select('EXEC GetEventById @id = :id, @user_id = NULL', ['id' => $id]);
        $event = $event ? $event[0] : null;

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
        DB::statement('EXEC ApproveEvent @id = :id', ['id' => $id]);

        return redirect()->route('superadmin.event.index')->with('success', 'Event approved');
    }

    public function reject_event(string $id)
    {
        DB::statement('EXEC RejectEvent @id = :id', ['id' => $id]);

        return redirect()->route('superadmin.event.index')->with('success', 'Event rejected');
    }
}
