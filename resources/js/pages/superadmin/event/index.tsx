import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SearchInput } from '@/components/ui/search-input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEventStatusCounts } from '@/hooks/use-event-status-counts';
import { usePaginatedSearch } from '@/hooks/use-paginated-search';
import AppLayout from '@/layouts/app-layout';
import superadmin from '@/routes/superadmin';
import { BreadcrumbItem } from '@/types';
import { formatDate, formatDateRange } from '@/utils/date-format';
import { getEventStatus } from '@/utils/event-status';
import { formatPrice } from '@/utils/price-format';
import { Link, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Ellipsis } from 'lucide-react';
import { JSX, useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Event Page',
        href: superadmin.event.index().url,
    },
];

const SEARCH_RESULTS_PER_PAGE = 10;

const STATUS_OPTIONS = [
    'Pending',
    'Active',
    'Rejected',
    'Closed',
    'Deleted',
] as const;

type TableHeader = {
    key: string;
    label: string;
    widthClass: string;
    align: 'text-left' | 'text-center' | 'text-right';
    extraClass?: string;
};

const TABLE_HEADERS: TableHeader[] = [
    { key: 'event', label: 'Event', widthClass: 'w-[22%]', align: 'text-left' },
    {
        key: 'eventDuration',
        label: 'Event Duration',
        widthClass: 'w-[15%]',
        align: 'text-left',
    },
    {
        key: 'registrationDuration',
        label: 'Registration Duration',
        widthClass: 'w-[18%]',
        align: 'text-left',
    },
    {
        key: 'location',
        label: 'Location',
        widthClass: 'w-[13%]',
        align: 'text-left',
    },
    { key: 'price', label: 'Price', widthClass: 'w-[8%]', align: 'text-left' },
    {
        key: 'status',
        label: 'Status',
        widthClass: 'w-[10%]',
        align: 'text-center',
    },
    {
        key: 'submitDate',
        label: 'Submit Date',
        widthClass: 'w-[11%]',
        align: 'text-left',
    },
    {
        key: 'actions',
        label: 'Actions',
        widthClass: 'w-[8%]',
        align: 'text-right',
    },
];

type EventStatus = (typeof STATUS_OPTIONS)[number];

type Event = {
    id: number;
    title: string;
    location: string;
    price: number;
    start_date: string;
    end_date: string;
    registration_start_date: string;
    registration_end_date: string;
    created_at: string;
    updated_at?: string | null;
    is_deleted?: number | string | boolean;
    status?: EventStatus;
};

type EventWithStatus = Event & { status: EventStatus };

interface Props {
    events?: Event[];
}

