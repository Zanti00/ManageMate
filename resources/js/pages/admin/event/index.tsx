import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardTitle } from '@/components/ui/card';
import { EventCard } from '@/components/ui/card-event';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { SearchInput } from '@/components/ui/search-input';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import { type BreadcrumbItem } from '@/types';
import { Link } from '@inertiajs/react';
import { ChevronDownIcon } from 'lucide-react';
import React from 'react';

const { create } = admin.event;

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Event',
        href: admin.event.index().url,
    },
];

export default function AdminEvent() {
    const [open, setOpen] = React.useState(false);
    const [date, setDate] = React.useState<Date | undefined>(undefined);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col gap-y-5 p-4">
                <Card className="shadow-md">
                    <div className="flex flex-row items-center justify-between px-4">
                        <div className="flex flex-row">
                            <Button>
                                <Link href={create().url}>Create Event</Link>
                            </Button>
                        </div>
                        <div className="flex flex-row items-center gap-2">
                            <Button>Sort by</Button>
                            <div className="flex flex-col gap-3">
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="default"
                                            id="date"
                                            className="w-[100%] justify-between font-normal"
                                        >
                                            {date
                                                ? date.toLocaleDateString()
                                                : 'Select date'}
                                            <ChevronDownIcon />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto overflow-hidden p-0"
                                        align="start"
                                    >
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            captionLayout="dropdown"
                                            onSelect={(date) => {
                                                setDate(date);
                                                setOpen(false);
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <SearchInput
                                className="w-64"
                                placeholder="Search..."
                            />
                        </div>
                    </div>
                </Card>
                <Card className="px-4 shadow-md">
                    <div className="flex flex-row justify-between">
                        <CardTitle>All Events</CardTitle>
                        <div className="flex flex-row gap-x-1">
                            <Badge variant="pending">Pending</Badge>
                            <Badge variant="approved">Approved</Badge>
                            <Badge variant="rejected">Rejected</Badge>
                            <Badge variant="closed">Closed</Badge>
                        </div>
                    </div>
                    <EventCard></EventCard>
                </Card>
            </div>
        </AppLayout>
    );
}
