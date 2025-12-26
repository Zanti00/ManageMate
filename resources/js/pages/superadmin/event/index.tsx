import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { SearchInput } from '@/components/ui/search-input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import superadmin from '@/routes/superadmin';
import { BreadcrumbItem } from '@/types';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Event Page',
        href: superadmin.event.index().url,
    },
];

type EventStatus = 'pending' | 'approved' | 'rejected' | 'closed';

type Event = {
    id: number;
    name: string;
    organization: string;
    date: string;
    attendees: string;
    status: EventStatus;
    submitted: string;
};

const events: Event[] = [
    {
        id: 1,
        name: 'Tech Innovation Summit 2024',
        organization: 'Engineering Dept',
        date: 'June 15, 2024',
        attendees: '250 / 300',
        status: 'pending',
        submitted: '2 days ago',
    },
    {
        id: 2,
        name: 'Annual Art Exhibition',
        organization: 'Arts & Sciences',
        date: 'June 18, 2024',
        attendees: '180 / 200',
        status: 'pending',
        submitted: '1 day ago',
    },
    {
        id: 3,
        name: 'Business Leadership Conference',
        organization: 'Business School',
        date: 'June 20, 2024',
        attendees: '320 / 350',
        status: 'approved',
        submitted: '5 days ago',
    },
];

export default function SuperAdminEvent() {
    const [statusFilter, setStatusFilter] = useState<'all' | EventStatus>(
        'all',
    );

    const filteredEvents =
        statusFilter === 'all'
            ? events
            : events.filter((e) => e.status === statusFilter);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col gap-6 p-6">
                <div className="grid grid-cols-5 gap-4">
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
                    <Card className="flex flex-col">
                        <CardTitle>8</CardTitle>
                        <CardDescription>Total Events</CardDescription>
                    </Card>
                </div>
                <Tabs
                    value={statusFilter}
                    onValueChange={(value) => setStatusFilter(value as any)}
                >
                    <div className="flex flex-row gap-48 rounded-2xl bg-white p-3 shadow-sm">
                        <TabsList className="h-10 gap-3">
                            <TabsTrigger value="all">
                                All ({events.length})
                            </TabsTrigger>

                            <TabsTrigger value="pending">
                                Pending (
                                {
                                    events.filter((e) => e.status === 'pending')
                                        .length
                                }
                                )
                            </TabsTrigger>

                            <TabsTrigger value="approved">
                                Approved (
                                {
                                    events.filter(
                                        (e) => e.status === 'approved',
                                    ).length
                                }
                                )
                            </TabsTrigger>

                            <TabsTrigger value="rejected">
                                Rejected (
                                {
                                    events.filter(
                                        (e) => e.status === 'rejected',
                                    ).length
                                }
                                )
                            </TabsTrigger>

                            <TabsTrigger value="closed">
                                Closed (
                                {
                                    events.filter((e) => e.status === 'closed')
                                        .length
                                }
                                )
                            </TabsTrigger>
                        </TabsList>
                        <SearchInput></SearchInput>
                    </div>
                </Tabs>
                <table className="w-full overflow-hidden rounded-2xl text-sm shadow-md">
                    <thead className="bg-foreground/95">
                        <tr className="text-left text-background">
                            <th className="p-4">Event</th>
                            <th>Organization</th>
                            <th>Date & Time</th>
                            <th>Attendees</th>
                            <th>Status</th>
                            <th>Submitted</th>
                        </tr>
                    </thead>

                    <tbody className="bg-card">
                        {filteredEvents.map((event) => (
                            <tr key={event.id} className="hover:bg-gray-100">
                                <td className="p-4 font-medium">
                                    {event.name}
                                </td>
                                <td>{event.organization}</td>
                                <td>{event.date}</td>
                                <td>{event.attendees}</td>
                                <td>
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs ${
                                            event.status === 'pending'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : event.status === 'approved'
                                                  ? 'bg-green-100 text-green-700'
                                                  : event.status === 'rejected'
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
            </div>
        </AppLayout>
    );
}
