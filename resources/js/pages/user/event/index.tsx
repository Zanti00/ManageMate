import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EventCard } from '@/components/ui/event-card';
import { SearchInput } from '@/components/ui/search-input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import user from '@/routes/user';
import { type BreadcrumbItem } from '@/types';
import { getEventDisplayStatus } from '@/utils/event-status';
import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Event',
        href: user.event.index().url,
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

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginatedEvents = {
    current_page: number;
    data: Event[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
};

interface Props {
    events?: PaginatedEvents;
}

export default function UserEvent({ events }: Props) {
    const eventsData = events?.data || [];

    const eventsWithStatus = eventsData.map((event) => ({
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

    const handlePageChange = (url: string | null) => {
        if (!url) return;
        router.get(url, {}, { preserveState: true, preserveScroll: true });
    };

    const renderPageNumbers = () => {
        if (!events) return null;

        const pages = [];
        const currentPage = events.current_page;
        const lastPage = events.last_page;
        const maxVisible = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(lastPage, startPage + maxVisible - 1);

        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <Button
                    key={i}
                    variant={i === currentPage ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(`${events.path}?page=${i}`)}
                    className="min-w-[2.5rem]"
                >
                    {i}
                </Button>,
            );
        }

        return pages;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col gap-8 p-8">
                <Card className="p-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-row">
                                <p>Status</p>
                            </div>
                            <div className="flex flex-row">
                                <Tabs
                                    value={statusFilter}
                                    onValueChange={(value) =>
                                        setStatusFilter(value as any)
                                    }
                                >
                                    <div className="flex flex-row">
                                        <TabsList className="h-10 gap-2 bg-transparent p-0">
                                            <TabsTrigger
                                                value="all"
                                                className="bg-gray-200"
                                            >
                                                All Events ({events?.total || 0}
                                                )
                                            </TabsTrigger>

                                            <TabsTrigger
                                                value="Upcoming"
                                                className="bg-gray-200"
                                            >
                                                Upcoming (
                                                {
                                                    eventsWithStatus.filter(
                                                        (e) =>
                                                            e.status ===
                                                            'Upcoming',
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
                                                        (e) =>
                                                            e.status ===
                                                            'Ongoing',
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
                                                        (e) =>
                                                            e.status ===
                                                            'Closed',
                                                    ).length
                                                }
                                                )
                                            </TabsTrigger>
                                        </TabsList>
                                    </div>
                                </Tabs>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-row">
                                <p>Search</p>
                            </div>
                            <SearchInput placeholder="Search by title, category, or location..." />
                        </div>
                    </div>
                </Card>

                {filteredStatus.length > 0 ? (
                    <>
                        <div className="grid grid-cols-3 gap-6">
                            {filteredStatus.map((event) => (
                                <EventCard
                                    key={event.id}
                                    {...event}
                                    viewDetailsHref={
                                        user.event.show(event.id).url
                                    }
                                    className="hover:shadow-lg"
                                />
                            ))}
                        </div>

                        {events && events.last_page > 1 && (
                            <Card className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-600">
                                        Showing {events.from} to {events.to} of{' '}
                                        {events.total} events
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                handlePageChange(
                                                    events.prev_page_url,
                                                )
                                            }
                                            disabled={!events.prev_page_url}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            Previous
                                        </Button>

                                        <div className="flex gap-1">
                                            {renderPageNumbers()}
                                        </div>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                handlePageChange(
                                                    events.next_page_url,
                                                )
                                            }
                                            disabled={!events.next_page_url}
                                        >
                                            Next
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </>
                ) : (
                    <Card className="p-12">
                        <div className="text-center text-gray-500">
                            No events found
                        </div>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
