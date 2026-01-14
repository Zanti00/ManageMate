import { Card, CardDescription } from './card'
import { Button } from './button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu'
import { Eye, Calendar, Clock3, MapPin, MoreVertical, UsersRound } from 'lucide-react'
import admin from '@/routes/admin';

import {cn} from '@/lib/utils';
import { Badge } from './badge';
import { Link, router, usePage } from '@inertiajs/react';
import { formatDateRange, formatTimeRange } from '@/utils/date-format';

type EventStatus = 'Pending' | 'Active' | 'Rejected' | 'Closed' | 'Upcoming' | 'Ongoing';

type Event = {
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
    status?: EventStatus;
    hideStatus?: boolean;
    image_path?: string | null;
    images?: string[];
};

type Props = Event & {
    viewDetailsHref?: string;
    className?: string;
};

function EventCard({ hideStatus = false, viewDetailsHref, className, ...event }: Props) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { auth } = usePage().props as any;
    const showActions = !auth?.user?.isUser;

    // Use custom href if provided, otherwise default to admin route
    const detailsLink = viewDetailsHref || admin.event.show(event.id).url;

    const handleEdit = () => {
        router.visit(admin.event.edit(event.id).url);
    };

    const handleDelete = () => {
        router.delete(admin.event.destroy(event.id).url, {
            preserveScroll: true,
        });
    };

    const primaryImage = event.images?.find((image) => !!image) ?? event.image_path ?? null;
    const imageUrl = primaryImage
        ? primaryImage.startsWith('http')
            ? primaryImage
            : `/storage/${primaryImage}`
        : '/images/event-placeholder.png';
    
    return (
        <Card className={cn("flex-col pt-0 hover:shadow-xl", className)}
            >
                        <div className="relative h-48 w-full overflow-hidden rounded-t-2xl">
                            <img
                                src={imageUrl}
                                alt={event.title}
                                className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                            {!hideStatus && event.status && (
                                <div className="absolute top-2 right-2 pr-2 pt-2">
                                    {event.status === 'Pending' && (
                                        <Badge variant="pending">Pending</Badge>
                                    )}
                                    {event.status === 'Active' && (
                                        <Badge variant="active">Active</Badge>
                                    )}
                                    {event.status === 'Rejected' && (
                                        <Badge variant="rejected">Rejected</Badge>
                                    )}
                                    {event.status === 'Closed' && (
                                        <Badge variant="closed">Closed</Badge>
                                    )}
                                    {event.status === 'Upcoming' && (
                                        <Badge variant="active">Upcoming</Badge>
                                    )}
                                    {event.status === 'Ongoing' && (
                                        <Badge variant="pending">Ongoing</Badge>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col px-4 gap-4">
                            <div className="flex flex-row">
                                <strong className="text-lg w-full truncate">
                                {event.title}
                                </strong>
                            </div>
                            <div className="flex flex-col gap-y-3">
                                <div className="flex flex-row gap-x-2 items-center">
                                    <Calendar size={12}/>
                                    <p className='text-xs text-gray-800'>
                                        {formatDateRange(event.start_date, event.end_date)}
                                    </p>
                                </div>
                                <div className="flex flex-row gap-x-2 items-center">
                                    <Clock3 size={12}/>
                                    <p className='text-xs text-gray-800'>
                                        {formatTimeRange(event.start_time, event.end_time)}
                                    </p>
                                </div>
                                <div className="flex flex-row gap-x-2 items-center">
                                    <MapPin size={12}/>
                                    <p className='text-xs text-gray-800'>{event.location}</p>
                                </div>
                                <div className="flex flex-row gap-x-2 items-center">
                                    <UsersRound size={12}/>
                                    <p className='text-xs text-gray-800'>{event.attendees || '0'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Link href={detailsLink} className="flex-1">
                                    <Button className="border border-foreground w-full">
                                        <Eye />
                                        View Details
                                    </Button>
                                </Link>
                                {showActions && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button className="border border-foreground bg-white px-3" aria-label="More options">
                                                <MoreVertical className='stroke-foreground' />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onSelect={handleEdit}>Edit</DropdownMenuItem>
                                            <DropdownMenuItem
                                                variant="destructive"
                                                onSelect={handleDelete}
                                            >
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>
                        </div>
                    </Card>
    )
}

export {EventCard}