// Utility to generate and download a CSV report for an event and its attendees
// Usage: generateEventReport(event, event_attendees)

/**
 * Generates and downloads a CSV report for the given event and attendees.
 * @param {object} event - The event object (with all details)
 * @param {Array<object>} event_attendees - Array of attendee objects
 */
type Event = {
    title: string;
    description: string;
    location: string;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    status: string;
    price: number | string;
    earnings: number | string;
    registries: number | string;
    attendees: number;
};

type Attendee = {
    username: string;
    year_level: string;
    program: string;
    email: string;
    register_date: string;
    check_in_date: string;
};

export function generateEventReport(event: Event, event_attendees: Attendee[]) {
    // Prepare CSV header
    const headers = [
        'Username',
        'Year Level',
        'Program',
        'Email',
        'Register Date',
        'Check-in Date',
    ];
    // Prepare CSV rows
    const rows = event_attendees.map((attendee: Attendee) => [
        attendee.username,
        attendee.year_level,
        attendee.program,
        attendee.email,
        attendee.register_date,
        attendee.check_in_date,
    ]);

    // Add event summary as a header row (optional)
    const eventSummary = [
        ['Event Title', event.title],
        ['Description', event.description],
        ['Location', event.location],
        ['Start Date', event.start_date],
        ['End Date', event.end_date],
        ['Start Time', event.start_time],
        ['End Time', event.end_time],
        ['Status', event.status],
        ['Price', event.price],
        ['Earnings', event.earnings],
        ['Total Registries', event.registries],
        ['Total Attendees', event.attendees],
    ];

    // Compose CSV content
    let csvContent = '';
    eventSummary.forEach(([k, v]) => {
        csvContent += `${k},"${String(v).replace(/"/g, '""')}"\n`;
    });
    csvContent += '\n';
    csvContent += headers.join(',') + '\n';
    rows.forEach((row) => {
        csvContent +=
            row
                .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
                .join(',') + '\n';
    });

    // Download as CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
        'download',
        `${event.title.replace(/\s+/g, '_')}_report.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
