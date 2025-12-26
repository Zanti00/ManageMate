import * as React from 'react';

import { cn } from "@/lib/utils"
import { Card, CardDescription, CardTitle } from './card';
import { time } from 'console';
import { UserRound, Phone, Calendar } from 'lucide-react';
import { Badge } from './badge';
import { Label } from './label';
import { Button } from './button';
import superadmin from '@/routes/superadmin';
import { Link } from '@inertiajs/react';

type FilterValues = 'Active' | 'Inactive';

type Props = {
    id: number;
    status: FilterValues;
    orgName: string;
    orgEmail: string;
    admin: string;
    adminContact: string;
    adminJoinDate: Date;
    totalEvent: number;
    activeEvent: number;
    pendingEvent: number;
    attendees: number;
}

function AdminCard({id, status, orgName, orgEmail, admin, adminContact, adminJoinDate, totalEvent, activeEvent, pendingEvent, attendees}: Props){
    return (
        <Card>
            <div className="flex flex-col p-6 gap-4">
                <div className="flex flex-row gap-4">
                    <img
                        src="https://lh3.googleusercontent.com/BKN1q6592B6RRjUCzycpYLMsRXezlbNW7lbJ3Y1xDUuzdJ_D9tbhr9GHk2_STmHBcIZYu4mNpu1cGgTU=w544-h544-l90-rj"
                        alt="Profile"
                        className="h-12 w-12 rounded-full border-white bg-gray-200"
                    />
                    <div className="flex flex-col flex-2 gap-1 justify-center">
                        <CardTitle>{orgName}</CardTitle>
                        <CardDescription>{orgEmail}</CardDescription>
                    </div>
                    {status === 'Active' 
                    ? <Badge className="h-5" variant="approved">{status}</Badge> 
                    : <Badge className="h-5" variant="rejected">{status}</Badge>}
                </div>
                <div className="flex flex-row gap-3">
                    <UserRound size={14}></UserRound>
                    <CardDescription>{admin}</CardDescription>
                </div>
                <div className="flex flex-row gap-3">
                    <Phone size={14}></Phone>
                    <CardDescription>{adminContact}</CardDescription>
                </div>
                <div className="flex flex-row gap-3">
                    <Calendar size={14}></Calendar>
                    <CardDescription>{adminJoinDate.toLocaleDateString()}</CardDescription>
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
                <Link href={superadmin.admins.view.url()}>
                    <Button className='w-full'>View Details</Button>
                </Link>
            </div>
        </Card>
    )
}

export { AdminCard}