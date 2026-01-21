import Heading from '@/components/heading';
import { AdminCard } from '@/components/ui/admin-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Pagination from '@/components/ui/pagination';
import { SearchInput } from '@/components/ui/search-input';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    mapAdminRecord,
    useAdminSearch,
    type AdminSearchRecord,
    type AdminSearchResult,
    type AdminStatus,
    type AdminStatusFilter,
} from '@/hooks/use-admin-search';
import { useEventStatusCounts } from '@/hooks/use-event-status-counts';
import AppLayout from '@/layouts/app-layout';
import superadmin from '@/routes/superadmin';
import { type BreadcrumbItem } from '@/types';
import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admins',
        href: superadmin.admin.index.url(),
    },
];

const SEARCH_RESULTS_PER_PAGE = 6;
const STATUS_OPTIONS: readonly AdminStatus[] = ['Active', 'Inactive'];

type Admin = AdminSearchResult;

interface Props {
    admins?: AdminSearchRecord[];
}

export default function AdminsManagement({ admins = [] }: Props) {
    const adminsWithStatus: Admin[] = admins.map((admin) =>
        mapAdminRecord(admin),
    );

    const [statusFilter, setStatusFilter] = useState<AdminStatusFilter>('all');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter, adminsWithStatus.length]);

    const filteredStatus =
        statusFilter === 'all'
            ? adminsWithStatus
            : adminsWithStatus.filter((admin) => admin.status === statusFilter);

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
    } = useAdminSearch({
        statusFilter,
        perPage: SEARCH_RESULTS_PER_PAGE,
    });

    const totalBasePages = Math.max(
        1,
        Math.ceil(filteredStatus.length / SEARCH_RESULTS_PER_PAGE),
    );

    const paginatedBaseAdmins = filteredStatus.slice(
        (currentPage - 1) * SEARCH_RESULTS_PER_PAGE,
        currentPage * SEARCH_RESULTS_PER_PAGE,
    );

    const adminsToDisplay = hasActiveSearch
        ? searchResults
        : paginatedBaseAdmins;
    const showLoadingState =
        hasActiveSearch && searchLoading && adminsToDisplay.length === 0;

    const baseFrom =
        filteredStatus.length === 0
            ? 0
            : (currentPage - 1) * SEARCH_RESULTS_PER_PAGE + 1;
    const baseTo = Math.min(
        filteredStatus.length,
        currentPage * SEARCH_RESULTS_PER_PAGE,
    );

    const statusCounts = useEventStatusCounts<AdminStatus, Admin>({
        baseEvents: adminsWithStatus,
        searchResults,
        hasActiveSearch,
        statuses: STATUS_OPTIONS,
        statusResolver: (admin) => admin.status,
    });

    const renderSearchPagination = () => {
        if (!hasActiveSearch || !searchMeta || searchMeta.last_page <= 1) {
            return null;
        }
        return (
            <Pagination
                currentPage={searchMeta.current_page}
                totalItems={searchMeta.total}
                itemsPerPage={SEARCH_RESULTS_PER_PAGE}
                onPageChange={setSearchPage}
                isLoading={searchLoading}
            />
        );
    };

    const renderBasePagination = () => {
        if (
            hasActiveSearch ||
            filteredStatus.length === 0 ||
            totalBasePages <= 1
        ) {
            return null;
        }
        return (
            <Pagination
                currentPage={currentPage}
                totalItems={filteredStatus.length}
                itemsPerPage={SEARCH_RESULTS_PER_PAGE}
                onPageChange={setCurrentPage}
            />
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col p-6">
                <Heading
                    title="Admins"
                    description="Manage all organization administrators"
                />
                <div className="flex flex-col gap-8">
                    <div className="flex justify-end">
                        <Link href={superadmin.admin.create.url()}>
                            <Button>Create Admin</Button>
                        </Link>
                    </div>
                    <Tabs
                        value={statusFilter}
                        onValueChange={(value) =>
                            setStatusFilter(value as AdminStatusFilter)
                        }
                    >
                        <Card className="p-3">
                            <div className="flex flex-row justify-between gap-6">
                                <div className="flex flex-col gap-2">
                                    <TabsList className="h-10 flex-wrap gap-2 bg-transparent p-0">
                                        <TabsTrigger
                                            value="all"
                                            className="data-[state=active]:bg-primary data-[state=active]:text-white"
                                        >
                                            All Admins ({statusCounts.all})
                                        </TabsTrigger>
                                        {STATUS_OPTIONS.map((status) => (
                                            <TabsTrigger
                                                key={status}
                                                value={status}
                                                className="data-[state=active]:bg-primary data-[state=active]:text-white"
                                            >
                                                {status} (
                                                {statusCounts[status] ?? 0})
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex w-80 flex-col gap-1">
                                        <SearchInput
                                            placeholder="Search admins by name, email, or phone..."
                                            value={searchQuery}
                                            onChange={(event) =>
                                                setSearchQuery(
                                                    event.target.value,
                                                )
                                            }
                                        />
                                        {searchError && (
                                            <p className="text-sm text-red-500">
                                                {searchError}
                                            </p>
                                        )}
                                        {hasActiveSearch && searchLoading && (
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Spinner className="h-4 w-4" />
                                                Searching admins...
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Tabs>
                    {showLoadingState ? (
                        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white p-12 text-gray-500 shadow-sm">
                            <Spinner className="h-6 w-6" />
                            <p>Searching admins...</p>
                        </div>
                    ) : adminsToDisplay.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 gap-8">
                                {adminsToDisplay.map((admin) => (
                                    <AdminCard
                                        key={admin.id}
                                        {...admin}
                                        middle_name={
                                            admin.middle_name ?? undefined
                                        }
                                    />
                                ))}
                            </div>
                            {hasActiveSearch
                                ? renderSearchPagination()
                                : renderBasePagination()}
                        </>
                    ) : (
                        <div className="rounded-2xl bg-white p-12 text-center text-gray-500 shadow-sm">
                            {hasActiveSearch && debouncedQuery
                                ? `No admins found for "${debouncedQuery}".`
                                : 'No admins found.'}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
