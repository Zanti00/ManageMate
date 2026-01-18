import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EventCard } from '@/components/ui/event-card';
import { EventCardSkeleton } from '@/components/ui/event-card-skeleton';
import { SearchInput } from '@/components/ui/search-input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEventStatusCounts } from '@/hooks/use-event-status-counts';
import { usePaginatedSearch } from '@/hooks/use-paginated-search';
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

    const renderSearchPagination = () => {
        if (!hasActiveSearch || !searchMeta || searchMeta.last_page <= 1) {
            return null;
        }

        const pages = [];
        const maxVisible = 5;

        let startPage = Math.max(
            1,
            searchMeta.current_page - Math.floor(maxVisible / 2),
        );
        let endPage = Math.min(
            searchMeta.last_page,
            startPage + maxVisible - 1,
        );

        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        for (let page = startPage; page <= endPage; page++) {
            pages.push(
                <Button
                    key={page}
                    variant={
                        page === searchMeta.current_page ? 'default' : 'outline'
                    }
                    size="sm"
                    onClick={() => setSearchPage(page)}
                    disabled={searchLoading}
                    className="min-w-[2.5rem]"
                >
                    {page}
                </Button>,
            );
        }

        return (
            <Card className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            setSearchPage((prev) => Math.max(1, prev - 1))
                        }
                        disabled={searchMeta.current_page <= 1 || searchLoading}
                    >
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Previous
                    </Button>
                    <div className="flex flex-wrap justify-center gap-1">
                        {pages}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            setSearchPage((prev) =>
                                Math.min(searchMeta.last_page, prev + 1),
                            )
                        }
                        disabled={
                            searchMeta.current_page >= searchMeta.last_page ||
                            searchLoading
                        }
                    >
                        Next
                        <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                </div>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Showing page {searchMeta.current_page} of{' '}
                    {searchMeta.last_page} (total {searchMeta.total} events)
                </p>
            </Card>
        );
    };

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
                            {renderSearchPagination()}
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
