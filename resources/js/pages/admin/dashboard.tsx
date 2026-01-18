import Heading from '@/components/heading';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SummaryCard } from '@/components/ui/summary-card';
import AppLayout from '@/layouts/app-layout';
import admin, { dashboard } from '@/routes/admin';
import { type BreadcrumbItem } from '@/types';
import { calculatePercentage } from '@/utils/calculate-total-percentage';
import { formatPercentage } from '@/utils/percentage-format';
import { Link } from '@inertiajs/react';
import type { ChartData } from 'chart.js';
import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import { Calendar, TrendingUp, Users } from 'lucide-react';
import { Bar, Line, Pie } from 'react-chartjs-2';

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
        href: dashboard().url,
    },
];

type MonthlyAttendanceTrendData = {
    month: number;
    month_name: string;
    total_attendees: number;
};

type EventAttendanceTrendData = {
    title: string;
    attendees: number;
};

type TopFiveEvent = {
    id: number;
    title: string;
    attendees: number;
};

interface Props {
    total_events: string;
    overall_total_attendees: string;
    attendance_rate: number;
    monthly_attendance_trend_data: MonthlyAttendanceTrendData[];
    event_status_data: number[];
    event_attendance_trend_data: EventAttendanceTrendData[];
    top_five_events: TopFiveEvent[];
}

export default function AdminDashboard({
    total_events,
    overall_total_attendees,
    attendance_rate,
    monthly_attendance_trend_data = [],
    event_status_data = [0, 0, 0],
    event_attendance_trend_data = [],
    top_five_events = [],
}: Props) {
    const MonthlyAttendanceTrendData: ChartData<'line'> = {
        labels: monthly_attendance_trend_data.map((item) => item.month_name),
        datasets: [
            {
                label: 'Attendance',
                data: monthly_attendance_trend_data.map(
                    (item) => item.total_attendees,
                ),
                backgroundColor: ['pink'],
                borderColor: ['pink'],
                pointBackgroundColor: ['pink'],
                tension: 0.2,
                pointBorderWidth: 5,
            },
        ],
    };

    const EventAttendanceTrendData: ChartData<'bar'> = {
        labels: event_attendance_trend_data.map((item) => item.title),
        datasets: [
            {
                label: 'Total Attendance',
                data: event_attendance_trend_data.map((item) => item.attendees),
                backgroundColor: ['pink'],
            },
        ],
    };

    const eventStatusData: ChartData<'pie'> = {
        labels: ['Pending', 'Active', 'Rejected'],
        datasets: [
            {
                label: 'Event Status',
                data: event_status_data,
                backgroundColor: [
                    'rgb(255, 192, 103)',
                    'rgb(0, 187, 119)',
                    'rgb(255, 116, 108)',
                ],
            },
        ],
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col gap-5 p-8">
                <Heading
                    title="Dashboard Overview"
                    description="Monitor your event performance and key metrics"
                />
                <div className="grid grid-cols-3 gap-6">
                    <SummaryCard
                        value={total_events}
                        label={'Total Events'}
                        icon={Calendar}
                        iconBg="bg-gradient-to-br from-teal-400 to-teal-600"
                    ></SummaryCard>
                    <SummaryCard
                        value={overall_total_attendees}
                        label={'Total Attendees'}
                        icon={Users}
                        className="fill-white"
                        iconBg="bg-gradient-to-br from-orange-400 to-orange-600"
                    ></SummaryCard>
                    {/* <SummaryCard
                        value={total_events}
                        label={'Average Rating'}
                        icon={Star}
                        className="fill-white"
                        iconBg="bg-gradient-to-br from-purple-400 to-purple-600"
                    ></SummaryCard> */}
                    <SummaryCard
                        value={formatPercentage(attendance_rate)}
                        label={'Overall Attendance Rate'}
                        icon={TrendingUp}
                        iconBg="bg-gradient-to-br from-emerald-400 to-emerald-600"
                    ></SummaryCard>
                </div>
                <div className="grid grid-cols-4 gap-6">
                    <Card className="col-span-2 gap-1 px-4">
                        <p className="font-bold">Monthly Attendance Trend</p>
                        <div className="flex flex-col px-4">
                            <Line
                                data={MonthlyAttendanceTrendData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    scales: {
                                        y: {
                                            ticks: {
                                                stepSize: 800,
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
                                className="h-full"
                            />
                        </div>
                    </Card>
                    <Card className="col-span-2 gap-1 px-4">
                        <p className="font-bold">Event Status</p>
                        <div className="flex h-[90%] w-[100%] flex-col items-center">
                            <Pie
                                data={eventStatusData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                }}
                            />
                        </div>
                    </Card>
                </div>
                <div className="grid grid-cols-3 gap-6">
                    <Card className="col-span-2 gap-1 px-4">
                        <p className="font-bold">Event Attendance Trend</p>
                        <div className="flex flex-col px-4">
                            <Bar
                                data={EventAttendanceTrendData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                }}
                            />
                        </div>
                    </Card>
                    <Card className="col-span-1 gap-y-0">
                        <p className="px-3 font-bold">Top Events</p>
                        {top_five_events.map((event) => (
                            <Link href={admin.event.show(event.id).url}>
                                <div className="flex flex-col gap-1 px-7 py-1 hover:bg-gray-100">
                                    <div className="flex flex-row justify-between">
                                        <p>{event.title}</p>
                                        <p className="text-red-800/90">
                                            {calculatePercentage(
                                                event.attendees,
                                                overall_total_attendees,
                                            )}
                                            %
                                        </p>
                                    </div>
                                    <Progress
                                        value={calculatePercentage(
                                            event.attendees,
                                            overall_total_attendees,
                                        )}
                                    />
                                    <p className="text-xs text-gray-500">
                                        {event.attendees || '0'} /{' '}
                                        {overall_total_attendees} of total
                                        attendees
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
