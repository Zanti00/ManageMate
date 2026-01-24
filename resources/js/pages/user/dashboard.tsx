import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { HorizontalEventCard } from '@/components/ui/horizontal-event-card';
import { SummaryCard } from '@/components/ui/summary-card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import user from '@/routes/user';
import { type BreadcrumbItem } from '@/types';
import { formatDateRange, formatTimeRange } from '@/utils/date-format';
import { Link } from '@inertiajs/react';
import dayjs from 'dayjs';
import {
    Calendar1,
    CalendarClock,
    CalendarDays,
    CalendarHeart,
    ChevronLeft,
    ChevronRight,
    Clock,
    MapPin,
} from 'lucide-react';
import React, { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: user.dashboard().url,
    },
];

type FilterValues = 'Today' | 'This Week';

type EventToday = {
    id: number;
    title: string;
    location: string;
    price: number;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    submit_date: number;
    attendees?: number;
    images?: string[];
    image_path?: string | null;
};

type UpcomingEvent = {
    id: number;
    title: string;
    location: string;
    price: number;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    submit_date: number;
    attendees?: number;
    image_path?: string | null;
    images?: string[];
};

type FeaturedEvent = {
    id: number;
    title: string;
    description?: string;
    location?: string;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    image_path?: string | null;
    images?: string[];
};

interface Props {
    upcoming_events?: UpcomingEvent[];
    events_today?: EventToday[];
    total_active_registered_events: string;
    total_events_this_week: string;
    featured_events?: FeaturedEvent[];
}

