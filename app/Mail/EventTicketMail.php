<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class EventTicketMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly ?object $event,
        public readonly User $user,
        public readonly string $qrImageBase64,
        public readonly string $qrPayload,
        public readonly array $ticketSnapshot,
    ) {}

    public function build(): self
    {
        $eventTitle = (string) ($this->event->title ?? 'your upcoming event');

        return $this->subject('Your ticket for '.ucwords($eventTitle))
            ->view('emails.event-ticket')
            ->with([
                'event' => $this->event,
                'user' => $this->user,
                'qrImageBase64' => $this->qrImageBase64,
                'qrPayload' => $this->qrPayload,
                'ticketSnapshot' => $this->ticketSnapshot,
            ]);
    }
}
