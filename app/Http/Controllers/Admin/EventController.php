<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Repositories\Admin\EventRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
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
            'images' => 'required|array|min:1',
            'images.*' => 'image|max:1024', // 1MB limit
        ], [
            'images.required' => 'Please upload at least one image.',
            'images.min' => 'Please upload at least one image.',
        ]);

        try {
            $eventPayload = Arr::except($validated, ['images']);

            $eventId = $this->eventRepo->insertEvent(Auth::id(), $eventPayload);
            if ($eventId === null) {
                throw new \RuntimeException('Failed to create event.');
            }

            $images = $request->file('images', []);
            if (! empty($images)) {
                $storedPaths = [];

                foreach ($images as $image) {
                    if ($image) {
                        $storedPaths[] = $image->store('events', 'public');
                    }
                }

                if (! empty($storedPaths)) {
                    $this->eventRepo->insertEventImages((int) $eventId, $storedPaths);
                }
            }

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
        $event = $this->eventRepo->getEventById((int) $id, Auth::id());

        if (! $event) {
            return redirect()
                ->route('admin.event.index')
                ->withErrors(['error' => 'Event not found.']);
        }

        $eventImages = $this->eventRepo->getEventImages((int) $id);
        $event->images = array_column($eventImages, 'image_path');

        if (! empty($event->images) && empty($event->image_path)) {
            $event->image_path = $event->images[0];
        }

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
        $event = $this->eventRepo->getEventById((int) $id, Auth::id());

        if (! $event) {
            return redirect()
                ->route('admin.event.index')
                ->withErrors(['error' => 'Event not found.']);
        }

        $eventImages = $this->eventRepo->getEventImages((int) $id);
        $event->images = array_column($eventImages, 'image_path');

        return Inertia::render('admin/event/edit', [
            'event' => $event,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
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
            'images' => 'array|nullable',
            'images.*' => 'image|max:1024|nullable',
            'existing_images' => 'array|nullable',
            'existing_images.*' => 'nullable|string',
        ]);

        $validator->after(function ($validator) use ($request) {
            $existingImages = array_filter($request->input('existing_images', []));
            $newImages = array_filter($request->file('images', []));

            if (empty($existingImages) && empty($newImages)) {
                $validator->errors()->add('images', 'Please retain or upload at least one image.');
            }
        });

        $validated = $validator->validate();

        try {
            $event = $this->eventRepo->getEventById((int) $id, Auth::id());

            if (! $event) {
                return redirect()
                    ->route('admin.event.index')
                    ->withErrors(['error' => 'Event not found.']);
            }

            $eventPayload = Arr::except($validated, ['images', 'existing_images']);

            $this->eventRepo->updateEvent((int) $id, Auth::id(), $eventPayload);

            $existingImagesPayload = $request->input('existing_images', []);
            $existingImages = [];

            foreach ($existingImagesPayload as $index => $path) {
                $existingImages[(int) $index] = is_string($path) && $path !== ''
                    ? $path
                    : null;
            }

            $newImages = $request->file('images', []);
            $storedPaths = [];

            foreach ($newImages as $index => $image) {
                if ($image) {
                    $storedPaths[(int) $index] = $image->store('events', 'public');
                }
            }

            $hasImagePayload = ! empty(array_filter($existingImages)) || ! empty($storedPaths);

            if ($hasImagePayload) {
                $finalPaths = [];
                $maxSlots = max(count($existingImages), count($storedPaths));

                for ($slot = 0; $slot < $maxSlots; $slot++) {
                    $newPath = $storedPaths[$slot] ?? null;
                    $existingPath = $existingImages[$slot] ?? null;

                    if ($newPath) {
                        $finalPaths[] = $newPath;
                    } elseif ($existingPath) {
                        $finalPaths[] = $existingPath;
                    }
                }

                $this->eventRepo->deleteEventImages((int) $id);

                if (! empty($finalPaths)) {
                    $this->eventRepo->insertEventImages((int) $id, $finalPaths);
                }
            }

            return redirect()
                ->route('admin.event.index')
                ->with('success', 'Event updated successfully!');
        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => 'Failed to update event: '.$e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $this->eventRepo->deleteEventById((int) $id);

            return redirect()
                ->route('admin.event.index')
                ->with('success', 'Event deleted successfully.');
        } catch (\Exception $e) {
            return redirect()
                ->route('admin.event.index')
                ->withErrors(['error' => 'Failed to delete event: '.$e->getMessage()]);
        }
    }
}
