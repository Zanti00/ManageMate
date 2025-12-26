import { Card } from '@/components/ui/card';
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
import { Bar, Doughnut, Line } from 'react-chartjs-2';

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

const totalAttendancePerEventData: ChartData<'bar'> = {
    labels: ['Event 1', 'Event 2', 'Event 3'],
    datasets: [
        {
            label: 'Total Attendance',
            data: [123, 1, 3],
            backgroundColor: ['red', 'blue', 'green'],
        },
    ],
};

const totalEventData: ChartData<'line'> = {
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [
        {
            label: 'Total Event Per Month',
            data: [1, 3, 2],
            backgroundColor: ['pink'],
            borderColor: ['pink'],
            pointBackgroundColor: ['pink'],
        },
    ],
};

const eventStatusData: ChartData<'doughnut'> = {
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
            <div className="flex flex-wrap gap-5 p-10">
                <Card className="w-[48%] p-4">
                    <Bar
                        className="w-full"
                        data={totalAttendancePerEventData}
                    />
                </Card>
                <Card className="w-[48%] p-4">
                    <Line data={totalEventData} />
                </Card>
                <Card>
                    <Doughnut data={eventStatusData} />
                </Card>
            </div>
        </AppLayout>
    );
}
