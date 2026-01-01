import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes/admin';
import { type BreadcrumbItem } from '@/types';
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

const attendanceTrendData: ChartData<'line'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
        {
            label: 'Attendance',
            data: [1200, 1800, 2400, 2100, 2800, 3200],
            backgroundColor: ['pink'],
            borderColor: ['pink'],
            pointBackgroundColor: ['pink'],
            pointBorderWidth: 5,
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

export default function AdminDashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col gap-5 p-10">
                <div className="grid grid-cols-4 gap-6">
                    <Card>
                        <CardTitle>48</CardTitle>
                        <CardDescription>Total Organizations</CardDescription>
                    </Card>
                    <Card>
                        <CardTitle>48</CardTitle>
                        <CardDescription>Total Organizations</CardDescription>
                    </Card>
                    <Card>
                        <CardTitle>48</CardTitle>
                        <CardDescription>Total Organizations</CardDescription>
                    </Card>
                    <Card>
                        <CardTitle>48</CardTitle>
                        <CardDescription>Total Organizations</CardDescription>
                    </Card>
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
