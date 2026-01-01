import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { EventCard } from '@/components/ui/event-card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import user from '@/routes/user';
import { BreadcrumbItem } from '@/types';
import { getEventStatus } from '@/utils/event-status';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'My Events',
        href: user.event.myevents().url,
    },
];

type FilterValues = 'Upcoming' | 'Ongoing' | 'Closed';

type Event = {
    id: number;
    title: string;
    location: string;
    price: number;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    submit_date: number;
    attendees?: number;
    status: FilterValues;
};

interface Props {
    events?: Event[];
}

export default function MyEvents({ events = [] }: Props) {
    const eventsWithStatus = events.map((event) => ({
        ...event,
        status: getEventStatus(event),
    }));

    const [statusFilter, setStatusFilter] = useState<'all' | FilterValues>(
        'all',
    );

    const filteredStatus =
        statusFilter === 'all'
            ? eventsWithStatus
            : eventsWithStatus.filter((e) => e.status === statusFilter);
    console.log('Events received:', events);
    console.log('Events type:', typeof events);
    console.log('Is array?:', Array.isArray(events));
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col gap-8 p-8">
                <div className="grid grid-cols-4 gap-6">
                    <Card className="col-span-1">
                        <CardTitle>8</CardTitle>
                        <CardDescription>Total Events</CardDescription>
                    </Card>
                    <Card className="col-span-1">
                        <CardTitle>8</CardTitle>
                        <CardDescription>Total Events</CardDescription>
                    </Card>
                    <Card className="col-span-1">
                        <CardTitle>8</CardTitle>
                        <CardDescription>Total Events</CardDescription>
                    </Card>
                    <Card className="col-span-1">
                        <CardTitle>8</CardTitle>
                        <CardDescription>Total Events</CardDescription>
                    </Card>
                </div>
                <div className="flex flex-row">
                    <Tabs
                        value={statusFilter}
                        onValueChange={(value) => setStatusFilter(value as any)}
                    >
                        <div className="flex flex-row">
                            <TabsList className="h-10 gap-2 bg-transparent p-0">
                                <TabsTrigger
                                    value="all"
                                    className="bg-gray-200"
                                >
                                    All Events ({events.length})
                                </TabsTrigger>

                                <TabsTrigger
                                    value="Upcoming"
                                    className="bg-gray-200"
                                >
                                    Upcoming (
                                    {
                                        eventsWithStatus.filter(
                                            (e) => e.status === 'Upcoming',
                                        ).length
                                    }
                                    )
                                </TabsTrigger>

                                <TabsTrigger
                                    value="Ongoing"
                                    className="bg-gray-200"
                                >
                                    Ongoing (
                                    {
                                        eventsWithStatus.filter(
                                            (e) => e.status === 'Ongoing',
                                        ).length
                                    }
                                    )
                                </TabsTrigger>
                                <TabsTrigger
                                    value="Closed"
                                    className="bg-gray-200"
                                >
                                    Past Events (
                                    {
                                        eventsWithStatus.filter(
                                            (e) => e.status === 'Closed',
                                        ).length
                                    }
                                    )
                                </TabsTrigger>
                            </TabsList>
                        </div>
                    </Tabs>
                </div>
                <div className="grid grid-cols-3 gap-6">
                    {filteredStatus.map((event) => (
                        <EventCard
                            key={event.id}
                            {...event}
                            viewDetailsHref={user.event.show(event.id).url}
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
