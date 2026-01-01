import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
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
        href: dashboard.url(),
    },
];

const eventStatusOverviewData: ChartData<'doughnut'> = {
    labels: ['Pending', 'Approved', 'Rejected', 'Closed'],
    datasets: [
        {
            label: 'Event Status Overview',
            data: [24, 156, 8, 89],
            backgroundColor: [
                'rgb(255, 205, 86)',
                'rgb(54, 162, 235)',
                'rgb(255, 99, 132)',
                'gray',
            ],
        },
    ],
};

const platformGrowthTrendData: ChartData<'line'> = {
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [
        {
            data: [1, 3, 2],
            backgroundColor: ['pink'],
            borderColor: ['pink'],
            pointBackgroundColor: ['pink'],
        },
        {
            data: [4, 1, 5],
            backgroundColor: ['rgb(255, 205, 86)'],
            borderColor: ['rgb(255, 205, 86)'],
            pointBackgroundColor: ['rgb(255, 205, 86)'],
        },
    ],
};

const organizationActivityData: ChartData<'bar'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
        {
            data: [65, 59, 80, 81, 56, 55, 40],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(201, 203, 207, 0.2)',
            ],
            borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)',
            ],
        },
    ],
};

export default function SuperAdminDashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col gap-8 p-6">
                <div className="grid grid-cols-4 gap-4">
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
                <div className="grid grid-cols-3 gap-4">
                    <Card className="col-span-1 items-center justify-center p-4">
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
                    <Card className="col-span-2 px-12 py-8">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-row">
                                <Label>Platform Growth Trends</Label>
                            </div>
                            <Line data={platformGrowthTrendData}></Line>
                        </div>
                    </Card>
                </div>
                <div className="grid grid-cols-4 gap-4">
                    <Card className="col-span-2 p-6">
                        <div className="flex flex-col">
                            <Label>Organization Activity</Label>
                        </div>
                        <Bar data={organizationActivityData}></Bar>
                    </Card>
                    <Card className="col-span-2 p-6">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-row justify-between">
                                <Label>Top Performing Organizations</Label>
                                <Label>View All</Label>
                            </div>
                            <Card className="bg-gray-100 py-3">
                                <div className="flex flex-row gap-4 px-4">
                                    <div className="">
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
