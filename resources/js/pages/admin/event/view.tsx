import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { SummaryCard } from '@/components/ui/summary-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import { BreadcrumbItem } from '@/types';
import { formatDateRange, formatTimeRange } from '@/utils/date-format';
import { getEventStatus } from '@/utils/event-status';
import { formatPrice } from '@/utils/price-format';
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
import { PhilippinePeso, Star, Users } from 'lucide-react';
import { Bar, Line, Pie } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
);

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'View Event',
        href: admin.event.show.url(1),
    },
];

type EventStatus = 'Pending' | 'Approved' | 'Rejected' | 'Closed';

// delete this before production
type EventExample = {
    id: number;
    name: string;
    organization: string;
    date: string;
    attendees: string;
    status: EventStatus;
    submitted: string;
};

const events: EventExample[] = [
    {
        id: 1,
        name: 'Tech Innovation Summit 2024',
        organization: 'Engineering Dept',
        date: 'June 15, 2024',
        attendees: '250 / 300',
        status: 'Pending',
        submitted: '2 days ago',
    },
    {
        id: 2,
        name: 'Annual Art Exhibition',
        organization: 'Arts & Sciences',
        date: 'June 18, 2024',
        attendees: '180 / 200',
        status: 'Pending',
        submitted: '1 day ago',
    },
    {
        id: 3,
        name: 'Business Leadership Conference',
        organization: 'Business School',
        date: 'June 20, 2024',
        attendees: '320 / 350',
        status: 'Approved',
        submitted: '5 days ago',
    },
];

const courseDistributionData: ChartData<'bar'> = {
    labels: ['Event 1', 'Event 2', 'Event 3'],
    datasets: [
        {
            label: 'Count',
            data: [123, 1, 3],
            backgroundColor: ['pink'],
        },
    ],
};

const checkInData: ChartData<'bar'> = {
    labels: ['Event 1', 'Event 2', 'Event 3'],
    datasets: [
        {
            label: 'Check-ins',
            data: [123, 1, 3],
            backgroundColor: ['pink'],
        },
    ],
};

type Event = {
    id: number;
    title: string;
    description: string;
    location: string;
    attendees: string;
    registries: string;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    registration_start_date: string;
    registration_end_date: string;
    registration_start_time: string;
    registration_end_time: string;
    status: EventStatus;
    price: number;
    earnings: number;
};

type StudentYearLevelData = {
    year_level: string;
    total: number;
};

interface Props {
    event: Event;
    registration_trend_labels: string[];
    registration_trend_data: number[];
    student_year_level_data: StudentYearLevelData[];
}

