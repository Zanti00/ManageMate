import Heading from '@/components/heading';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { SummaryCard } from '@/components/ui/summary-card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import superadmin from '@/routes/superadmin';
import { type BreadcrumbItem } from '@/types';
import { Link } from '@inertiajs/react';
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
import { Building2, CalendarDays, Clock, User } from 'lucide-react';
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
        title: 'Dashboard',
        href: dashboard.url(),
    },
];

type PlatformGrowthData = {
    month_number: number;
    month_name: string;
    total_admins: number;
    total_events: number;
};

type TopOrganization = {
    id?: number;
    name: string;
    total_events?: number;
    total_attendees?: number;
};

type TopEvent = {
    id: number;
    title: string;
    organization_name?: string;
    attendee_count?: number;
};

interface Props {
    total_organizations: string;
    active_admins: string;
    pending_events: string;
    active_events: string;
    pending_events_status: number;
    active_events_status: number;
    rejected_events_status: number;
    closed_events_status: number;
    platform_growth_data: PlatformGrowthData[];
    top_performing_organizations?: TopOrganization[];
    top_performing_events?: TopEvent[];
}

export default function SuperAdminDashboard({
    total_organizations,
    active_admins,
    pending_events,
    active_events,
    pending_events_status,
    active_events_status,
    rejected_events_status,
    closed_events_status,
    platform_growth_data = [],
    top_performing_organizations = [],
    top_performing_events = [],
}: Props) {
    const eventStatusOverviewData: ChartData<'doughnut'> = {
        labels: ['Pending', 'Active', 'Rejected', 'Closed'],
        datasets: [
            {
                label: 'Event Status Overview',
                data: [
                    pending_events_status,
                    active_events_status,
                    rejected_events_status,
                    closed_events_status,
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

    const platformGrowthTrendData: ChartData<'line'> = {
        labels: platform_growth_data.map((item) => item.month_name),
        datasets: [
            {
                label: 'Admins',
                data: platform_growth_data.map((item) => item.total_admins),
                backgroundColor: ['pink'],
                borderColor: ['pink'],
                pointBackgroundColor: ['pink'],
                tension: 0.4,
            },
            {
                label: 'Events',
                data: platform_growth_data.map((item) => item.total_events),
                backgroundColor: ['rgb(255, 205, 86)'],
                borderColor: ['rgb(255, 205, 86)'],
                pointBackgroundColor: ['rgb(255, 205, 86)'],
                tension: 0.4,
            },
        ],
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col gap-8 p-6">
                <Heading
                    title="Dashboard Overview"
                    description="Monitor all organizations, admins, and events across the platform"
                />
                <div className="grid grid-cols-4 gap-4">
                    <SummaryCard
                        value={total_organizations}
                        label={'Total Organizations'}
                        icon={Building2}
                        iconBg="bg-gradient-to-br from-purple-400 to-purple-600"
                    ></SummaryCard>
                    <SummaryCard
                        value={active_admins}
                        label={'Active Admins'}
                        icon={User}
                        className="fill-white"
                        iconBg="bg-gradient-to-br from-emerald-400 to-emerald-600"
                    ></SummaryCard>
                    <SummaryCard
                        value={pending_events}
                        label={'Pending Events'}
                        icon={Clock}
                        iconBg="bg-gradient-to-br from-amber-400 to-amber-600"
                    ></SummaryCard>
                    <SummaryCard
                        value={active_events}
                        label={'Active Events'}
                        icon={CalendarDays}
                        iconBg="bg-gradient-to-br from-lime-400 to-lime-600"
                    ></SummaryCard>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <Card className="col-span-1 p-6">
                        <div className="flex flex-row">
                            <Label>Event Status Overview</Label>
                        </div>
                        <Doughnut
                            data={eventStatusOverviewData}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: 'bottom' as const,
                                    },
                                    tooltip: {
                                        enabled: true,
                                    },
                                },
                                cutout: '60%', // Makes it more doughnut-like
                            }}
                        />
                    </Card>
                    <Card className="col-span-2 px-6 py-6">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-row">
                                <Label>Platform Growth Trends</Label>
                            </div>
                            <div className="flex flex-col">
                                <Line
                                    data={platformGrowthTrendData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        scales: {
                                            y: {
                                                ticks: {
                                                    stepSize: 1,
                                                    callback: function (value) {
                                                        return Number.isInteger(
                                                            value,
                                                        )
                                                            ? value
                                                            : '';
                                                    },
                                                },
                                            },
                                        },
                                    }}
                                ></Line>
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="grid grid-cols-4 gap-4">
                    <Card className="col-span-2 p-6">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-row justify-between">
                                <Label>Top Performing Organizations</Label>
                            </div>
                            <div className="flex flex-col gap-3">
                                {top_performing_organizations.length === 0 ? (
                                    <Card className="bg-gray-50 py-3 text-center text-sm text-gray-500">
                                        No data available
                                    </Card>
                                ) : (
                                    top_performing_organizations.map((org) => (
                                        <Card
                                            key={org.id ?? org.name}
                                            className="w-full bg-gray-50 py-3"
                                        >
                                            <div className="flex flex-row items-center gap-4 px-4">
                                                <img className="h-12 w-12 rounded-full bg-amber-100" />
                                                <div className="flex flex-1 flex-col gap-1">
                                                    <Label className="text-base font-semibold">
                                                        {org.name}
                                                    </Label>
                                                    <div className="flex flex-row gap-3 text-sm text-gray-600">
                                                        <span>
                                                            {org.total_events ??
                                                                0}{' '}
                                                            events
                                                        </span>
                                                        <span>•</span>
                                                        <span>
                                                            {org.total_attendees ??
                                                                0}{' '}
                                                            attendees
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </div>
                    </Card>
                    <Card className="col-span-2 p-6">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-row justify-between">
                                <Label>Top Performing Events</Label>
                            </div>
                            <div className="flex flex-col gap-3">
                                {top_performing_events.length === 0 ? (
                                    <Card className="bg-gray-50 py-3 text-center text-sm text-gray-500">
                                        No data available
                                    </Card>
                                ) : (
                                    top_performing_events.map((event) => (
                                        <Link
                                            href={
                                                superadmin.event.show(event.id)
                                                    .url
                                            }
                                        >
                                            <Card
                                                key={event.id ?? event.title}
                                                className="w-full bg-gray-50 py-3"
                                            >
                                                <div className="flex flex-row items-center gap-4 px-4">
                                                    <img className="h-12 w-12 rounded-full bg-amber-100" />
                                                    <div className="flex flex-1 flex-col gap-1">
                                                        <Label className="text-base font-semibold">
                                                            {event.title}
                                                        </Label>
                                                        <div className="flex flex-row gap-3 text-sm text-gray-600">
                                                            <span>
                                                                {event.attendee_count ??
                                                                    0}{' '}
                                                                attendees
                                                            </span>
                                                            {event.organization_name ? (
                                                                <>
                                                                    <span>
                                                                        •
                                                                    </span>
                                                                    <span>
                                                                        {
                                                                            event.organization_name
                                                                        }
                                                                    </span>
                                                                </>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
                <Card>
                    <div className="flex flex-col gap-4 p-6">
                        <div className="flex flex-row justify-between">
                            <Label>Recent Activities</Label>
                            <Label>View All Notifications</Label>
                        </div>
                        <div className="flex flex-col">
                            <Card className="border-1 border-gray-200 shadow-none hover:bg-gray-50">
                                <div className="flex flex-row gap-4 px-4">
                                    <div>
                                        <img
                                            src="https://lh3.googleusercontent.com/BKN1q6592B6RRjUCzycpYLMsRXezlbNW7lbJ3Y1xDUuzdJ_D9tbhr9GHk2_STmHBcIZYu4mNpu1cGgTU=w544-h544-l90-rj"
                                            alt="Profile"
                                            className="h-10 w-10 rounded-full border-white bg-gray-200"
                                        />
                                    </div>
                                    <div className="flex flex-2 flex-col gap-2">
                                        <Label>Engineering Dept</Label>
                                        <div className="flex flex-row gap-2">
                                            <Label>45 events</Label>
                                            <Label>*</Label>
                                            <Label>2,340 attendees</Label>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        4.7
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
