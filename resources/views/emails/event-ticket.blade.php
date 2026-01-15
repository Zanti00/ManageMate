<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Event Ticket</title>
</head>

<body style="margin:0;padding:32px;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;color:#111827;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" role="presentation"
                    style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 40px rgba(15,23,42,0.12);">
                    <tr>
                        <td style="background:#111827;padding:32px;color:#f9fafb;">
                            <p
                                style="margin:0;font-size:14px;text-transform:uppercase;letter-spacing:0.12em;color:#facc15;">
                                ManageMate</p>
                            <h1 style="margin:12px 0 0;font-size:28px;line-height:1.2;">
                                {{ $event->title ?? 'Event Registration' }}</h1>
                            <p style="margin:8px 0 0;font-size:16px;color:#d1d5db;">Your QR ticket is ready. Present it
                                during check-in.</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:32px;">
                            <p style="margin:0 0 16px;font-size:16px;">Hi {{ $user->name ?? 'there' }},</p>
                            <p style="margin:0 0 24px;font-size:15px;color:#4b5563;">Thanks for registering! Keep this
                                email handy and have the QR code ready when you arrive at the venue.</p>
                            <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                                style="margin-bottom:24px;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
                                <tr>
                                    <td
                                        style="padding:16px 20px;background:#f9fafb;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280;">
                                        Event Snapshot</td>
                                </tr>
                                <tr>
                                    <td style="padding:20px;">
                                        <p style="margin:0 0 12px;"><strong>Date:</strong>
                                            {{ $ticketSnapshot['date_range'] ?? 'TBA' }}</p>
                                        <p style="margin:0 0 12px;"><strong>Time:</strong>
                                            {{ $ticketSnapshot['time_range'] ?? 'TBA' }}</p>
                                        <p style="margin:0 0 12px;"><strong>Location:</strong>
                                            {{ $ticketSnapshot['location'] ?? 'See event page for details' }}</p>
                                        <p style="margin:0;"><strong>Ticket Price:</strong>
                                            {{ $ticketSnapshot['price_label'] ?? 'Free' }}</p>
                                    </td>
                                </tr>
                            </table>
                            <div style="text-align:center;margin-bottom:24px;">
                                <div style="display:inline-block;padding:16px;background:#f3f4f6;border-radius:16px;">
                                    <img src="data:image/svg+xml;base64,{{ $qrImageBase64 }}" alt="Event QR code"
                                        style="width:220px;height:220px;display:block;margin:0 auto;" />
                                </div>
                            </div>
                            <p style="margin:0 0 16px;font-size:14px;color:#6b7280;">Need to update your registration
                                details? Visit your ManageMate dashboard anytime.</p>
                            <a href="{{ $ticketSnapshot['cta_url'] ?? url('/dashboard') }}"
                                style="display:inline-block;padding:14px 28px;background:#111827;color:#f9fafb;text-decoration:none;border-radius:999px;font-weight:600;font-size:14px;">View
                                Event Page</a>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:24px;background:#f9fafb;font-size:12px;color:#9ca3af;text-align:center;">
                            ManageMate · Automated QR Ticket · {{ config('app.name') }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
