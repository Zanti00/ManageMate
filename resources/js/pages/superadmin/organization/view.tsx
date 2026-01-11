import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { SummaryCard } from '@/components/ui/summary-card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { formatDateRange } from '@/utils/date-format';
import { Link } from '@inertiajs/react';
import { Mail, MapPin } from 'lucide-react';

const baseBreadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Organizations',
        href: '/superadmin/organization',
    },
];

type OrgStatus = 'Active' | 'Inactive';

type Organization = {
    id: number;
    name: string;
    type?: string;
    email?: string;
    created_at?: string;
    is_deleted?: string;
    status?: OrgStatus;
    address?: string;
};

type Event = {
    id: number;
    title: string;
    start_date: string;
    end_date: string;
    status?: string;
};

interface Props {
    organization?: Organization;
    events?: Event[];
    total_events?: string | number;
    active_events?: string | number;
    pending_events?: string | number;
    rejected_events?: string | number;
}

export default function OrganizationView({
    organization,
    events = [],
    total_events = 0,
    active_events = 0,
    pending_events = 0,
    rejected_events = 0,
}: Props) {
    if (!organization) {
        return <div className="p-6">Organization not found</div>;
    }
    const displayStatus =
        organization.is_deleted === '1'
            ? 'Inactive'
            : (organization.status ?? 'Active');

    const breadcrumbs: BreadcrumbItem[] = [
        ...baseBreadcrumbs,
        {
            title: organization.name,
            href: `/superadmin/organization/${organization.id}`,
        },
    ];

    const createdAt = organization.created_at
        ? new Date(organization.created_at).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
          })
        : 'N/A';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col gap-6 p-8">
                <Card className="flex flex-row p-6">
                    <div className="flex w-full flex-row items-center justify-between gap-6">
                        <div className="flex flex-col gap-2">
                            <CardTitle>{organization.name}</CardTitle>
                            <div className="flex flex-row flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                {organization.type && (
                                    <CardDescription>
                                        {organization.type}
                                    </CardDescription>
                                )}
                                {organization.email && (
                                    <CardDescription>
                                        {organization.email}
                                    </CardDescription>
                                )}
                            </div>
                            <div className="flex flex-row flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                <Badge
                                    variant={
                                        displayStatus === 'Inactive'
                                            ? 'rejected'
                                            : 'active'
                                    }
                                >
                                    {displayStatus}
                                </Badge>
                                <CardDescription>
                                    Joined {createdAt}
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex flex-row gap-2">
                            <Link
                                href={`/superadmin/organization/${organization.id}/edit`}
                            >
                                <Button className="bg-gray-100 text-black">
                                    Edit
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-4 gap-6">
                    <SummaryCard
                        value={String(total_events)}
                        label={'Total Events'}
                        iconBg="bg-gradient-to-br from-teal-400 to-teal-600"
                    />
                    <SummaryCard
                        value={String(active_events)}
                        label={'Active Events'}
                        iconBg="bg-gradient-to-br from-lime-400 to-lime-600"
                    />
                    <SummaryCard
                        value={String(pending_events)}
                        label={'Pending Approval'}
                        iconBg="bg-gradient-to-br from-amber-400 to-amber-600"
                    />
                    <SummaryCard
                        value={String(rejected_events)}
                        label={'Rejected Events'}
                        iconBg="bg-gradient-to-br from-rose-400 to-rose-600"
                    />
                </div>

                <Card className="p-6">
                    <CardTitle>Recent Events</CardTitle>
                    <div className="mt-4 flex flex-col gap-3">
                        {events.length === 0 ? (
                            <CardDescription>No recent events</CardDescription>
                        ) : (
                            events.map((event) => (
                                <Link
                                    key={event.id}
                                    href={`/superadmin/event/${event.id}`}
                                >
                                    <div className="flex flex-row items-center justify-between rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50">
                                        <div className="flex flex-col gap-1">
                                            <Label className="text-base font-semibold">
                                                {event.title}
                                            </Label>
                                            <Label className="text-sm font-normal text-gray-500">
                                                {formatDateRange(
                                                    event.start_date,
                                                    event.end_date,
                                                )}
                                            </Label>
                                        </div>
                                        {event.status && (
                                            <Badge
                                                variant={
                                                    event.status === 'active'
                                                        ? 'active'
                                                        : event.status ===
                                                            'pending'
                                                          ? 'pending'
                                                          : event.status ===
                                                              'rejected'
                                                            ? 'rejected'
                                                            : 'closed'
                                                }
                                            >
                                                {event.status}
                                            </Badge>
                                        )}
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </Card>

                <Card className="p-6">
                    <CardTitle>Contact Information</CardTitle>
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-700">
                        <div className="flex flex-col gap-1">
                            <div className="flex flex-row gap-2">
                                <Mail size={14} />
                                <Label className="text-xs text-gray-500">
                                    EMAIL
                                </Label>
                            </div>
                            <span>{organization.email ?? 'N/A'}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex flex-row gap-2">
                                <MapPin size={14} />
                                <Label className="text-xs text-gray-500">
                                    ADDRESS
                                </Label>
                            </div>
                            <span>{organization.address ?? 'N/A'}</span>
                        </div>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
