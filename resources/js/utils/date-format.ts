export function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

export function formatTime(timeStr: string): string {
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(Number(hours), Number(minutes));
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
}

export function formatDateRange(startDate: string, endDate: string): string {
    if (startDate === endDate) {
        return formatDate(startDate);
    }
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

export function formatTimeRange(startTime: string, endTime: string): string {
    if (startTime === endTime) {
        return formatTime(startTime);
    }
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
}
