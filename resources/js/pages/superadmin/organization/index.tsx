import { Button } from '@/components/ui/button';
import { OrganizationCard } from '@/components/ui/organization-card';
import { SearchInput } from '@/components/ui/search-input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import superadmin from '@/routes/superadmin';
import { BreadcrumbItem } from '@/types';
import { Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Organizations',
        href: '/superadmin/organization',
    },
];

type OrgStatus = 'Active' | 'Inactive';

type Organization = {
    id: number;
    name: string;
    abbreviation?: string;
    type?: string;
    email?: string;
    created_at?: string;
    is_deleted?: string;
    status?: OrgStatus;
    total_events?: number;
};

interface Props {
    organizations?: Organization[];
}

export default function OrganizationIndex({ organizations = [] }: Props) {
    const organizationsWithStatus = useMemo(
        () =>
            organizations.map((organization) => ({
                ...organization,
                status:
                    organization.is_deleted === '1'
                        ? 'Inactive'
                        : (organization.status ?? 'Active'),
            })),
        [organizations],
    );

    const [statusFilter, setStatusFilter] = useState<'all' | OrgStatus>('all');

    const filteredOrganizations = useMemo(
        () =>
            statusFilter === 'all'
                ? organizationsWithStatus
                : organizationsWithStatus.filter(
                      (org) => org.status === statusFilter,
                  ),
        [organizationsWithStatus, statusFilter],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-row items-center justify-end">
                    <Link href={superadmin.organization.create.url()}>
                        <Button>Create Organization</Button>
                    </Link>
                </div>
                <div className="flex flex-row">
                    <div className="flex w-full flex-row gap-100 rounded-2xl bg-white p-3 shadow-sm">
                        <Tabs
                            value={statusFilter}
                            onValueChange={(value) =>
                                setStatusFilter(value as any)
                            }
                        >
                            <TabsList className="h-10 gap-3">
                                <TabsTrigger value="all">
                                    All ({organizations.length})
                                </TabsTrigger>
                                <TabsTrigger value="Active">
                                    Active (
                                    {
                                        organizationsWithStatus.filter(
                                            (org) => org.status === 'Active',
                                        ).length
                                    }
                                    )
                                </TabsTrigger>
                                <TabsTrigger value="Inactive">
                                    Inactive (
                                    {
                                        organizationsWithStatus.filter(
                                            (org) => org.status === 'Inactive',
                                        ).length
                                    }
                                    )
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <SearchInput placeholder="Search organizations" />
                    </div>
                </div>

                {filteredOrganizations.length === 0 ? (
                    <div className="flex items-center justify-center rounded-lg bg-white py-12 text-gray-500">
                        No organizations found
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredOrganizations.map((organization) => (
                            <OrganizationCard
                                key={organization.id}
                                {...organization}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
