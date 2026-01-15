<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Mail\EventTicketMail;
use App\Services\User\EventService;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
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

    public function register(Request $request, string $eventId)
    {
        $user = Auth::user();

        if (! $user) {
            return redirect()->back()->with('error', 'You must be signed in to register for this event.');
        }

        $validated = $request->validate([
            'email' => ['nullable', 'email'],
        ]);

        $email = $validated['email'] ?? $user->email;

        if (! $email) {
            return redirect()->back()->with('error', 'Please provide an email address to receive your QR ticket.');
        }

        $eventIdInt = (int) $eventId;

        try {
            $this->eventService->registerUserToEvent($user->id, $eventIdInt);

            $event = $this->eventService->getEventDetails($eventIdInt, $user->id);
            $ticketSnapshot = $this->eventService->buildTicketSnapshot($event);
            $qrPayload = $this->buildQrPayload($user->id, $eventIdInt);
            $qrImageBase64 = $this->generateQrCodeBase64($qrPayload);

            Mail::to($email)->send(new EventTicketMail(
                user: $user,
                event: $event,
                qrImageBase64: $qrImageBase64,
                qrPayload: $qrPayload,
                ticketSnapshot: $ticketSnapshot,
            ));

            return redirect()->back()->with('success', 'Registration successful! Check your email for the QR ticket.');

        } catch (\Throwable $e) {
            report($e);

            return redirect()->back()->with('error', 'Registration failed. Please try again.');
        }
    }

    private function buildQrPayload(int $userId, int $eventId): string
    {
        return json_encode([
            'user_id' => $userId,
            'event_id' => $eventId,
            'issued_at' => now()->toIso8601String(),
        ]);
    }

    private function generateQrCodeBase64(string $payload): string
    {
        $renderer = new ImageRenderer(
            new RendererStyle(400),
            new SvgImageBackEnd()
        );

        $writer = new Writer($renderer);

        return base64_encode($writer->writeString($payload));
    }
}