export default function Dashboard({
    events_today = [],
    upcoming_events = [],
    featured_events = [],
    total_active_registered_events,
    total_events_this_week,
}: Props) {
    const [date, setDate] = useState<Date | undefined>(new Date());

    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);
    const [count, setCount] = React.useState(0);
    React.useEffect(() => {
        if (!api) {
            return;
        }
        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);
        api.on('select', () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);

    const [statusFilter, setStatusFilter] = useState<'all' | FilterValues>(
        'all',
    );
    // Reset pagination to page 1 when filter changes
    React.useEffect(() => {
        setUpcomingPage(1);
    }, [statusFilter]);

    const eventsWithFilter = upcoming_events.map((event) => ({
        ...event,
        status:
            event.start_date === dayjs().format('YYYY-MM-DD')
                ? ('Today' as FilterValues)
                : ('This Week' as FilterValues),
    }));

    const filteredUpcomingEvents =
        statusFilter === 'all'
            ? upcoming_events
            : eventsWithFilter.filter((e) => e.status === statusFilter);

    // Pagination for upcoming events
    const EVENTS_PER_PAGE = 5;
    const [upcomingPage, setUpcomingPage] = useState(1);
    const totalUpcomingPages = Math.ceil(
        filteredUpcomingEvents.length / EVENTS_PER_PAGE,
    );
    const paginatedUpcomingEvents = filteredUpcomingEvents.slice(
        (upcomingPage - 1) * EVENTS_PER_PAGE,
        upcomingPage * EVENTS_PER_PAGE,
    );

    const renderUpcomingPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let startPage = Math.max(1, upcomingPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalUpcomingPages, startPage + maxVisible - 1);
        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <Button
                    key={i}
                    variant={i === upcomingPage ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setUpcomingPage(i)}
                    className="min-w-[2.5rem]"
                >
                    {i}
                </Button>,
            );
        }
        return pages;
    };

    const featuredEvents = featured_events;
    const FEATURED_FALLBACK_IMAGE =
        'https://readdy.ai/api/search-image?query=featured%20event%20spotlight%20stage%20with%20audience%20and%20vibrant%20lighting&width=1200&height=500&seq=featured-event-spotlight-001&orientation=landscape';

    const resolveFeaturedImage = (event: FeaturedEvent) => {
        const firstImage = event.images?.find((path) => !!path);
        const source = firstImage || event.image_path;

        if (!source) {
            return FEATURED_FALLBACK_IMAGE;
        }

        return source.startsWith('http') ? source : `/storage/${source}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col gap-5 p-8">
                <div className="grid grid-cols-3 gap-6">
                    <SummaryCard
                        value={total_active_registered_events}
                        label={'My Events'}
                        icon={CalendarHeart}
                        iconBg="bg-gradient-to-br from-teal-400 to-teal-600"
                    ></SummaryCard>
                    <SummaryCard
                        value={upcoming_events.length.toString() ?? '0'}
                        label={'Upcoming'}
                        icon={CalendarClock}
                        iconBg={
                            'bg-gradient-to-br from-emerald-400 to-emerald-600'
                        }
                    ></SummaryCard>
                    <SummaryCard
                        value={total_events_this_week}
                        label={'This Week'}
                        icon={CalendarDays}
                        iconBg="bg-gradient-to-br from-orange-400 to-orange-600"
                    ></SummaryCard>
                    {/* <SummaryCard
                        value={'1'}
                        label={'Notifications'}
                        icon={Bell}
                        iconBg="bg-gradient-to-br from-rose-400 to-rose-600"
                    ></SummaryCard> */}
                </div>
                <div className="flex flex-row">
                    <strong className="text-2xl font-extrabold text-black">
                        Featured Event
                    </strong>
                </div>
                {/* Carousel */}
                <div className="grid grid-cols-1">
                    <div className="col-span-1">
                        <div className="mx-auto w-full">
                            {featuredEvents.length === 0 ? (
                                <Card className="flex h-64 items-center justify-center p-6 text-center text-muted-foreground">
                                    No featured events available right now.
                                </Card>
                            ) : (
                                <Carousel
                                    setApi={setApi}
                                    className="w-full shadow-lg"
                                >
                                    <CarouselContent>
                                        {featuredEvents.map((event) => (
                                            <CarouselItem key={event.id}>
                                                <Card className="p-0">
                                                    <CardContent className="flex aspect-video items-center justify-between p-0">
                                                        <div className="flex h-full w-1/2 items-center justify-center">
                                                            <img
                                                                src={resolveFeaturedImage(
                                                                    event,
                                                                )}
                                                                className="h-full w-full rounded-l-2xl object-cover"
                                                                alt={`${event.title} banner`}
                                                            />
                                                        </div>
                                                        <div className="flex h-full w-1/2 flex-col justify-between p-8">
                                                            <div className="flex flex-col gap-4 text-primary-foreground">
                                                                <div className="text-4xl font-bold">
                                                                    {
                                                                        event.title
                                                                    }
                                                                </div>
                                                                <p className="mb-1 line-clamp-20">
                                                                    {event.description ||
                                                                        'No description provided.'}
                                                                </p>
                                                                <div className="flex flex-col gap-4 text-sm font-medium">
                                                                    <div className="flex flex-row gap-2">
                                                                        <Calendar1
                                                                            size={
                                                                                15
                                                                            }
                                                                            className="stroke-3"
                                                                        />
                                                                        <div>
                                                                            {formatDateRange(
                                                                                event.start_date,
                                                                                event.end_date,
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex flex-row gap-2">
                                                                        <Clock
                                                                            size={
                                                                                15
                                                                            }
                                                                            className="stroke-3"
                                                                        />
                                                                        <div>
                                                                            {formatTimeRange(
                                                                                event.start_time,
                                                                                event.end_time,
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex flex-row gap-2">
                                                                        <MapPin
                                                                            size={
                                                                                15
                                                                            }
                                                                            className="stroke-3"
                                                                        />
                                                                        {event.location && (
                                                                            <div>
                                                                                {
                                                                                    event.location
                                                                                }
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <Button
                                                                className="mt-2 shadow-xl"
                                                                asChild
                                                            >
                                                                <Link
                                                                    href={
                                                                        user.event.show(
                                                                            event.id,
                                                                        ).url
                                                                    }
                                                                >
                                                                    View
                                                                </Link>
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                    {count > 0 && (
                                                        <div className="py-2 text-center text-sm text-muted-foreground">
                                                            {current} of {count}
                                                        </div>
                                                    )}
                                                </Card>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    {featuredEvents.length > 1 && (
                                        <>
                                            <CarouselPrevious className="absolute top-1/2 left-2 -translate-y-1/2" />
                                            <CarouselNext className="absolute top-1/2 right-2 -translate-y-1/2" />
                                        </>
                                    )}
                                </Carousel>
                            )}
                        </div>
                    </div>
                </div>
                {/* end of carousel */}
                <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-2 flex flex-col gap-6">
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-row items-center gap-2">
                                <span className="h-3 w-3 animate-pulse rounded-full bg-emerald-500"></span>
                                <strong className="text-2xl font-extrabold text-black">
                                    Happening Now
                                </strong>
                            </div>
                            {events_today.length === 0 ? (
                                <div className="py-8 text-center text-gray-500">
                                    No events happening today.
                                </div>
                            ) : (
                                events_today.map((event) => {
                                    let imageUrl =
                                        '/images/event-placeholder.png';
                                    if (
                                        event.images &&
                                        event.images.length > 0
                                    ) {
                                        imageUrl =
                                            event.images.find(Boolean) ||
                                            imageUrl;
                                    } else if (event.image_path) {
                                        imageUrl = event.image_path.startsWith(
                                            'http',
                                        )
                                            ? event.image_path
                                            : `/storage/${event.image_path}`;
                                    }
                                    return (
                                        <Link
                                            href={user.event.show(event.id).url}
                                            key={event.id}
                                        >
                                            <HorizontalEventCard
                                                event={event}
                                                imageUrl={imageUrl}
                                                className="border-1 border-emerald-300"
                                            />
                                        </Link>
                                    );
                                })
                            )}
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-row items-center justify-between gap-3">
                                <strong className="text-2xl font-extrabold text-black">
                                    Upcoming Events
                                </strong>
                                <Tabs
                                    value={statusFilter}
                                    onValueChange={(value) =>
                                        setStatusFilter(value as any)
                                    }
                                >
                                    <div className="flex flex-row">
                                        <TabsList className="h-10 gap-2 bg-transparent">
                                            <TabsTrigger
                                                value="all"
                                                className="bg-gray-200"
                                            >
                                                All ({upcoming_events.length})
                                            </TabsTrigger>

                                            <TabsTrigger
                                                value="Today"
                                                className="bg-gray-200"
                                            >
                                                Today (
                                                {
                                                    eventsWithFilter.filter(
                                                        (e) =>
                                                            e.status ===
                                                            'Today',
                                                    ).length
                                                }
                                                )
                                            </TabsTrigger>

                                            <TabsTrigger
                                                value="This Week"
                                                className="bg-gray-200"
                                            >
                                                This Week (
                                                {
                                                    eventsWithFilter.filter(
                                                        (e) =>
                                                            e.status ===
                                                            'This Week',
                                                    ).length
                                                }
                                                )
                                            </TabsTrigger>
                                        </TabsList>
                                    </div>
                                </Tabs>
                            </div>
                            {upcoming_events.length === 0 ? (
                                <div className="py-8 text-center text-gray-500">
                                    No upcoming events as of now.
                                </div>
                            ) : (
                                <>
                                    {paginatedUpcomingEvents.map((event) => {
                                        let imageUrl =
                                            '/images/event-placeholder.png';
                                        if (
                                            event.images &&
                                            event.images.length > 0
                                        ) {
                                            imageUrl =
                                                event.images.find(Boolean) ||
                                                imageUrl;
                                        } else if (event.image_path) {
                                            imageUrl =
                                                event.image_path.startsWith(
                                                    'http',
                                                )
                                                    ? event.image_path
                                                    : `/storage/${event.image_path}`;
                                        }
                                        return (
                                            <Link
                                                href={
                                                    user.event.show(event.id)
                                                        .url
                                                }
                                                key={event.id}
                                            >
                                                <HorizontalEventCard
                                                    event={event}
                                                    imageUrl={imageUrl}
                                                    className="border-1 border-emerald-300"
                                                />
                                            </Link>
                                        );
                                    })}
                                    {totalUpcomingPages > 1 && (
                                        <div className="mt-4 flex w-full flex-row items-center justify-between gap-4">
                                            <div className="text-sm whitespace-nowrap text-gray-600">
                                                {`Showing ${(upcomingPage - 1) * EVENTS_PER_PAGE + 1} to ${Math.min(upcomingPage * EVENTS_PER_PAGE, filteredUpcomingEvents.length)} of ${filteredUpcomingEvents.length} events`}
                                            </div>
                                            <div className="flex flex-shrink-0 flex-row items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        setUpcomingPage(
                                                            upcomingPage - 1,
                                                        )
                                                    }
                                                    disabled={
                                                        upcomingPage === 1
                                                    }
                                                >
                                                    <ChevronLeft className="h-4 w-4" />
                                                    Previous
                                                </Button>
                                                <div className="flex gap-1">
                                                    {renderUpcomingPageNumbers()}
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        setUpcomingPage(
                                                            upcomingPage + 1,
                                                        )
                                                    }
                                                    disabled={
                                                        upcomingPage ===
                                                        totalUpcomingPages
                                                    }
                                                >
                                                    Next
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                    <div className="col-span-1">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="w-[100%] rounded-lg bg-white shadow-md"
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
