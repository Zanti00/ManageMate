import Heading from '@/components/heading';
import { Card } from '@/components/ui/card';
import { EventCard } from '@/components/ui/event-card';
import { EventCardSkeleton } from '@/components/ui/event-card-skeleton';
import Pagination from '@/components/ui/pagination';
import { SearchInput } from '@/components/ui/search-input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEventStatusCounts } from '@/hooks/use-event-status-counts';
import { usePaginatedSearch } from '@/hooks/use-paginated-search';
import AppLayout from '@/layouts/app-layout';
import user from '@/routes/user';
import { type BreadcrumbItem } from '@/types';
import { getEventDisplayStatus } from '@/utils/event-status';
import { router } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Event',
        href: user.event.index().url,
    },
];

const SEARCH_RESULTS_PER_PAGE = 9;

const STATUS_OPTIONS = ['Upcoming', 'Ongoing', 'Closed'] as const;

type FilterValues = (typeof STATUS_OPTIONS)[number];

const STATUS_LABEL_MAP: Record<FilterValues, string> = {
    Upcoming: 'Upcoming',
    Ongoing: 'Ongoing',
    Closed: 'Past Events',
};

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

    const {
        searchQuery,
        setSearchQuery,
        debouncedQuery,
        results: searchResults,
        meta: searchMeta,
        page: searchPage,
        setPage: setSearchPage,
        isLoading: searchLoading,
        error: searchError,
        hasActiveSearch,
    } = usePaginatedSearch<Event>({
        endpoint: user.event.search().url,
        perPage: SEARCH_RESULTS_PER_PAGE,
        buildParams: () =>
            statusFilter !== 'all' ? { status: statusFilter } : undefined,
        mapResult: (event) => ({
            ...event,
            status: getEventDisplayStatus(event),
        }),
        dependencies: [statusFilter],
    });

    const filteredStatus =
        statusFilter === 'all'
            ? eventsWithStatus
            : eventsWithStatus.filter((e) => e.status === statusFilter);

    const eventsToDisplay = hasActiveSearch ? searchResults : filteredStatus;
    const baseSkeletonCount = SEARCH_RESULTS_PER_PAGE;
    const shouldShowSearchSkeleton = hasActiveSearch && searchLoading;

    const statusCounts = useEventStatusCounts<FilterValues, Event>({
        baseEvents: eventsWithStatus,
        searchResults,
        hasActiveSearch,
        statuses: STATUS_OPTIONS,
        statusResolver: (event) => event.status ?? getEventDisplayStatus(event),
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col gap-8 p-8">
                <Heading
                    title="Events"
                    description="Discover and join exciting campus events"
                />
                <Card className="p-6">
                    <div className="flex flex-row justify-between gap-4">
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
                                            All Events ({statusCounts.all})
                                        </TabsTrigger>
                                        {STATUS_OPTIONS.map((status) => (
                                            <TabsTrigger
                                                key={status}
                                                value={status}
                                                className="bg-gray-200"
                                            >
                                                {STATUS_LABEL_MAP[status]} (
                                                {statusCounts[status]})
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                </div>
                            </Tabs>
                        </div>
                        <div className="w-80">
                            <SearchInput
                                placeholder="Search by title, category, or location..."
                                value={searchQuery}
                                onChange={(event) =>
                                    setSearchQuery(event.target.value)
                                }
                            />
                            {searchError && (
                                <p className="text-sm text-red-500">
                                    {searchError}
                                </p>
                            )}
                        </div>
                    </div>
                </Card>

                {hasActiveSearch ? (
                    shouldShowSearchSkeleton ? (
                        <div className="grid grid-cols-3 gap-6">
                            {Array.from({ length: baseSkeletonCount }).map(
                                (_, index) => (
                                    <EventCardSkeleton key={index} />
                                ),
                            )}
                        </div>
                    ) : eventsToDisplay.length > 0 ? (
                        <>
                            <div className="grid grid-cols-3 gap-6">
                                {eventsToDisplay.map((event) => (
                                    <div
                                        key={event.id}
                                        className="flex flex-col gap-2"
                                    >
                                        <EventCard
                                            {...event}
                                            viewDetailsHref={
                                                user.event.show(event.id).url
                                            }
                                            className="hover:shadow-lg"
                                        />
                                    </div>
                                ))}
                            </div>
                            <Pagination
                                currentPage={searchMeta?.current_page ?? 1}
                                totalItems={searchMeta?.total ?? 0}
                                itemsPerPage={searchMeta?.per_page ?? SEARCH_RESULTS_PER_PAGE}
                                onPageChange={setSearchPage}
                                isLoading={searchLoading}
                            />
                        </>
                    ) : (
                        <Card className="p-12 text-center text-gray-500">
                            {`No events found for "${debouncedQuery}".`}
                        </Card>
                    )
                ) : filteredStatus.length > 0 ? (
                    <>
                        <div className="grid grid-cols-3 gap-6">
                            {filteredStatus.map((event) => (
                                <div
                                    key={event.id}
                                    className="flex flex-col gap-2"
                                >
                                    <EventCard
                                        {...event}
                                        viewDetailsHref={
                                            user.event.show(event.id).url
                                        }
                                        className="hover:shadow-lg"
                                    />
                                </div>
                            ))}
                        </div>

                        {events && events.last_page > 1 && (
                            <Pagination
                                currentPage={events.current_page}
                                totalItems={events.total}
                                itemsPerPage={events.per_page}
                                onPageChange={(page: number) => {
                                    const url = `${events.path}?page=${page}`;
                                    router.get(
                                        url,
                                        {},
                                        {
                                            preserveState: true,
                                            preserveScroll: true,
                                        },
                                    );
                                }}
                                isLoading={false}
                            />
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
