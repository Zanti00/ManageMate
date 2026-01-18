import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import superadmin from '@/routes/superadmin';
import { BreadcrumbItem } from '@/types';
import {
    ArrowLeft,
    Calendar,
    CircleCheckBig,
    CircleX,
    Clock,
    Mail,
    Phone,
} from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { SummaryCard } from '@/components/ui/summary-card';
import { formatDateRange } from '@/utils/date-format';
import { Link, router, useForm } from '@inertiajs/react';
import {
    ArcElement,
    BarElement,
    CategoryScale,
    ChartData,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
);

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Edit Admin',
        href: superadmin.admin.edit.url(1), // add the real id later
    },
];

type Admin = {
    id: number;
    first_name: string;
    middle_name?: string;
    last_name: string;
    email: string;
    phone_number: string;
    created_at: string;
    organization_id: string;
    is_deleted: string;
    totalEvent?: number;
    activeEvent?: number;
    pendingEvent?: number;
    attendees?: number;
};

type MonthlyPerformanceData = {
    month_number: number;
    month_name: string;
    total_attendees: number;
    total_events: number;
};

type Event = {
    id: number;
    title: string;
    start_date: string;
    end_date: string;
    status: string;
};

interface Props {
    admin: Admin;
    total_events: string;
    pending_events: string;
    active_events: string;
    rejected_events: string;
    closed_events: string;
    monthly_performance_data: MonthlyPerformanceData[];
    events: Event[];
}

