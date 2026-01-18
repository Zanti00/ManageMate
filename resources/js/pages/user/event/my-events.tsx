import Heading from '@/components/heading';
import { Card } from '@/components/ui/card';
import { EventCard } from '@/components/ui/event-card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import user from '@/routes/user';
import { BreadcrumbItem } from '@/types';
import { getEventDisplayStatus } from '@/utils/event-status';
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
    images?: string[];
    image_path?: string | null;
};

interface Props {
    events?: Event[];
}

export default function MyEvents({ events = [] }: Props) {
    const eventsWithStatus = events.map((event) => ({
        ...event,
        status: getEventDisplayStatus(event),
    }));

    const [statusFilter, setStatusFilter] = useState<'all' | FilterValues>(
        'all',
    );

    const filteredStatus =
        statusFilter === 'all'
            ? eventsWithStatus
            : eventsWithStatus.filter((e) => e.status === statusFilter);
    const resolveImageUrl = (path?: string | null) => {
        if (!path) return '/images/event-placeholder.png';
        return path.startsWith('http') ? path : `/storage/${path}`;
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col gap-8 p-8">
                <Heading
                    title="My Events"
                    description="Browse events you've registered for"
                />
                <Card className="p-6">
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
                </Card>
                {filteredStatus.length === 0 ? (
                    <Card className="p-12">
                        <div className="text-center text-gray-500">
                            No events found
                        </div>
                    </Card>
                ) : (
                    <div className="grid grid-cols-3 gap-6">
                        {filteredStatus.map((event) => (
                            <div key={event.id} className="flex flex-col gap-2">
                                <EventCard
                                    {...event}
                                    viewDetailsHref={
                                        user.event.show(event.id).url
                                    }
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
