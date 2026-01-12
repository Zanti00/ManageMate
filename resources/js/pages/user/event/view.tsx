import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RegisterModal } from '@/components/ui/register-modal';
import AppLayout from '@/layouts/app-layout';
import user from '@/routes/user';
import { BreadcrumbItem } from '@/types';
import { formatDateRange, formatTimeRange } from '@/utils/date-format';
import { getEventDisplayStatus } from '@/utils/event-status';
import { formatPrice } from '@/utils/price-format';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'View Event',
        href: user.event.show.url(1),
    },
];

type EventStatus = 'Closed' | 'Upcoming' | 'Ongoing';

type Event = {
    id: number;
    title: string;
    description: string;
    location: string;
    price: number;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    registration_start_date: string;
    registration_end_date: string;
    registration_start_time: string;
    registration_end_time: string;
    status: EventStatus;
    is_registered: boolean;
};

interface Props {
    event: Event;
}

export default function ViewEvent({ event }: Props) {
    const [modalOpen, setModalOpen] = useState(false);

    if (!event) {
        return <div className="p-6">Event not found</div>;
    }

    const eventStatus = getEventDisplayStatus(event);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col overflow-hidden rounded-lg p-8">
                <img
                    className="h-64 w-full rounded-t-md object-cover object-top"
                    src="https://readdy.ai/api/search-image?query=modern%20technology%20conference%20summit%20with%20large%20screens%20displaying%20innovative%20tech%20presentations%20students%20and%20professionals%20networking%20in%20bright%20spacious%20university%20auditorium%20with%20stage%20and%20seating&width=1200&height=400&seq=tech-summit-detail-001&orientation=landscape"
                />
                <div className="flex flex-col gap-y-6">
                    <Card className="rounded-t-none p-6 shadow-md">
                        <div className="flex flex-row justify-between">
                            <div className="flex flex-col gap-y-3">
                                {event.status && (
                                    <div className="flex flex-row">
                                        {eventStatus === 'Closed' && (
                                            <Badge variant="closed">
                                                Closed
                                            </Badge>
                                        )}
                                        {eventStatus === 'Upcoming' && (
                                            <Badge variant="active">
                                                Upcoming
                                            </Badge>
                                        )}
                                        {eventStatus === 'Ongoing' && (
                                            <Badge variant="pending">
                                                Ongoing
                                            </Badge>
                                        )}
                                    </div>
                                )}
                                <div className="flex flex-row">
                                    <Label className="text-4xl font-extrabold">
                                        {event.title}
                                    </Label>
                                </div>
                                <div className="flex flex-row text-gray-800">
                                    <p>{event.description}</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-2 flex flex-col gap-6">
                            <Card className="flex flex-col px-6">
                                <div className="flex flex-row">
                                    <p className="text-xl font-extrabold">
                                        Event Details
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="flex flex-row">
                                        <div className="flex flex-col">
                                            <p className="font-medium">Date</p>
                                            <p>
                                                {formatDateRange(
                                                    event.start_date,
                                                    event.end_date,
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row">
                                        <div className="flex flex-col">
                                            <p className="font-medium">Time</p>
                                            <p>
                                                {formatTimeRange(
                                                    event.start_time,
                                                    event.end_time,
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row">
                                        <div className="flex flex-col">
                                            <p className="font-medium">
                                                Location
                                            </p>
                                            <p>{event.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row">
                                        <div className="flex flex-col">
                                            <p className="font-medium">
                                                Ticket Price
                                            </p>
                                            <p>{formatPrice(event.price)}</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                            <Card className="gap-y-6 px-6">
                                <p className="text-xl font-extrabold">
                                    Organizer Information
                                </p>
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-row">
                                        <div className="flex flex-col">
                                            <p className="font-medium">
                                                Organization
                                            </p>
                                            <p>
                                                Commonwealth Information Society
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row">
                                        <div className="flex flex-col">
                                            <p className="font-medium">Email</p>
                                            <p>commitspupqc@test.com</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row">
                                        <div className="flex flex-col">
                                            <p className="font-medium">Phone</p>
                                            <p>09123456789</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                        <div className="flex flex-col">
                            <Card className="flex flex-col px-6">
                                <Card className="flex flex-col gap-0 bg-orange-50 px-4 py-3">
                                    <div className="flex flex-row">
                                        <p className="font-extrabold text-orange-900">
                                            Registration Date
                                        </p>
                                    </div>
                                    <div className="flex flex-row">
                                        <p className="font-medium text-orange-700">
                                            {formatDateRange(
                                                event.registration_start_date,
                                                event.registration_end_date,
                                            )}
                                        </p>
                                    </div>
                                </Card>
                                <Button
                                    className={
                                        event.is_registered
                                            ? 'bg-green-800'
                                            : eventStatus === 'Closed'
                                              ? 'bg-gray-200 text-gray-500'
                                              : 'shadow-lg'
                                    }
                                    disabled={
                                        event.is_registered ||
                                        eventStatus === 'Closed'
                                    }
                                    variant="default"
                                    onClick={() => setModalOpen(true)}
                                >
                                    {event.is_registered
                                        ? "You're already registered!"
                                        : eventStatus === 'Closed'
                                          ? 'Registration closed'
                                          : 'Register'}
                                </Button>
                            </Card>
                        </div>
                    </div>
                </div>
                <RegisterModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    eventId={event.id}
                    eventTitle={event.title}
                    eventLocation={event.location}
                    eventPrice={formatPrice(event.price)}
                    eventDate={formatDateRange(
                        event.start_date,
                        event.end_date,
                    )}
                    eventTime={formatTimeRange(
                        event.start_time,
                        event.end_time,
                    )}
                />
            </div>
        </AppLayout>
    );
}
