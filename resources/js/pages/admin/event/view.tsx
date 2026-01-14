import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { SummaryCard } from '@/components/ui/summary-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import { BreadcrumbItem } from '@/types';
import {
    formatDateRange,
    formatDateTime,
    formatTimeRange,
} from '@/utils/date-format';
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
import {
    ChevronLeft,
    ChevronRight,
    PhilippinePeso,
    Star,
    Users,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
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

type EventStatus = 'Pending' | 'Active' | 'Rejected' | 'Closed';

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
    images?: string[];
    image_path?: string | null;
};

type StudentYearLevelData = {
    year_level: string;
    total: number;
};

type ProgramDistributionData = {
    program: string;
    total: number;
};

type CheckInTimelineData = {
    check_in_time: string;
    total_check_ins: number;
};

type EventAttendee = {
    username: string;
    year_level: string;
    program: string;
    email: string;
    register_date: string;
    check_in_date: string;
};

interface Props {
    event: Event;
    registration_trend_labels: string[];
    registration_trend_data: number[];
    student_year_level_data: StudentYearLevelData[];
    program_distribution_data: ProgramDistributionData[];
    check_in_timeline_data: CheckInTimelineData[];
    event_attendees: EventAttendee[];
}

export default function EventView({
    event,
    registration_trend_labels = [],
    registration_trend_data = [],
    student_year_level_data = [],
    program_distribution_data = [],
    check_in_timeline_data = [],
    event_attendees = [],
}: Props) {
    if (!event) {
        return <div className="p-6">Event not found</div>;
    }

    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const eventStatus = getEventStatus(event);
    const galleryImages = useMemo(() => {
        const images = event.images?.filter(Boolean) ?? [];
        if (images.length > 0) {
            return images;
        }

        if (event.image_path) {
            return [event.image_path];
        }

        return [];
    }, [event]);

    const displayImages = galleryImages.length
        ? galleryImages
        : [
              'https://readdy.ai/api/search-image?query=modern%20technology%20conference%20summit%20with%20large%20screens%20displaying%20innovative%20tech%20presentations%20students%20and%20professionals%20networking%20in%20bright%20spacious%20university%20auditorium%20with%20stage%20and%20seating&width=1200&height=400&seq=tech-summit-detail-001&orientation=landscape',
          ];

    const resolveImageUrl = (path: string) =>
        path.startsWith('http') ? path : `/storage/${path}`;

    const goToPreviousImage = () => {
        setActiveImageIndex((prev) =>
            prev === 0 ? displayImages.length - 1 : prev - 1,
        );
    };

    const goToNextImage = () => {
        setActiveImageIndex((prev) =>
            prev === displayImages.length - 1 ? 0 : prev + 1,
        );
    };

    useEffect(() => {
        setActiveImageIndex(0);
    }, [event.id]);

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

    const programDistributionData: ChartData<'bar'> = {
        labels: program_distribution_data.map((item) => item.program),
        datasets: [
            {
                label: 'Count',
                data: program_distribution_data.map((item) => item.total),
                backgroundColor: ['pink'],
            },
        ],
    };

    const checkInTimelineData: ChartData<'line'> = {
        labels: check_in_timeline_data.map((item) =>
            formatDateTime(item.check_in_time),
        ),
        datasets: [
            {
                label: 'Check-Ins',
                data: check_in_timeline_data.map(
                    (item) => item.total_check_ins,
                ),
                backgroundColor: ['pink'],
                borderColor: ['pink'],
                pointBackgroundColor: ['pink'],
                tension: 0.2,
                pointBorderWidth: 5,
            },
        ],
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col overflow-hidden rounded-lg p-8">
                <div className="relative h-64 w-full overflow-hidden rounded-t-md">
                    <img
                        className="h-full w-full object-cover object-center"
                        src={resolveImageUrl(displayImages[activeImageIndex])}
                        alt={`${event.title} image ${activeImageIndex + 1}`}
                    />
                    {displayImages.length > 1 && (
                        <>
                            <button
                                className="absolute top-1/2 left-4 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white"
                                type="button"
                                onClick={goToPreviousImage}
                                aria-label="Previous image"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                                className="absolute top-1/2 right-4 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white"
                                type="button"
                                onClick={goToNextImage}
                                aria-label="Next image"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
                                {displayImages.map((_, index) => (
                                    <button
                                        key={`${event.id}-indicator-${index}`}
                                        type="button"
                                        onClick={() =>
                                            setActiveImageIndex(index)
                                        }
                                        className={`h-2.5 w-2.5 rounded-full ${index === activeImageIndex ? 'bg-white' : 'bg-white/50'}`}
                                        aria-label={`Show image ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
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
                                            {eventStatus === 'Active' && (
                                                <Badge variant="active">
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
                                                    Program Distribution
                                                </p>
                                                <div className="col-span-1 h-64 w-full">
                                                    <Bar
                                                        data={
                                                            programDistributionData
                                                        }
                                                        options={{
                                                            responsive: true,
                                                            maintainAspectRatio: false,
                                                            scales: {
                                                                y: {
                                                                    ticks: {
                                                                        stepSize: 1,
                                                                    },
                                                                },
                                                            },
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
                                                <Line
                                                    data={checkInTimelineData}
                                                    options={{
                                                        responsive: true,
                                                        maintainAspectRatio: false,
                                                        scales: {
                                                            y: {
                                                                ticks: {
                                                                    stepSize: 1,
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
                                        </div>
                                    </div>
                                </Card>
                            </TabsContent>
                            <TabsContent value="attendees">
                                <div className="mb-4 h-[450px] overflow-y-auto">
                                    <table className="w-full table-fixed text-sm">
                                        <thead className="bg-foreground/95">
                                            <tr className="text-left text-background">
                                                <th className="px-4 py-2 pl-4">
                                                    Username
                                                </th>
                                                <th className="px-4 py-2">
                                                    Year Level
                                                </th>
                                                <th className="px-4 py-2">
                                                    Program
                                                </th>
                                                <th className="px-4 py-2">
                                                    Email
                                                </th>
                                                <th className="px-4 py-2">
                                                    Register Date
                                                </th>
                                                <th className="px-4 py-2">
                                                    Check-in Date
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className="bg-card">
                                            {event_attendees.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan={6}
                                                        className="py-12 text-center text-gray-500"
                                                    >
                                                        No attendees found
                                                    </td>
                                                </tr>
                                            ) : (
                                                event_attendees.map(
                                                    (attendee) => (
                                                        <tr className="hover:bg-gray-100">
                                                            <td className="truncate p-4 font-medium">
                                                                {attendee.username ||
                                                                    'N/A'}
                                                            </td>
                                                            <td className="p-4 font-medium">
                                                                {
                                                                    attendee.year_level
                                                                }
                                                            </td>
                                                            <td className="p-4 font-medium">
                                                                {
                                                                    attendee.program
                                                                }
                                                            </td>
                                                            <td className="p-4 font-medium">
                                                                {attendee.email}
                                                            </td>
                                                            <td className="truncate p-4 font-medium">
                                                                {formatDateTime(
                                                                    attendee.register_date,
                                                                )}
                                                            </td>
                                                            <td className="p-4 font-medium">
                                                                {formatDateTime(
                                                                    attendee.check_in_date,
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ),
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