export default function ViewAdmin({
    admin,
    total_events,
    pending_events,
    active_events,
    rejected_events,
    closed_events,
    monthly_performance_data = [],
    events = [],
}: Props) {
    // Event status filter state and logic
    const STATUS_OPTIONS = ['pending', 'active', 'rejected', 'closed'] as const;
    type FilterValues = (typeof STATUS_OPTIONS)[number];
    const STATUS_LABEL_MAP: Record<FilterValues, string> = {
        pending: 'Pending',
        active: 'Active',
        rejected: 'Rejected',
        closed: 'Closed',
    };
    const [statusFilter, setStatusFilter] = React.useState<
        'all' | FilterValues
    >('all');

    // Add status property to events for filtering
    const eventsWithStatus = events.map((event) => ({ ...event }));
    const filteredEvents =
        statusFilter === 'all'
            ? eventsWithStatus
            : eventsWithStatus.filter((e) => e.status === statusFilter);

    // Pagination state for events tab
    const [eventPage, setEventPage] = React.useState(1);
    const pageSize = 5;
    const totalEvents = filteredEvents.length;
    const totalEventPages = Math.ceil(totalEvents / pageSize);
    const paginatedEvents = filteredEvents.slice(
        (eventPage - 1) * pageSize,
        eventPage * pageSize,
    );

    // Calculate range info for display
    const from = totalEvents === 0 ? 0 : (eventPage - 1) * pageSize + 1;
    const to = Math.min(eventPage * pageSize, totalEvents);

    // Status counts for filter tabs
    const getStatusCounts = () => {
        const counts: Record<'all' | FilterValues, number> = {
            all: eventsWithStatus.length,
            pending: 0,
            active: 0,
            rejected: 0,
            closed: 0,
        };
        eventsWithStatus.forEach((event) => {
            if (
                event.status &&
                ['pending', 'active', 'rejected', 'closed'].includes(
                    event.status,
                )
            ) {
                counts[event.status as FilterValues] += 1;
            }
        });
        return counts;
    };
    const statusCounts = getStatusCounts();

    // Render pagination bar similar to user/event/index
    const renderPagination = () => {
        if (totalEventPages <= 1) return null;
        const pages = [];
        const maxVisible = 5;
        let startPage = Math.max(1, eventPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalEventPages, startPage + maxVisible - 1);
        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }
        for (let page = startPage; page <= endPage; page++) {
            pages.push(
                <Button
                    key={page}
                    variant={page === eventPage ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setEventPage(page)}
                    className="min-w-[2.5rem]"
                >
                    {page}
                </Button>,
            );
        }
        return (
            <div className="flex w-full items-end justify-end gap-2 py-4">
                <span className="text-sm whitespace-nowrap text-gray-600">
                    Showing {to} of {totalEvents}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEventPage(Math.max(1, eventPage - 1))}
                    disabled={eventPage <= 1}
                >
                    &#60; Previous
                </Button>
                <div className="flex gap-1">{pages}</div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        setEventPage(Math.min(totalEventPages, eventPage + 1))
                    }
                    disabled={eventPage >= totalEventPages}
                >
                    Next &#62;
                </Button>
            </div>
        );
    };

    // Move useForm above conditional return
    const { delete: destroy } = useForm();

    if (!admin) {
        return <div className="p-6">User not found</div>;
    }

    const createdAt = admin?.created_at
        ? new Date(admin.created_at).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
          })
        : 'N/A';

    const monthlyPerformanceData: ChartData<'line'> = {
        labels: monthly_performance_data.map((item) => item.month_name),
        datasets: [
            {
                label: 'Attendees',
                data: monthly_performance_data.map(
                    (item) => item.total_attendees,
                ),
                backgroundColor: ['pink'],
                borderColor: ['pink'],
                pointBackgroundColor: ['pink'],
                tension: 0.4,
            },
            {
                label: 'Events',
                data: monthly_performance_data.map((item) => item.total_events),
                backgroundColor: ['rgb(255, 205, 86)'],
                borderColor: ['rgb(255, 205, 86)'],
                pointBackgroundColor: ['rgb(255, 205, 86)'],
                tension: 0.4,
            },
        ],
    };

    const eventCategoriesData: ChartData<'doughnut'> = {
        labels: ['Pending', 'Active', 'Rejected', 'Closed'],
        datasets: [
            {
                label: 'Event Status Overview',
                data: [
                    Number(pending_events),
                    Number(active_events),
                    Number(rejected_events),
                    Number(closed_events),
                ],
                backgroundColor: [
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 75)',
                    'rgb(255, 99, 132)',
                    'gray',
                ],
            },
        ],
    };

    // Removed duplicate useForm declaration

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col gap-6 p-8">
                <div className="mb-2">
                    <Button
                        variant="ghost"
                        className="flex cursor-pointer items-center gap-2 hover:bg-transparent hover:font-bold hover:text-foreground"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft />
                        Back
                    </Button>
                </div>
                <Card className="flex flex-row p-6">
                    <div className="flex w-full flex-row gap-6">
                        <div className="flex flex-col items-center justify-center">
                            <img
                                src="https://lh3.googleusercontent.com/BKN1q6592B6RRjUCzycpYLMsRXezlbNW7lbJ3Y1xDUuzdJ_D9tbhr9GHk2_STmHBcIZYu4mNpu1cGgTU=w544-h544-l90-rj"
                                alt="Profile"
                                className="h-20 w-20 rounded-full border-white bg-gray-200"
                            />
                        </div>
                        <div className="flex flex-2 flex-col justify-center gap-2">
                            <CardTitle>{admin.first_name}</CardTitle>
                            <div className="flex flex-row items-center gap-2">
                                <Mail size={12}></Mail>
                                <CardDescription>{admin.email}</CardDescription>
                                <Phone size={12}></Phone>
                                <CardDescription>
                                    {admin.phone_number ?? 'N/A'}
                                </CardDescription>
                            </div>
                            <div className="flex flex-row gap-2">
                                {admin.is_deleted === '0' ? (
                                    <Badge variant="active">Active</Badge>
                                ) : (
                                    <Badge variant="rejected">Inactive</Badge>
                                )}
                                <CardDescription>
                                    Joined {createdAt}
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex flex-row gap-2">
                            <Link href={superadmin.admin.edit.url(admin.id)}>
                                <Button className="bg-gray-100 text-black">
                                    Edit
                                </Button>
                            </Link>
                            {admin.is_deleted === '0' ? (
                                <Button
                                    onClick={() => {
                                        if (confirm('Are you sure?'))
                                            destroy(
                                                superadmin.admin.destroy.url(
                                                    admin.id,
                                                ),
                                            );
                                    }}
                                    className="bg-red-50 text-red-600"
                                >
                                    Deactivate
                                </Button>
                            ) : (
                                <Button
                                    className="bg-green-50 text-green-600"
                                    onClick={() =>
                                        router.patch(
                                            `/superadmin/admin/${admin.id}/restore`,
                                        )
                                    }
                                >
                                    Activate
                                </Button>
                            )}
                        </div>
                    </div>
                </Card>
                <div className="bg bg bg grid grid-cols-4 gap-6">
                    <SummaryCard
                        value={total_events}
                        label={'Total Events'}
                        icon={Calendar}
                        iconBg="bg-gradient-to-br from-teal-400 to-teal-600"
                    ></SummaryCard>
                    <SummaryCard
                        value={active_events}
                        label={'Active Events'}
                        icon={CircleCheckBig}
                        iconBg="bg-gradient-to-br from-lime-400 to-lime-600"
                    ></SummaryCard>
                    <SummaryCard
                        value={pending_events}
                        label={'Pending Approval'}
                        icon={Clock}
                        iconBg="bg-gradient-to-br from-amber-400 to-amber-600"
                    ></SummaryCard>
                    <SummaryCard
                        value={rejected_events}
                        label={'Rejected Events'}
                        icon={CircleX}
                        iconBg="bg-gradient-to-br from-rose-400 to-rose-600"
                    ></SummaryCard>
                </div>
                <Tabs defaultValue="overview">
                    <Card className="p-6">
                        <TabsList className="h-10 gap-3">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="events">Events</TabsTrigger>
                            <TabsTrigger value="activity">Activity</TabsTrigger>
                        </TabsList>
                        <TabsContent className="bg-white" value="overview">
                            <div className="grid grid-cols-2 gap-4">
                                <Card className="col-span-1 flex flex-col shadow-none">
                                    <Label>Monthly Performance</Label>
                                    <Line data={monthlyPerformanceData}></Line>
                                </Card>
                                <Card className="col-span-1 flex flex-col shadow-none">
                                    <Label>Event Categories</Label>
                                    <div className="flex h-[90%] flex-col items-center">
                                        <Doughnut
                                            data={eventCategoriesData}
                                        ></Doughnut>
                                    </div>
                                </Card>
                            </div>
                        </TabsContent>
                        <TabsContent value="events">
                            <div className="flex flex-col gap-2">
                                <Label>Recent Events</Label>
                                <div className="flex flex-row items-end justify-end">
                                    <Tabs
                                        value={statusFilter}
                                        onValueChange={(value) => {
                                            setStatusFilter(value as any);
                                            setEventPage(1);
                                        }}
                                    >
                                        <div className="flex flex-row">
                                            <TabsList className="h-10 gap-2 bg-transparent p-0">
                                                <TabsTrigger
                                                    value="all"
                                                    className="bg-gray-200"
                                                >
                                                    All Events (
                                                    {statusCounts.all})
                                                </TabsTrigger>
                                                {STATUS_OPTIONS.map(
                                                    (status) => (
                                                        <TabsTrigger
                                                            key={status}
                                                            value={status}
                                                            className="bg-gray-200"
                                                        >
                                                            {
                                                                STATUS_LABEL_MAP[
                                                                    status
                                                                ]
                                                            }{' '}
                                                            (
                                                            {
                                                                statusCounts[
                                                                    status
                                                                ]
                                                            }
                                                            )
                                                        </TabsTrigger>
                                                    ),
                                                )}
                                            </TabsList>
                                        </div>
                                    </Tabs>
                                </div>
                                {paginatedEvents.length > 0 ? (
                                    paginatedEvents.map((event) => (
                                        <Link
                                            href={superadmin.event.show(
                                                event.id,
                                            )}
                                            key={event.id}
                                        >
                                            <div className="flex flex-col gap-6">
                                                <Card className="flex flex-row justify-between border-1 border-gray-200 px-4 shadow-none">
                                                    <div className="flex flex-col gap-2">
                                                        <Label>
                                                            {event.title}
                                                        </Label>
                                                        <Label>
                                                            {formatDateRange(
                                                                event.start_date,
                                                                event.end_date,
                                                            )}
                                                        </Label>
                                                    </div>
                                                    {event.status && (
                                                        <div>
                                                            {event.status ===
                                                                'pending' && (
                                                                <Badge variant="pending">
                                                                    Pending
                                                                </Badge>
                                                            )}
                                                            {event.status ===
                                                                'active' && (
                                                                <Badge variant="active">
                                                                    Active
                                                                </Badge>
                                                            )}
                                                            {event.status ===
                                                                'rejected' && (
                                                                <Badge variant="rejected">
                                                                    Rejected
                                                                </Badge>
                                                            )}
                                                            {event.status ===
                                                                'closed' && (
                                                                <Badge variant="closed">
                                                                    Closed
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    )}
                                                </Card>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <Card className="p-12 text-center text-gray-500">
                                        No events found
                                    </Card>
                                )}
                                {renderPagination()}
                            </div>
                        </TabsContent>

                        <TabsContent value="activity">
                            <div className="flex flex-col gap-6">
                                <Label>Activity Log</Label>
                                <Card className="flex flex-row border-1 border-gray-200 px-4 shadow-none">
                                    <img
                                        src="https://lh3.googleusercontent.com/BKN1q6592B6RRjUCzycpYLMsRXezlbNW7lbJ3Y1xDUuzdJ_D9tbhr9GHk2_STmHBcIZYu4mNpu1cGgTU=w544-h544-l90-rj"
                                        alt="Profile"
                                        className="h-12 w-12 rounded-full border-white bg-gray-200"
                                    />
                                    <div className="flex flex-col gap-2">
                                        <Label>Created New Event</Label>
                                        <Label>
                                            Tech Innovation Summit 2024
                                        </Label>
                                        <Label>2 hours ago</Label>
                                    </div>
                                </Card>
                            </div>
                        </TabsContent>
                    </Card>
                </Tabs>
            </div>
        </AppLayout>
    );
}
