import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SummaryCard } from '@/components/ui/summary-card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes/admin';
import { type BreadcrumbItem } from '@/types';
import { formatPercentage } from '@/utils/percentage-format';
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
import { Calendar, Star, TrendingUp, Users } from 'lucide-react';
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

const monthlyEventData: ChartData<'bar'> = {
    labels: ['Event 1', 'Event 2', 'Event 3'],
    datasets: [
        {
            label: 'Total Attendance',
            data: [123, 1, 3],
            backgroundColor: ['pink'],
        },
    ],
};

const eventStatusData: ChartData<'pie'> = {
    labels: ['Pending', 'Approved', 'Rejected'],
    datasets: [
        {
            label: 'Event Status',
            data: [3, 6, 7],
            backgroundColor: ['yellow', 'green', 'red'],
        },
    ],
};

type AttendanceTrendData = {
    month: number;
    month_name: string;
    total_attendees: number;
};

interface Props {
    total_events: string;
    total_attendees: string;
    attendance_rate: number;
    attendance_trend_data: AttendanceTrendData[];
}

export default function AdminDashboard({
    total_events,
    total_attendees,
    attendance_rate,
    attendance_trend_data = [],
}: Props) {
    const monthLabels = attendance_trend_data.map((item) => item.month_name);
    const attendeesValues = attendance_trend_data.map(
        (item) => item.total_attendees,
    );

    const attendanceTrendData: ChartData<'line'> = {
        labels: monthLabels,
        datasets: [
            {
                label: 'Attendance',
                data: attendeesValues,
                backgroundColor: ['pink'],
                borderColor: ['pink'],
                pointBackgroundColor: ['pink'],
                pointBorderWidth: 5,
            },
        ],
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col gap-5 p-10">
                <div className="grid grid-cols-4 gap-6">
                    <SummaryCard
                        value={total_events}
                        label={'Total Events'}
                        icon={Calendar}
                        iconBg="bg-gradient-to-br from-teal-400 to-teal-600"
                    ></SummaryCard>
                    <SummaryCard
                        value={total_attendees}
                        label={'Total Attendees'}
                        icon={Users}
                        className="fill-white"
                        iconBg="bg-gradient-to-br from-orange-400 to-orange-600"
                    ></SummaryCard>
                    <SummaryCard
                        value={total_events}
                        label={'Average Rating'}
                        icon={Star}
                        className="fill-white"
                        iconBg="bg-gradient-to-br from-purple-400 to-purple-600"
                    ></SummaryCard>
                    <SummaryCard
                        value={formatPercentage(attendance_rate)}
                        label={'Overall Attendance Rate'}
                        icon={TrendingUp}
                        iconBg="bg-gradient-to-br from-emerald-400 to-emerald-600"
                    ></SummaryCard>
                </div>
                <div className="grid grid-cols-4 gap-6">
                    <Card className="col-span-2 gap-1 px-4">
                        <p className="font-extrabold">Attendance Trend</p>
                        <div className="flex flex-col px-4">
                            <Line
                                data={attendanceTrendData}
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
                        <p className="font-extrabold">Event Status</p>
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
                        <p className="font-extrabold">Monthly Events</p>
                        <div className="flex flex-col px-4">
                            <Bar
                                data={monthlyEventData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                }}
                            />
                        </div>
                    </Card>
                    <Card className="col-span-1 gap-y-2 px-4">
                        <p className="font-extrabold">Top Events</p>
                        <div className="flex flex-col gap-1">
                            <div className="flex flex-row justify-between">
                                <p>Event Title</p>
                                <p className="text-red-800/90">89%</p>
                            </div>
                            <Progress value={23} />
                            <p className="text-xs text-gray-500">
                                800 / 1200 of total attendees
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
