import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import superadmin from '@/routes/superadmin';
import { BreadcrumbItem } from '@/types';
import { formatDate, formatDateRange } from '@/utils/date-format';
import { getEventStatus } from '@/utils/event-status';
import { formatPrice } from '@/utils/price-format';
import { Link, router } from '@inertiajs/react';
import { Check, Eye, X } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Event Page',
        href: superadmin.event.index().url,
    },
];

type EventStatus = 'Pending' | 'Active' | 'Rejected' | 'Closed' | 'Deleted';

type Event = {
    id: number;
    title: string;
    organization: string;
    location: string;
    price: number;
    start_date: string;
    end_date: string;
    registration_start_date: string;
    registration_end_date: string;
    created_at: string;
    updated_at?: string | null;
    is_deleted?: number;
    status: EventStatus;
};

interface Props {
    events?: Event[];
}

export default function SuperAdminEvent({ events = [] }: Props) {
    const eventsWithStatus = events.map((event) => {
        const isDeleted = Number(event.is_deleted) === 1;

        return {
            ...event,
            status: isDeleted ? 'Deleted' : getEventStatus(event),
        };
    });

    const [statusFilter, setStatusFilter] = useState<'all' | EventStatus>(
        'all',
    );

    const filteredEvents =
        statusFilter === 'all'
            ? eventsWithStatus
            : eventsWithStatus.filter((e) => e.status === statusFilter);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col gap-6 p-6">
                <Tabs
                    value={statusFilter}
                    onValueChange={(value) => setStatusFilter(value as any)}
                >
                    <div className="flex flex-row gap-48 rounded-2xl bg-white p-3 shadow-sm">
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
                            <TabsTrigger value="Deleted">
                                Deleted (
                                {
                                    eventsWithStatus.filter(
                                        (e) => e.status === 'Deleted',
                                    ).length
                                }
                                )
                            </TabsTrigger>
                        </TabsList>
                        <SearchInput></SearchInput>
                    </div>
                </Tabs>
                <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 h-[450px] overflow-x-auto bg-white">
                    <table className="w-full min-w-[1500px] table-fixed text-sm">
                        <thead className="bg-foreground/95">
                            <tr className="text-left text-background">
                                <th className="px-4 py-2 pl-4">EVENT</th>
                                <th className="px-4 py-2">ORGANIZATION</th>
                                <th className="px-4 py-2">EVENT DURATION</th>
                                <th className="px-4 py-2">
                                    REGISTRATION DURATION
                                </th>
                                <th className="px-4 py-2">LOCATION</th>
                                <th className="px-4 py-2">PRICE</th>
                                <th className="px-4 py-2">STATUS</th>
                                <th className="px-4 py-2">SUBMIT DATE</th>
                                <th className="py-2 pr-6 text-right">
                                    ACTIONS
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-card">
                            {filteredEvents.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={9}
                                        className="py-12 text-center text-gray-500"
                                    >
                                        No events found
                                    </td>
                                </tr>
                            ) : (
                                filteredEvents.map((event) => {
                                    const submitDate =
                                        event.updated_at || event.created_at;

                                    return (
                                        <tr
                                            key={event.id}
                                            className="hover:bg-gray-100"
                                        >
                                            <td className="truncate p-4 font-medium">
                                                {event.title}
                                            </td>
                                            <td className="p-4 font-medium">
                                                {event.organization}
                                            </td>
                                            <td className="p-4 font-medium">
                                                {formatDateRange(
                                                    event.start_date,
                                                    event.end_date,
                                                )}
                                            </td>
                                            <td className="p-4 font-medium">
                                                {formatDateRange(
                                                    event.registration_start_date,
                                                    event.registration_end_date,
                                                )}
                                            </td>
                                            <td className="truncate p-4 font-medium">
                                                {event.location}
                                            </td>
                                            <td className="p-4 font-medium">
                                                {formatPrice(event.price)}
                                            </td>
                                            <td className="items-start self-start p-4 font-medium">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs ${
                                                        event.status ===
                                                        'Pending'
                                                            ? 'bg-yellow-100 text-yellow-700'
                                                            : event.status ===
                                                                'Active'
                                                              ? 'bg-green-100 text-green-700'
                                                              : event.status ===
                                                                  'Rejected'
                                                                ? 'bg-red-100 text-red-700'
                                                                : 'bg-gray-100 text-gray-700'
                                                    }`}
                                                >
                                                    {event.status}
                                                </span>
                                            </td>
                                            <td className="p-4 font-medium">
                                                {formatDate(submitDate)}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-row gap-2">
                                                    <Button
                                                        onClick={() =>
                                                            router.patch(
                                                                `/superadmin/event/${event.id}/approve-event`,
                                                            )
                                                        }
                                                        className="bg-green-600"
                                                        disabled={
                                                            event.status ===
                                                            'Active'
                                                        }
                                                    >
                                                        <Check />
                                                    </Button>

                                                    <Button
                                                        onClick={() =>
                                                            router.patch(
                                                                `/superadmin/event/${event.id}/reject-event`,
                                                            )
                                                        }
                                                        className="bg-red-600"
                                                        disabled={
                                                            event.status ===
                                                            'Rejected'
                                                        }
                                                    >
                                                        <X />
                                                    </Button>
                                                    <Link
                                                        href={
                                                            superadmin.event.show(
                                                                event.id,
                                                            ).url
                                                        }
                                                    >
                                                        <Button>
                                                            <Eye />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