export default function EventView({
    event,
    registration_trend_labels = [],
    registration_trend_data = [],
    student_year_level_data = [],
}: Props) {
    if (!event) {
        return <div className="p-6">Event not found</div>;
    }

    const registrationTrendData: ChartData<'line'> = {
        labels: registration_trend_labels,
        datasets: [
            {
                label: 'Registrations',
                data: registration_trend_data,
                backgroundColor: ['pink'],
                borderColor: ['pink'],
                pointBackgroundColor: ['pink'],
                tension: 0.2,
                pointBorderWidth: 5,
            },
        ],
    };

    const yearLevelData: ChartData<'pie'> = {
        labels: student_year_level_data.map((item) => item.year_level),
        datasets: [
            {
                label: 'Event Status',
                data: student_year_level_data.map((item) => item.total),
                backgroundColor: ['yellow', 'green', 'red', 'black'],
            },
        ],
    };

    const eventStatus = getEventStatus(event);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col overflow-hidden rounded-lg p-8">
                <img
                    className="h-64 w-full rounded-t-md object-cover object-top"
                    src="https://readdy.ai/api/search-image?query=modern%20technology%20conference%20summit%20with%20large%20screens%20displaying%20innovative%20tech%20presentations%20students%20and%20professionals%20networking%20in%20bright%20spacious%20university%20auditorium%20with%20stage%20and%20seating&width=1200&height=400&seq=tech-summit-detail-001&orientation=landscape"
                />
                <div className="flex flex-col gap-y-6">
                    <Card className="rounded-t-none p-6 shadow-md">
                        <div className="flex flex-row justify-between">
                            <div className="flex flex-col gap-y-3">
                                <div className="flex flex-row">
                                    {event.status && (
                                        <div className="flex flex-row">
                                            {eventStatus === 'Closed' && (
                                                <Badge variant="closed">
                                                    Closed
                                                </Badge>
                                            )}
                                            {eventStatus === 'Approved' && (
                                                <Badge variant="approved">
                                                    Approved
                                                </Badge>
                                            )}
                                            {eventStatus === 'Pending' && (
                                                <Badge variant="pending">
                                                    Pending
                                                </Badge>
                                            )}
                                            {eventStatus === 'Rejected' && (
                                                <Badge variant="rejected">
                                                    Rejected
                                                </Badge>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-row">
                                    <Label className="text-4xl font-extrabold">
                                        {event.title}
                                    </Label>
                                </div>
                                <div className="flex flex-row text-gray-800">
                                    <p>{event.description}</p>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <Button className="bg-red-900 text-white">
                                    Generate Report
                                </Button>
                            </div>
                        </div>
                    </Card>
                    <div className="grid grid-cols-4 gap-4">
                        <SummaryCard
                            value={event.registries}
                            label={'Total Registries'}
                            icon={Users}
                            className="fill-white"
                            iconBg="bg-gradient-to-br from-teal-400 to-teal-600"
                        ></SummaryCard>
                        <SummaryCard
                            value={event.attendees}
                            label={'Total Attendees'}
                            icon={Users}
                            className="fill-white"
                            iconBg="bg-gradient-to-br from-orange-400 to-orange-600"
                        ></SummaryCard>
                        <SummaryCard
                            value={formatPrice(event.earnings)}
                            label={'Total Earnings'}
                            icon={PhilippinePeso}
                            iconBg="bg-gradient-to-br from-purple-400 to-purple-600"
                        ></SummaryCard>
                        <SummaryCard
                            value={'1'}
                            label={'Average Rating'}
                            icon={Star}
                            className="fill-white"
                            iconBg="bg-gradient-to-br from-emerald-400 to-emerald-600"
                        ></SummaryCard>
                    </div>
                    <div className="rounded-2xl bg-white p-2">
                        <Tabs defaultValue="overview">
                            <TabsList>
                                <TabsTrigger value="overview">
                                    Overview
                                </TabsTrigger>
                                <TabsTrigger value="statistics">
                                    Statistics
                                </TabsTrigger>
                                <TabsTrigger value="attendees">
                                    Attendees
                                </TabsTrigger>
                            </TabsList>
                            <hr className="border-t-1 border-gray-200" />
                            <TabsContent className="bg-white" value="overview">
                                <Card className="shadow-none">
                                    <div className="grid grid-cols-2">
                                        <div className="flex flex-col px-6">
                                            <div className="flex flex-row">
                                                <p className="text-xl font-extrabold">
                                                    Event Details
                                                </p>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-row">
                                                    <div className="flex flex-col">
                                                        <p className="font-medium">
                                                            Date
                                                        </p>
                                                        <p>
                                                            {formatDateRange(
                                                                event.start_date,
                                                                event.end_date,
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-row">
                                                    <div className="flex flex-col">
                                                        <p className="font-medium">
                                                            Time
                                                        </p>
                                                        <p>
                                                            {formatTimeRange(
                                                                event.start_time,
                                                                event.end_time,
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-row">
                                                    <div className="flex flex-col">
                                                        <p className="font-medium">
                                                            Location
                                                        </p>
                                                        <p>{event.location}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-row">
                                                    <div className="flex flex-col">
                                                        <p className="font-medium">
                                                            Ticket Price
                                                        </p>
                                                        <p>
                                                            {formatPrice(
                                                                event.price,
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="gap-y-6 px-6">
                                                <p className="text-xl font-extrabold">
                                                    Organizer Information
                                                </p>
                                                <div className="flex flex-col gap-4">
                                                    <div className="flex flex-row">
                                                        <div className="flex flex-col">
                                                            <p className="font-medium">
                                                                Organization
                                                            </p>
                                                            <p>
                                                                Commonwealth
                                                                Information
                                                                Society
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-row">
                                                        <div className="flex flex-col">
                                                            <p className="font-medium">
                                                                Email
                                                            </p>
                                                            <p>
                                                                commitspupqc@test.com
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-row">
                                                        <div className="flex flex-col">
                                                            <p className="font-medium">
                                                                Phone
                                                            </p>
                                                            <p>09123456789</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </TabsContent>
                            <TabsContent value="statistics">
                                <Card className="px-4 shadow-none">
                                    <div className="flex flex-col gap-6">
                                        <p className="font-extrabold">
                                            Registration Trend
                                        </p>
                                        <div className="h-64 flex-col px-4">
                                            <Line
                                                data={registrationTrendData}
                                                options={{
                                                    responsive: true,
                                                    maintainAspectRatio: false,
                                                    scales: {
                                                        y: {
                                                            ticks: {
                                                                stepSize: 800,
                                                                callback:
                                                                    function (
                                                                        value,
                                                                    ) {
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
                                            />
                                        </div>
                                        <div className="grid grid-cols-2">
                                            <div className="flex flex-col">
                                                <p className="font-extrabold">
                                                    Student Year Level
                                                </p>
                                                <div className="col-span-1 h-64 w-full">
                                                    <Pie
                                                        data={yearLevelData}
                                                        options={{
                                                            responsive: true,
                                                            maintainAspectRatio: false,
                                                        }}
                                                        className="h-full w-full"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="font-extrabold">
                                                    Course Distribution
                                                </p>
                                                <div className="col-span-1 h-64 w-full">
                                                    <Bar
                                                        data={
                                                            courseDistributionData
                                                        }
                                                        options={{
                                                            responsive: true,
                                                            maintainAspectRatio: false,
                                                        }}
                                                        className="h-full w-full"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="font-extrabold">
                                                Check-in Timeline
                                            </p>
                                            <div className="flex h-64 w-full flex-col px-4">
                                                <Bar
                                                    data={checkInData}
                                                    options={{
                                                        responsive: true,
                                                        maintainAspectRatio: false,
                                                    }}
                                                    className="h-full w-full"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </TabsContent>
                            <TabsContent value="attendees">
                                <table className="w-full overflow-hidden rounded-2xl text-sm shadow-md">
                                    <thead>
                                        <tr className="text-left text-black">
                                            <th className="p-4">Event</th>
                                            <th>Organization</th>
                                            <th>Date & Time</th>
                                            <th>Attendees</th>
                                            <th>Status</th>
                                            <th>Submitted</th>
                                        </tr>
                                    </thead>

                                    <tbody className="bg-card">
                                        {events.map((event) => (
                                            <tr
                                                key={event.id}
                                                className="hover:bg-gray-100"
                                            >
                                                <td className="p-4 font-medium">
                                                    {event.name}
                                                </td>
                                                <td>{event.organization}</td>
                                                <td>{event.date}</td>
                                                <td>{event.attendees}</td>
                                                <td>
                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs ${
                                                            event.status ===
                                                            'Pending'
                                                                ? 'bg-yellow-100 text-yellow-700'
                                                                : event.status ===
                                                                    'Approved'
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
                                                <td>{event.submitted}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
