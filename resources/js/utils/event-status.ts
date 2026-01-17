export type EventStatus = 'Pending' | 'Active' | 'Rejected' | 'Closed';

type EventWithStatus = {
    status?: string;
    start_date?: string;
    end_date?: string;
};

export function getEventStatus(event: EventWithStatus): EventStatus {
    const now = new Date();
    const endDate = event.end_date ? new Date(event.end_date) : undefined;

    if (endDate && now > endDate) {
        return 'Closed';
    }

    if (!event.status) {
        return 'Pending';
    }

    const statusLower = event.status.toLowerCase();

    switch (statusLower) {
        case 'pending':
            return 'Pending';
        case 'active':
            return 'Active';
        case 'rejected':
            return 'Rejected';
        case 'closed':
            return 'Closed';
        default:
            return 'Pending';
    }
}

export function getEventDisplayStatus(
    event: EventWithStatus,
): 'Upcoming' | 'Ongoing' | 'Closed' {
    const now = new Date();

    if (event.start_date && event.end_date) {
        const startDate = new Date(event.start_date);
        const endDate = new Date(event.end_date);

        if (now < startDate) {
            return 'Upcoming';
        } else if (now >= startDate && now <= endDate) {
            return 'Ongoing';
        } else {
            return 'Closed';
        }
    }

    return 'Upcoming';
}
