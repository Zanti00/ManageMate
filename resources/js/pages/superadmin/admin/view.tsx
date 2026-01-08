import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import superadmin from '@/routes/superadmin';
import { BreadcrumbItem } from '@/types';
import {
    Calendar,
    CircleCheckBig,
    CircleX,
    Clock,
    Mail,
    Phone,
} from 'lucide-react';

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

    const { delete: destroy } = useForm();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col gap-6 p-8">
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
                                {events.map((event) => (
                                    <Link
                                        href={superadmin.event.show(event.id)}
                                    >
                                        <div className="flex flex-col gap-6">
                                            <Card className="flex flex-row justify-between border-1 border-gray-200 px-4 shadow-none">
                                                <div className="flex flex-col gap-2">
                                                    <Label>{event.title}</Label>
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
                                ))}
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
