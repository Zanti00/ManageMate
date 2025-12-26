import { AdminCard } from '@/components/ui/admin-card';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { SearchInput } from '@/components/ui/search-input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import superadmin from '@/routes/superadmin';
import { BreadcrumbItem } from '@/types';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admins',
        href: superadmin.admins.index.url(),
    },
];

type FilterValues = 'Active' | 'Inactive';

type Admin = {
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
};

const admins: Admin[] = [
    {
        id: 1,
        orgName: 'CommITs',
        orgEmail: 'commitspupqc@test.com',
        admin: 'Vanessa Reuteras',
        adminContact: '09770626462',
        adminJoinDate: new Date('2024-01-15'),
        totalEvent: 5,
        activeEvent: 3,
        pendingEvent: 2,
        attendees: 150,
        status: 'Active',
    },
    {
        id: 2,
        orgName: 'Tech Club',
        orgEmail: 'techclub@test.com',
        admin: 'John Doe',
        adminContact: '09123456789',
        adminJoinDate: new Date('2024-02-20'),
        totalEvent: 3,
        activeEvent: 1,
        pendingEvent: 1,
        attendees: 80,
        status: 'Active',
    },
    {
        id: 3,
        orgName: 'Science Society',
        orgEmail: 'science@test.com',
        admin: 'Jane Smith',
        adminContact: '09987654321',
        adminJoinDate: new Date('2023-12-10'),
        totalEvent: 2,
        activeEvent: 0,
        pendingEvent: 0,
        attendees: 45,
        status: 'Inactive',
    },
];

export default function AdminsManagement() {
    const [statusFilter, setStatusFilter] = useState<'all' | FilterValues>(
        'all',
    );

    const filteredStatus =
        statusFilter === 'all'
            ? admins
            : admins.filter((e) => e.status === statusFilter);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col gap-8 p-6">
                <div className="flex flex-row place-content-end">
                    <Link href={superadmin.admins.create.url()}>
                        <Button>Create Admin</Button>
                    </Link>
                </div>
                <div className="grid grid-cols-4 gap-4">
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
                    <div className="flex flex-row gap-100 rounded-2xl bg-white p-3 shadow-sm">
                        <TabsList className="h-10 gap-3">
                            <TabsTrigger value="all">
                                All ({admins.length})
                            </TabsTrigger>

                            <TabsTrigger value="Active">
                                Active (
                                {
                                    admins.filter((e) => e.status === 'Active')
                                        .length
                                }
                                )
                            </TabsTrigger>

                            <TabsTrigger value="Inactive">
                                Inactive (
                                {
                                    admins.filter(
                                        (e) => e.status === 'Inactive',
                                    ).length
                                }
                                )
                            </TabsTrigger>
                        </TabsList>
                        <SearchInput></SearchInput>
                    </div>
                </Tabs>
                <div className="grid grid-cols-2 gap-8">
                    {filteredStatus.map((admin) => (
                        <AdminCard
                            key={admin.id}
                            id={admin.id}
                            status={admin.status}
                            orgName={admin.orgName}
                            orgEmail={admin.orgEmail}
                            admin={admin.admin}
                            adminContact={admin.adminContact}
                            adminJoinDate={admin.adminJoinDate}
                            totalEvent={admin.totalEvent}
                            activeEvent={admin.activeEvent}
                            pendingEvent={admin.pendingEvent}
                            attendees={admin.attendees}
                        ></AdminCard>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
