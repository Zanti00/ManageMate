<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userId = Auth::id();
        $events = DB::select('EXEC GetEventsByAdmin @user_id = :user_id', ['user_id' => $userId]);

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
        $userId = Auth::id();
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
            DB::statement(
                'EXEC InsertEvents
                @user_id = :user_id,
                @title = :title,
                @description = :description,
                @start_date = :start_date,
                @end_date = :end_date,
                @start_time = :start_time,
                @end_time = :end_time,
                @registration_start_date = :registration_start_date,
                @registration_end_date = :registration_end_date,
                @registration_start_time = :registration_start_time,
                @registration_end_time = :registration_end_time,
                @location = :location,
                @price = :price',
                [
                    'user_id' => $userId,
                    'title' => $validated['title'],
                    'description' => $validated['description'],
                    'start_date' => $validated['start_date'],
                    'end_date' => $validated['end_date'],
                    'start_time' => $validated['start_time'],
                    'end_time' => $validated['end_time'],
                    'registration_start_date' => $validated['registration_start_date'],
                    'registration_end_date' => $validated['registration_end_date'],
                    'registration_start_time' => $validated['registration_start_time'],
                    'registration_end_time' => $validated['registration_end_time'],
                    'location' => $validated['location'],
                    'price' => $validated['price'],
                ]
            );

            return redirect()->route('admin.event.index')
                ->with('success', 'Event created successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to create admin: '.$e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $event = DB::select('EXEC GetEventById @id = :id, @user_id = NULL', [
            'id' => $id,
        ]);

        $event = ! empty($event) ? $event[0] : null;

        return Inertia::render('admin/event/view', [
            'event' => $event,
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
