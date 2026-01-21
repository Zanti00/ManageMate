import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Pagination from '@/components/ui/pagination';
import { SearchInput } from '@/components/ui/search-input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEventStatusCounts } from '@/hooks/use-event-status-counts';
import { usePaginatedSearch } from '@/hooks/use-paginated-search';
import AppLayout from '@/layouts/app-layout';
import superadmin from '@/routes/superadmin';
import { BreadcrumbItem } from '@/types';
import { formatDate, formatDateRange } from '@/utils/date-format';
import { formatPrice } from '@/utils/price-format';
import { Link, router } from '@inertiajs/react';
import { Ellipsis } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Event Page',
        href: superadmin.event.index().url,
    },
];

const SEARCH_RESULTS_PER_PAGE = 10;

const STATUS_OPTIONS = [
    'pending',
    'active',
    'rejected',
    'closed',
    'deleted',
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
    const [statusFilter, setStatusFilter] = useState<'all' | EventStatus>(
        'all',
    );
    const [currentPage, setCurrentPage] = useState(1);

    const handleApprove = (eventId: number) => {
        router.patch(superadmin.event.approve(eventId).url);
    };

    const handleReject = (eventId: number) => {
        if (!confirm('Are you sure you want to reject this event?')) {
            return;
        }
        router.patch(superadmin.event.reject(eventId).url);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter]);

    // Use events directly, status is always lowercase from DB
    const filteredEvents =
        statusFilter === 'all'
            ? events
            : events.filter((event) => event.status === statusFilter);

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
    } = usePaginatedSearch<Event, Event>({
        endpoint: superadmin.event.search().url,
        perPage: SEARCH_RESULTS_PER_PAGE,
        buildParams: () =>
            statusFilter !== 'all' ? { status: statusFilter } : undefined,
        mapResult: (event) => event,
        dependencies: [statusFilter],
    });

    // Events to display (search or filtered)
    const eventsToDisplay = hasActiveSearch
        ? searchResults
        : filteredEvents.slice(
              (currentPage - 1) * SEARCH_RESULTS_PER_PAGE,
              currentPage * SEARCH_RESULTS_PER_PAGE,
          );

    // Get status counts
    const statusCounts = useEventStatusCounts<EventStatus, Event>({
        baseEvents: events,
        searchResults,
        hasActiveSearch,
        statuses: STATUS_OPTIONS,
        statusResolver: (event) => event.status,
    });

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
        return (
            <Pagination
                currentPage={searchMeta.current_page}
                totalItems={searchMeta.total}
                itemsPerPage={SEARCH_RESULTS_PER_PAGE}
                onPageChange={setSearchPage}
                isLoading={searchLoading}
            />
        );
    };

    const renderBasePagination = () => {
        if (hasActiveSearch) {
            return null;
        }
        return (
            <Pagination
                currentPage={currentPage}
                totalItems={filteredEvents.length}
                itemsPerPage={SEARCH_RESULTS_PER_PAGE}
                onPageChange={setCurrentPage}
            />
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
                                        event.status === 'pending'
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : event.status === 'active'
                                              ? 'bg-green-100 text-green-700'
                                              : event.status === 'rejected'
                                                ? 'bg-red-100 text-red-700'
                                                : event.status === 'deleted'
                                                  ? 'bg-gray-300 text-gray-700'
                                                  : event.status === 'closed'
                                                    ? 'bg-gray-400 text-gray-800'
                                                    : 'bg-gray-100 text-gray-700';

                                    return (
                                        <tr
                                            key={event.id}
                                            className="text-primary-foreground hover:bg-gray-100"
                                        >
                                            <td
                                                className="truncate px-4 py-4 font-medium"
                                                title={event.title}
                                            >
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
                                            <td
                                                className="truncate px-4 py-4"
                                                title={event.location}
                                            >
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
                                                                    'active' ||
                                                                event.status ===
                                                                    'deleted' ||
                                                                event.status ===
                                                                    'closed'
                                                            }
                                                            onSelect={(e) => {
                                                                e.preventDefault();
                                                                if (
                                                                    event.status !==
                                                                        'active' &&
                                                                    event.status !==
                                                                        'deleted' &&
                                                                    event.status !==
                                                                        'closed'
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
                                                                    'rejected' ||
                                                                event.status ===
                                                                    'deleted' ||
                                                                event.status ===
                                                                    'closed'
                                                            }
                                                            onSelect={(e) => {
                                                                e.preventDefault();
                                                                if (
                                                                    event.status !==
                                                                        'rejected' &&
                                                                    event.status !==
                                                                        'deleted' &&
                                                                    event.status !==
                                                                        'closed'
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
