import { Button } from '@/components/ui/button';
import { EventCard } from '@/components/ui/event-card';
import { EventCardSkeleton } from '@/components/ui/event-card-skeleton';
import { SearchInput } from '@/components/ui/search-input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import { type BreadcrumbItem } from '@/types';
import { getEventStatus } from '@/utils/event-status';
import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const { create } = admin.event;

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Event',
        href: admin.event.index().url,
    },
];

type FilterValues = 'Pending' | 'Active' | 'Rejected' | 'Closed';

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
    status?: FilterValues;
    image_path?: string | null;
};

interface Props {
    events?: Event[];
}

export default function AdminEvent({ events = [] }: Props) {
    const eventsWithStatus = events.map((event) => ({
        ...event,
        status: getEventStatus(event),
    }));

    const [statusFilter, setStatusFilter] = useState<'all' | FilterValues>(
        'all',
    );

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000); // 2 seconds delay

        return () => clearTimeout(timer);
    }, []);

    const filteredStatus =
        statusFilter === 'all'
            ? eventsWithStatus
            : eventsWithStatus.filter((e) => e.status === statusFilter);

    const showSkeleton = isLoading || events === undefined;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col gap-y-5 p-8">
                <div className="flex flex-row-reverse gap-4">
                    <Button>
                        <Link href={create().url}>Create Event</Link>
                    </Button>
                </div>
                <Tabs
                    value={statusFilter}
                    onValueChange={(value) => setStatusFilter(value as any)}
                >
                    <div className="flex flex-row justify-between gap-50 rounded-2xl bg-white p-3 shadow-sm">
                        <TabsList className="h-10 gap-3">
                            <TabsTrigger value="all">
                                All ({events.length})
                            </TabsTrigger>

                            <TabsTrigger value="Pending">
                                Pending (
                                {
                                    eventsWithStatus.filter(
                                        (e) => e.status === 'Pending',
                                    ).length
                                }
                                )
                            </TabsTrigger>

                            <TabsTrigger value="Active">
                                Active (
                                {
                                    eventsWithStatus.filter(
                                        (e) => e.status === 'Active',
                                    ).length
                                }
                                )
                            </TabsTrigger>
                            <TabsTrigger value="Rejected">
                                Rejected (
                                {
                                    eventsWithStatus.filter(
                                        (e) => e.status === 'Rejected',
                                    ).length
                                }
                                )
                            </TabsTrigger>
                            <TabsTrigger value="Closed">
                                Closed (
                                {
                                    eventsWithStatus.filter(
                                        (e) => e.status === 'Closed',
                                    ).length
                                }
                                )
                            </TabsTrigger>
                        </TabsList>
                        <SearchInput></SearchInput>
                    </div>
                </Tabs>
                <div className="grid grid-cols-3 gap-6">
                    {showSkeleton
                        ? Array.from({ length: 6 }).map((_, i) => (
                              <EventCardSkeleton key={i} />
                          ))
                        : filteredStatus.map((event) => (
                              <EventCard key={event.id} {...event} />
                          ))}
                </div>
            </div>
        </AppLayout>
    );
}
