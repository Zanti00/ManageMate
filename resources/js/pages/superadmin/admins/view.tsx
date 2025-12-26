import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import superadmin from '@/routes/superadmin';
import { BreadcrumbItem } from '@/types';
import { Mail, Phone } from 'lucide-react';

import { Button } from '@/components/ui/button';
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
        href: superadmin.admins.view.url(),
    },
];

const monthlyPerformanceData: ChartData<'line'> = {
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

const eventCategoriesData: ChartData<'doughnut'> = {
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

export default function SuperAdminEditAdmin() {
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
                            <CardTitle>Engineering Dept</CardTitle>
                            <div className="flex flex-row items-center gap-2">
                                <Mail size={12}></Mail>
                                <CardDescription>
                                    engineeringdept@test.com
                                </CardDescription>
                                <Phone size={12}></Phone>
                                <CardDescription>
                                    +1 (555) 123-4567
                                </CardDescription>
                            </div>
                            <div className="flex flex-row gap-2">
                                <Badge variant="approved">Active</Badge>
                                <CardDescription>
                                    Joined January 15, 2023
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex flex-row gap-2">
                            <Button className="bg-gray-100 text-black">
                                Edit
                            </Button>
                            <Button className="bg-red-50 text-red-600">
                                Deactivate
                            </Button>
                        </div>
                    </div>
                </Card>
                <div className="grid grid-cols-4 gap-6">
                    <Card className="flex flex-col">
                        <CardTitle>8</CardTitle>
                        <CardDescription>Total Events</CardDescription>
                    </Card>
                    <Card className="flex flex-col">
                        <CardTitle>8</CardTitle>
                        <CardDescription>Total Events</CardDescription>
                    </Card>
                    <Card className="flex flex-col">
                        <CardTitle>8</CardTitle>
                        <CardDescription>Total Events</CardDescription>
                    </Card>
                    <Card className="flex flex-col">
                        <CardTitle>8</CardTitle>
                        <CardDescription>Total Events</CardDescription>
                    </Card>
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
                            <div className="flex flex-col gap-6">
                                <Label>Recent Events</Label>
                                <Card className="flex flex-row justify-between border-1 border-gray-200 px-4 shadow-none">
                                    <div className="flex flex-col gap-2">
                                        <Label>
                                            Tech Innovation Summit 2024
                                        </Label>
                                        <Label>June 15, 2024</Label>
                                    </div>
                                    <Badge variant={'pending'}>Pending</Badge>
                                </Card>
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
