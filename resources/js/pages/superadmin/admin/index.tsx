import { AdminCard } from '@/components/ui/admin-card';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    mapAdminRecord,
    useAdminSearch,
    type AdminSearchRecord,
    type AdminSearchResult,
    type AdminStatusFilter,
} from '@/hooks/use-admin-search';
import AppLayout from '@/layouts/app-layout';
import superadmin from '@/routes/superadmin';
import { type BreadcrumbItem } from '@/types';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admins',
        href: superadmin.admin.index.url(),
    },
];

const SEARCH_RESULTS_PER_PAGE = 6;

type Admin = AdminSearchResult;

interface Props {
    admins?: AdminSearchRecord[];
}

export default function AdminsManagement({ admins = [] }: Props) {
    const adminsWithStatus: Admin[] = admins.map((admin) =>
        mapAdminRecord(admin),
    );

    const [statusFilter, setStatusFilter] = useState<AdminStatusFilter>('all');

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

    const adminsToDisplay = hasActiveSearch ? searchResults : filteredStatus;
    const showLoadingState =
        hasActiveSearch && searchLoading && adminsToDisplay.length === 0;

    const renderSearchPagination = () => {
        if (!hasActiveSearch || !searchMeta || searchMeta.last_page <= 1) {
            return null;
        }

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

        const visiblePages = Array.from(
            { length: endPage - startPage + 1 },
            (_, index) => startPage + index,
        );

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
                        {visiblePages.map((pageNumber) => (
                            <Button
                                key={pageNumber}
                                variant={
                                    pageNumber === searchMeta.current_page
                                        ? 'default'
                                        : 'outline'
                                }
                                size="sm"
                                onClick={() => setSearchPage(pageNumber)}
                                disabled={searchLoading}
                                className="min-w-[2.5rem]"
                            >
                                {pageNumber}
                            </Button>
                        ))}
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
                    {searchMeta.last_page} (total {searchMeta.total} admins)
                </p>
            </div>
        );
    };

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
                    onValueChange={(value) =>
                        setStatusFilter(value as AdminStatusFilter)
                    }
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
                                        (admin) => admin.status === 'Active',
                                    ).length
                                }
                                )
                            </TabsTrigger>

                            <TabsTrigger value="Inactive">
                                Inactive (
                                {
                                    adminsWithStatus.filter(
                                        (admin) => admin.status === 'Inactive',
                                    ).length
                                }
                                )
                            </TabsTrigger>
                        </TabsList>
                        <div className="flex w-80 flex-col gap-1">
                            <SearchInput
                                placeholder="Search admins by name, email, or phone..."
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
                            {hasActiveSearch && searchLoading && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Spinner className="h-4 w-4" />
                                    Searching admins...
                                </div>
                            )}
                        </div>
                    </div>
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
                                <AdminCard key={admin.id} {...admin} />
                            ))}
                        </div>
                        {hasActiveSearch && renderSearchPagination()}
                    </>
                ) : (
                    <div className="rounded-2xl bg-white p-12 text-center text-gray-500 shadow-sm">
                        {hasActiveSearch && debouncedQuery
                            ? `No admins found for "${debouncedQuery}".`
                            : 'No admins found.'}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
