import { Button } from '@/components/ui/button';
import { OrganizationCard } from '@/components/ui/organization-card';
import { SearchInput } from '@/components/ui/search-input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEventStatusCounts } from '@/hooks/use-event-status-counts';
import { usePaginatedSearch } from '@/hooks/use-paginated-search';
import AppLayout from '@/layouts/app-layout';
import superadmin from '@/routes/superadmin';
import { BreadcrumbItem } from '@/types';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { JSX, useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Organizations',
        href: '/superadmin/organization',
    },
];

const SEARCH_RESULTS_PER_PAGE = 9;

const STATUS_OPTIONS = ['Active', 'Inactive'] as const;

type OrgStatus = (typeof STATUS_OPTIONS)[number];

type Organization = {
    id: number;
    name: string;
    abbreviation?: string;
    type?: string;
    email?: string;
    created_at?: string;
    is_deleted?: string | number | boolean;
    status?: OrgStatus;
    total_events?: number;
};

type OrganizationWithStatus = Omit<Organization, 'status' | 'is_deleted'> & {
    status: OrgStatus;
    is_deleted?: string;
};

interface Props {
    organizations?: Organization[];
}

const resolveOrganizationStatus = (organization: Organization): OrgStatus => {
    const flag = organization.is_deleted;
    return flag === '1' || flag === 1 || flag === true
        ? 'Inactive'
        : ((organization.status as OrgStatus | undefined) ?? 'Active');
};

export default function OrganizationIndex({ organizations = [] }: Props) {
    const organizationsWithStatus = useMemo<OrganizationWithStatus[]>(
        () =>
            organizations.map((organization) => {
                const status = resolveOrganizationStatus(organization);
                const is_deleted =
                    organization.is_deleted !== undefined
                        ? String(organization.is_deleted)
                        : undefined;

                return {
                    ...organization,
                    status,
                    is_deleted,
                };
            }),
        [organizations],
    );

    const [statusFilter, setStatusFilter] = useState<'all' | OrgStatus>('all');

    const {
        searchQuery,
        setSearchQuery,
        debouncedQuery,
        results: searchResults,
        meta: searchMeta,
        setPage: setSearchPage,
        isLoading: searchLoading,
        error: searchError,
        hasActiveSearch,
    } = usePaginatedSearch<Organization, OrganizationWithStatus>({
        endpoint: superadmin.organization.search().url,
        perPage: SEARCH_RESULTS_PER_PAGE,
        buildParams: () =>
            statusFilter !== 'all' ? { status: statusFilter } : undefined,
        mapResult: (organization) => {
            const status = resolveOrganizationStatus(organization);
            const is_deleted =
                organization.is_deleted !== undefined
                    ? String(organization.is_deleted)
                    : undefined;

            return {
                ...organization,
                status,
                is_deleted,
            };
        },
        dependencies: [statusFilter],
    });

    const filteredOrganizations = useMemo(
        () =>
            statusFilter === 'all'
                ? organizationsWithStatus
                : organizationsWithStatus.filter(
                      (org) => org.status === statusFilter,
                  ),
        [organizationsWithStatus, statusFilter],
    );

    const organizationsToDisplay = hasActiveSearch
        ? searchResults
        : filteredOrganizations;

    const statusCounts = useEventStatusCounts<
        OrgStatus,
        OrganizationWithStatus
    >({
        baseEvents: organizationsWithStatus,
        searchResults,
        hasActiveSearch,
        statuses: STATUS_OPTIONS,
        statusResolver: (organization) => organization.status,
    });

    const renderSearchPagination = () => {
        if (!hasActiveSearch || !searchMeta || searchMeta.last_page <= 1) {
            return null;
        }

        const pages: JSX.Element[] = [];
        const maxVisible = 5;
        let startPage = Math.max(
            1,
            searchMeta.current_page - Math.floor(maxVisible / 2),
        );
        let endPage = Math.min(
            searchMeta.last_page,
            startPage + maxVisible - 1,
        );

        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        for (let page = startPage; page <= endPage; page++) {
            pages.push(
                <Button
                    key={page}
                    variant={
                        page === searchMeta.current_page ? 'default' : 'outline'
                    }
                    size="sm"
                    onClick={() => setSearchPage(page)}
                    disabled={searchLoading}
                    className="min-w-[2.5rem]"
                >
                    {page}
                </Button>,
            );
        }

        return (
            <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            setSearchPage((prev) => Math.max(1, prev - 1))
                        }
                        disabled={searchMeta.current_page <= 1 || searchLoading}
                    >
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Previous
                    </Button>
                    <div className="flex flex-wrap justify-center gap-1">
                        {pages}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            setSearchPage((prev) =>
                                Math.min(searchMeta.last_page, prev + 1),
                            )
                        }
                        disabled={
                            searchMeta.current_page >= searchMeta.last_page ||
                            searchLoading
                        }
                    >
                        Next
                        <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                </div>
                <p className="text-center text-sm text-muted-foreground">
                    Showing page {searchMeta.current_page} of{' '}
                    {searchMeta.last_page} (total {searchMeta.total}{' '}
                    organizations)
                </p>
            </div>
        );
    };

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
                                    All ({statusCounts.all})
                                </TabsTrigger>
                                {STATUS_OPTIONS.map((status) => (
                                    <TabsTrigger key={status} value={status}>
                                        {status} ({statusCounts[status]})
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>
                        <div className="flex w-80 flex-col gap-1">
                            <SearchInput
                                placeholder="Search organizations"
                                value={searchQuery}
                                onChange={(event) =>
                                    setSearchQuery(event.target.value)
                                }
                            />
                            {searchError && (
                                <p className="text-sm text-red-500">
                                    {searchError}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {hasActiveSearch ? (
                    searchLoading ? (
                        <div className="flex items-center justify-center rounded-2xl bg-white py-12 text-muted-foreground">
                            Searching organizations...
                        </div>
                    ) : organizationsToDisplay.length > 0 ? (
                        <>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {organizationsToDisplay.map((organization) => (
                                    <OrganizationCard
                                        key={organization.id}
                                        {...organization}
                                        is_deleted={
                                            organization.is_deleted !==
                                            undefined
                                                ? String(
                                                      organization.is_deleted,
                                                  )
                                                : undefined
                                        }
                                    />
                                ))}
                            </div>
                            {renderSearchPagination()}
                        </>
                    ) : (
                        <div className="flex items-center justify-center rounded-2xl bg-white py-12 text-gray-500">
                            {`No organizations found for "${debouncedQuery}".`}
                        </div>
                    )
                ) : organizationsToDisplay.length === 0 ? (
                    <div className="flex items-center justify-center rounded-2xl bg-white py-12 text-gray-500">
                        No organizations found
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {organizationsToDisplay.map((organization) => (
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