export default function SuperAdminEvent({ events = [] }: Props) {
    const eventsWithStatus: EventWithStatus[] = events.map((event) => {
        const isDeleted = Number(event.is_deleted) === 1;

        return {
            ...event,
            status: isDeleted ? 'Deleted' : getEventStatus(event),
        };
    });

    const [statusFilter, setStatusFilter] = useState<'all' | EventStatus>(
        'all',
    );
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter]);

    const filteredEvents =
        statusFilter === 'all'
            ? eventsWithStatus
            : eventsWithStatus.filter((e) => e.status === statusFilter);

    const totalBasePages = Math.max(
        1,
        Math.ceil(filteredEvents.length / SEARCH_RESULTS_PER_PAGE),
    );

    const paginatedEvents = filteredEvents.slice(
        (currentPage - 1) * SEARCH_RESULTS_PER_PAGE,
        currentPage * SEARCH_RESULTS_PER_PAGE,
    );

    const {
        searchQuery,
        setSearchQuery,
        debouncedQuery,
        results: searchResults,
        meta: searchMeta,
        setPage: setSearchPage,
        isLoading: searchLoading,
        error: searchError,
        hasActiveSearch,
    } = usePaginatedSearch<Event, EventWithStatus>({
        endpoint: superadmin.event.search().url,
        perPage: SEARCH_RESULTS_PER_PAGE,
        buildParams: () =>
            statusFilter !== 'all' ? { status: statusFilter } : undefined,
        mapResult: (event) => {
            const isDeleted = Number(event.is_deleted) === 1;

            return {
                ...event,
                status: isDeleted ? 'Deleted' : getEventStatus(event),
            };
        },
        dependencies: [statusFilter],
    });

    const eventsToDisplay = hasActiveSearch ? searchResults : paginatedEvents;

    const statusCounts = useEventStatusCounts<EventStatus, EventWithStatus>({
        baseEvents: eventsWithStatus,
        searchResults,
        hasActiveSearch,
        statuses: STATUS_OPTIONS,
        statusResolver: (event) => event.status,
    });

    const handleApprove = (eventId: number) => {
        router.patch(superadmin.event.approve(eventId).url);
    };

    const handleReject = (eventId: number) => {
        if (!confirm('Are you sure you want to reject this event?')) {
            return;
        }

        router.patch(superadmin.event.reject(eventId).url);
    };

    const renderSearchPagination = () => {
        if (!hasActiveSearch) {
            return null;
        }

        if (!searchMeta) {
            return (
                <Card className="p-4">
                    <p className="text-center text-sm text-gray-600">
                        Loading pagination...
                    </p>
                </Card>
            );
        }

        const pages: JSX.Element[] = [];
        const maxVisible = 5;
        const totalPages = Math.max(1, searchMeta.last_page);
        let startPage = Math.max(
            1,
            searchMeta.current_page - Math.floor(maxVisible / 2),
        );
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

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
                                Math.min(totalPages, prev + 1),
                            )
                        }
                        disabled={
                            searchMeta.current_page >= totalPages ||
                            searchLoading
                        }
                    >
                        Next
                        <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                </div>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Showing page {Math.min(searchMeta.current_page, totalPages)}{' '}
                    of {totalPages} (total {searchMeta.total} events)
                </p>
            </Card>
        );
    };

    const renderBasePagination = () => {
        if (hasActiveSearch) {
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

        const from =
            filteredEvents.length === 0
                ? 0
                : (currentPage - 1) * SEARCH_RESULTS_PER_PAGE + 1;
        const to = Math.min(
            filteredEvents.length,
            currentPage * SEARCH_RESULTS_PER_PAGE,
        );

        return (
            <Card className="p-4">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        Showing {from} to {to} of {filteredEvents.length} events
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

    const emptyMessage =
        hasActiveSearch && debouncedQuery
            ? `No events found for "${debouncedQuery}".`
            : 'No events found';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col gap-6 p-6">
                <Heading
                    title="Events"
                    description="Review and manage all events across organizations"
                />
                <Tabs
                    value={statusFilter}
                    onValueChange={(value) => setStatusFilter(value as any)}
                >
                    <div className="flex flex-row gap-48 rounded-2xl bg-white p-3 shadow-sm">
                        <TabsList className="h-10 gap-3">
                            <TabsTrigger value="all">
                                All ({statusCounts.all})
                            </TabsTrigger>
                            {STATUS_OPTIONS.map((status) => (
                                <TabsTrigger key={status} value={status}>
                                    {status} ({statusCounts[status]})
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        <div className="flex w-80 flex-col gap-1">
                            <SearchInput
                                placeholder="Search events"
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
                <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 h-[450px] overflow-x-auto bg-white">
                    <table className="w-full table-fixed text-sm">
                        <colgroup>
                            {TABLE_HEADERS.map((header) => (
                                <col
                                    key={`col-${header.key}`}
                                    className={header.widthClass}
                                />
                            ))}
                        </colgroup>
                        <thead className="bg-foreground/95 text-xs font-semibold tracking-wide text-background uppercase">
                            <tr>
                                {TABLE_HEADERS.map((header) => (
                                    <th
                                        key={header.key}
                                        className={`px-4 py-3 whitespace-nowrap ${header.align} ${header.extraClass ?? ''}`}
                                    >
                                        {header.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="bg-card">
                            {hasActiveSearch && searchLoading ? (
                                <tr>
                                    <td
                                        colSpan={TABLE_HEADERS.length}
                                        className="py-12 text-center text-gray-500"
                                    >
                                        Searching events...
                                    </td>
                                </tr>
                            ) : eventsToDisplay.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={TABLE_HEADERS.length}
                                        className="py-12 text-center text-gray-500"
                                    >
                                        {emptyMessage}
                                    </td>
                                </tr>
                            ) : (
                                eventsToDisplay.map((event) => {
                                    const submitDate =
                                        event.updated_at || event.created_at;
                                    const badgeClass =
                                        event.status === 'Pending'
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : event.status === 'Active'
                                              ? 'bg-green-100 text-green-700'
                                              : event.status === 'Rejected'
                                                ? 'bg-red-100 text-red-700'
                                                : event.status === 'Deleted'
                                                  ? 'bg-gray-300 text-gray-700'
                                                  : 'bg-gray-100 text-gray-700';

                                    return (
                                        <tr
                                            key={event.id}
                                            className="text-primary-foreground hover:bg-gray-100"
                                        >
                                            <td className="truncate px-4 py-4 font-medium">
                                                {event.title}
                                            </td>
                                            <td className="px-4 py-4">
                                                {formatDateRange(
                                                    event.start_date,
                                                    event.end_date,
                                                )}
                                            </td>
                                            <td className="px-4 py-4">
                                                {formatDateRange(
                                                    event.registration_start_date,
                                                    event.registration_end_date,
                                                )}
                                            </td>
                                            <td className="truncate px-4 py-4">
                                                {event.location}
                                            </td>
                                            <td className="px-4 py-4">
                                                {formatPrice(event.price)}
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span
                                                    className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs ${badgeClass}`}
                                                >
                                                    {event.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 font-medium">
                                                {formatDate(submitDate)}
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-9 w-9"
                                                        >
                                                            <Ellipsis className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent
                                                        align="end"
                                                        className="w-32"
                                                    >
                                                        <DropdownMenuItem
                                                            asChild
                                                        >
                                                            <Link
                                                                href={
                                                                    superadmin.event.show(
                                                                        event.id,
                                                                    ).url
                                                                }
                                                                className="w-full"
                                                            >
                                                                View
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            disabled={
                                                                event.status ===
                                                                    'Active' ||
                                                                event.status ===
                                                                    'Deleted'
                                                            }
                                                            onSelect={(e) => {
                                                                e.preventDefault();
                                                                if (
                                                                    event.status !==
                                                                        'Active' &&
                                                                    event.status !==
                                                                        'Deleted'
                                                                ) {
                                                                    handleApprove(
                                                                        event.id,
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            Approve
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-red-600 focus:text-red-600"
                                                            disabled={
                                                                event.status ===
                                                                    'Rejected' ||
                                                                event.status ===
                                                                    'Deleted'
                                                            }
                                                            onSelect={(e) => {
                                                                e.preventDefault();
                                                                if (
                                                                    event.status !==
                                                                        'Rejected' &&
                                                                    event.status !==
                                                                        'Deleted'
                                                                ) {
                                                                    handleReject(
                                                                        event.id,
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            Reject
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
                {hasActiveSearch
                    ? renderSearchPagination()
                    : renderBasePagination()}
            </div>
        </AppLayout>
    );
}
