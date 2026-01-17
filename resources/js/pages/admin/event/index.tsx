import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EventCard } from '@/components/ui/event-card';
import { EventCardSkeleton } from '@/components/ui/event-card-skeleton';
import { SearchInput } from '@/components/ui/search-input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEventStatusCounts } from '@/hooks/use-event-status-counts';
import { usePaginatedSearch } from '@/hooks/use-paginated-search';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import { type BreadcrumbItem } from '@/types';
import { getEventStatus } from '@/utils/event-status';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { JSX, useEffect, useState } from 'react';

const { create } = admin.event;

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Event',
        href: admin.event.index().url,
    },
];

const SEARCH_RESULTS_PER_PAGE = 6;

const STATUS_OPTIONS = ['Pending', 'Active', 'Rejected', 'Closed'] as const;

type FilterValues = (typeof STATUS_OPTIONS)[number];

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
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

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
        endpoint: admin.event.search().url,
        perPage: SEARCH_RESULTS_PER_PAGE,
        buildParams: () =>
            statusFilter !== 'all' ? { status: statusFilter } : undefined,
        mapResult: (event) => ({
            ...event,
            status: getEventStatus(event),
        }),
        dependencies: [statusFilter],
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter]);

    const filteredStatus =
        statusFilter === 'all'
            ? eventsWithStatus
            : eventsWithStatus.filter((e) => e.status === statusFilter);

    const totalBasePages = Math.max(
        1,
        Math.ceil(filteredStatus.length / SEARCH_RESULTS_PER_PAGE),
    );

    const paginatedBaseEvents = filteredStatus.slice(
        (currentPage - 1) * SEARCH_RESULTS_PER_PAGE,
        currentPage * SEARCH_RESULTS_PER_PAGE,
    );

    const eventsToDisplay = hasActiveSearch
        ? searchResults
        : paginatedBaseEvents;

    const baseSkeletonCount = SEARCH_RESULTS_PER_PAGE;
    const skeletonCount = hasActiveSearch
        ? SEARCH_RESULTS_PER_PAGE
        : baseSkeletonCount;
    const shouldShowSkeleton = hasActiveSearch
        ? searchLoading
        : isLoading || events === undefined;

    const statusCounts = useEventStatusCounts<FilterValues, Event>({
        baseEvents: eventsWithStatus,
        searchResults,
        hasActiveSearch,
        statuses: STATUS_OPTIONS,
        statusResolver: (event) => event.status ?? getEventStatus(event),
    });

    const renderSearchPagination = () => {
        if (!hasActiveSearch || !searchMeta || searchMeta.last_page <= 1) {
            return null;
        }

        const pages: JSX.Element[] = [];
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

    const renderBasePagination = () => {
        if (hasActiveSearch || totalBasePages <= 1) {
            return null;
        }

        const pages: JSX.Element[] = [];
        const maxVisible = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalBasePages, startPage + maxVisible - 1);

        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        for (let page = startPage; page <= endPage; page++) {
            pages.push(
                <Button
                    key={page}
                    variant={page === currentPage ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="min-w-[2.5rem]"
                >
                    {page}
                </Button>,
            );
        }

        const from = (currentPage - 1) * SEARCH_RESULTS_PER_PAGE + 1;
        const to = Math.min(
            filteredStatus.length,
            currentPage * SEARCH_RESULTS_PER_PAGE,
        );

        return (
            <Card className="p-4">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        Showing {from} to {to} of {filteredStatus.length} events
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                setCurrentPage((prev) => Math.max(1, prev - 1))
                            }
                            disabled={currentPage <= 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Button>
                        <div className="flex gap-1">{pages}</div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    Math.min(totalBasePages, prev + 1),
                                )
                            }
                            disabled={currentPage >= totalBasePages}
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </Card>
        );
    };

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
                                All ({statusCounts.all})
                            </TabsTrigger>

                            <TabsTrigger value="Pending">
                                Pending ({statusCounts.Pending})
                            </TabsTrigger>

                            <TabsTrigger value="Active">
                                Active ({statusCounts.Active})
                            </TabsTrigger>
                            <TabsTrigger value="Rejected">
                                Rejected ({statusCounts.Rejected})
                            </TabsTrigger>
                            <TabsTrigger value="Closed">
                                Closed ({statusCounts.Closed})
                            </TabsTrigger>
                        </TabsList>
                        <div className="flex w-80 flex-col gap-1">
                            <SearchInput
                                placeholder="Search events by title, location, or description..."
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
                </Tabs>
                {shouldShowSkeleton ? (
                    <div className="grid grid-cols-3 gap-6">
                        {Array.from({ length: skeletonCount }).map((_, i) => (
                            <EventCardSkeleton key={i} />
                        ))}
                    </div>
                ) : eventsToDisplay.length > 0 ? (
                    <>
                        <div className="grid grid-cols-3 gap-6">
                            {eventsToDisplay.map((event) => (
                                <EventCard key={event.id} {...event} />
                            ))}
                        </div>
                        {hasActiveSearch
                            ? renderSearchPagination()
                            : renderBasePagination()}
                    </>
                ) : (
                    <div className="rounded-2xl bg-white p-12 text-center text-gray-500 shadow-sm">
                        {hasActiveSearch && debouncedQuery
                            ? `No events found for "${debouncedQuery}".`
                            : 'No events found.'}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
