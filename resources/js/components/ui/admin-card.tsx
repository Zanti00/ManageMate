import * as React from 'react';

import { cn } from "@/lib/utils"
import { Card, CardDescription, CardTitle } from './card';
import { time } from 'console';
import { UserRound, Phone, Calendar, Mail } from 'lucide-react';
import { Badge } from './badge';
import { Label } from './label';
import { Button } from './button';
import superadmin from '@/routes/superadmin';
import { Link } from '@inertiajs/react';

type FilterValues = 'Active' | 'Inactive';

type Admin = {
    id: number;
    first_name: string;
    middle_name?: string;
    last_name: string;
    email: string;
    phone_number: string;
    created_at: string;
    is_deleted: number | boolean | string;
    totalEvent?: number;
    activeEvent?: number;
    pendingEvent?: number;
    attendees?: number;
    status?: FilterValues;
};

type Props = Admin;

function AdminCard({
    id,
    first_name,
    middle_name,
    last_name,
    email,
    phone_number,
    created_at,
    totalEvent = 0,
    activeEvent = 0,
    pendingEvent = 0,
    attendees = 0,
    status = 'Active',
}: Props) {
    return (
        <Card>
            <div className="flex flex-col px-6 gap-4">
                <div className="flex flex-row gap-4 ">
                    <img
                        src="https://lh3.googleusercontent.com/BKN1q6592B6RRjUCzycpYLMsRXezlbNW7lbJ3Y1xDUuzdJ_D9tbhr9GHk2_STmHBcIZYu4mNpu1cGgTU=w544-h544-l90-rj"
                        alt="Profile"
                        className="h-12 w-12 rounded-full border-white bg-gray-200"
                    />
                    <div className="flex flex-col flex-2">
                        <div className="flex flex-row gap-3">
                            <CardTitle>{`${first_name} ${middle_name ? middle_name + ' ' : ''}${last_name}`.trim()}</CardTitle>
                        </div>
                        <div className="flex flex-row gap-3">
                            <CardDescription>{email}</CardDescription>
                        </div>
                    </div>
                    {status === 'Active' 
                        ? <Badge className="h-5" variant="approved">{status}</Badge> 
                        : <Badge className="h-5" variant="rejected">{status}</Badge>}
                </div>
                <div className="flex flex-row gap-3">
                    <Phone size={14}></Phone>
                    <CardDescription>{phone_number}</CardDescription>
                </div>
                <div className="flex flex-row gap-3">
                    <Calendar size={14}></Calendar>
                    <CardDescription>
                        {new Date(created_at).toLocaleDateString()}
                    </CardDescription>
                </div>
                <Card className='flex flex-row shadow-none bg-gray-100 p-4 items-center justify-center'>
                    <div className="flex flex-col text-center">
                        <CardTitle className='text-black'>{totalEvent}</CardTitle>
                        <CardDescription>Total Events</CardDescription>
                    </div>
                    <div className="flex flex-col text-center">
                        <CardTitle className='text-approved'>{activeEvent}</CardTitle>
                        <CardDescription>Active Events</CardDescription>
                    </div>
                    <div className="flex flex-col text-center">
                        <CardTitle className='text-pending'>{pendingEvent}</CardTitle>
                        <CardDescription>Pending Events</CardDescription>
                    </div>
                    <div className="flex flex-col text-center">
                        <CardTitle>{attendees}</CardTitle>
                        <CardDescription>Attendees</CardDescription>
                    </div>
                </Card>
                <Link href={superadmin.admin.show.url(id)}>
                    <Button className='w-full'>View Details</Button>
                </Link>
            </div>
        </Card>
    )
}

export { AdminCard }