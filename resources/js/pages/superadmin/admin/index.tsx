import { AdminCard } from '@/components/ui/admin-card';
import { Button } from '@/components/ui/button';
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
        href: superadmin.admin.index.url(),
    },
];

type FilterValues = 'Active' | 'Inactive';

type Admin = {
    id: number;
    first_name: string;
    middle_name?: string;
    last_name: string;
    email: string;
    phone_number: string;
    created_at: string;
    is_deleted: string;
    attendees?: string;
    status?: FilterValues;
    total_events?: string;
    pending_events?: string;
    active_events?: string;
    rejected_events?: string;
};

interface Props {
    admins?: Admin[];
}

export default function AdminsManagement({ admins = [] }: Props) {
    const adminsWithStatus = admins.map((admin) => ({
        ...admin,
        status:
            admin.is_deleted === '0'
                ? ('Active' as FilterValues)
                : ('Inactive' as FilterValues),
    }));

    const [statusFilter, setStatusFilter] = useState<'all' | FilterValues>(
        'all',
    );

    const filteredStatus =
        statusFilter === 'all'
            ? adminsWithStatus
            : adminsWithStatus.filter((e) => e.status === statusFilter);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col gap-8 p-6">
                <div className="flex flex-row place-content-end">
                    <Link href={superadmin.admin.create.url()}>
                        <Button>Create Admin</Button>
                    </Link>
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
                                    adminsWithStatus.filter(
                                        (e) => e.status === 'Active',
                                    ).length
                                }
                                )
                            </TabsTrigger>

                            <TabsTrigger value="Inactive">
                                Inactive (
                                {
                                    adminsWithStatus.filter(
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
                        <AdminCard key={admin.id} {...admin} />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
