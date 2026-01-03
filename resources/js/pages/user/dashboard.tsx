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
import { Link } from '@inertiajs/react';
import dayjs from 'dayjs';
import { Bell, CalendarClock, CalendarDays, CalendarHeart } from 'lucide-react';
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
};

interface Props {
    upcoming_events?: UpcomingEvent[];
    events_today?: EventToday[];
    total_active_registered_events: string;
    total_events_this_week: string;
}

export default function Dashboard({
    events_today = [],
    upcoming_events = [],
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col gap-5 p-8">
                <div className="grid grid-cols-4 gap-6">
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
                    <SummaryCard
                        value={'1'}
                        label={'Notifications'}
                        icon={Bell}
                        iconBg="bg-gradient-to-br from-rose-400 to-rose-600"
                    ></SummaryCard>
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
                            <Carousel
                                setApi={setApi}
                                className="w-full shadow-lg"
                            >
                                <CarouselContent>
                                    {Array.from({ length: 5 }).map(
                                        (_, index) => (
                                            <CarouselItem key={index}>
                                                <Card className="p-0">
                                                    <CardContent className="flex aspect-video items-center justify-between p-0">
                                                        {/* Left: Image or number */}
                                                        <div className="flex h-full w-1/2 items-center justify-center">
                                                            <img
                                                                src="https://readdy.ai/api/search-image?query=large%20modern%20technology%20conference%20with%20bright%20stage%20lighting%20innovative%20tech%20displays%20students%20and%20professionals%20networking%20in%20spacious%20university%20auditorium%20with%20futuristic%20atmosphere%20and%20digital%20screens&width=1200&height=500&seq=featured-tech-summit-001&orientation=landscape"
                                                                className="h-full w-full rounded-l-2xl object-cover"
                                                            />
                                                        </div>
                                                        {/* Right: Details */}
                                                        <div className="flex h-full w-1/2 flex-col justify-between p-8">
                                                            <div>
                                                                <div className="text-lg font-bold">
                                                                    Event Title{' '}
                                                                    {index + 1}
                                                                </div>
                                                                <div className="mb-1 text-sm text-muted-foreground">
                                                                    Short
                                                                    description
                                                                    for event{' '}
                                                                    {index + 1}{' '}
                                                                    goes here.
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    Date: 12
                                                                    April 2025
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    Time: 9:00PM
                                                                    - 11:30PM
                                                                </div>
                                                            </div>
                                                            <Button className="mt-2 shadow-xl">
                                                                View
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                    <div className="py-2 text-center text-sm text-muted-foreground">
                                                        {current} of {count}
                                                    </div>
                                                </Card>
                                            </CarouselItem>
                                        ),
                                    )}
                                </CarouselContent>
                                <CarouselPrevious className="absolute top-1/2 left-2 -translate-y-1/2" />
                                <CarouselNext className="absolute top-1/2 right-2 -translate-y-1/2" />
                            </Carousel>
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
                                events_today.map((event) => (
                                    <Link href={user.event.show(event.id).url}>
                                        <HorizontalEventCard
                                            key={event.id}
                                            event={event}
                                            className="border-1 border-emerald-300"
                                        />
                                    </Link>
                                ))
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
                                filteredUpcomingEvents.map((event) => (
                                    <Link href={user.event.show(event.id).url}>
                                        <HorizontalEventCard
                                            key={event.id}
                                            event={event}
                                            className="border-1 border-emerald-300"
                                        />
                                    </Link>
                                ))
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
