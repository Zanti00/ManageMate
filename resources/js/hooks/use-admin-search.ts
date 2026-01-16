import superadmin from '@/routes/superadmin';
import { usePaginatedSearch } from './use-paginated-search';

type NumericLike = string | number | null | undefined;

export type AdminStatus = 'Active' | 'Inactive';
export type AdminStatusFilter = 'all' | AdminStatus;

export type AdminSearchRecord = {
    id: number;
    first_name: string;
    middle_name?: string | null;
    last_name: string;
    email: string;
    phone_number: string;
    created_at: string;
    is_deleted: string | number | boolean;
    total_events?: NumericLike;
    pending_events?: NumericLike;
    active_events?: NumericLike;
    rejected_events?: NumericLike;
};

export type AdminSearchResult = AdminSearchRecord & {
    status: AdminStatus;
    total_events: string;
    pending_events: string;
    active_events: string;
    rejected_events: string;
};

export type UseAdminSearchOptions = {
    statusFilter: AdminStatusFilter;
    perPage?: number;
};

const normalizeStat = (value: NumericLike): string => {
    if (typeof value === 'number') {
        return value.toString();
    }

    if (typeof value === 'string' && value.trim() !== '') {
        return value;
    }

    return '0';
};

const resolveStatus = (isDeleted: string | number | boolean): AdminStatus => {
    if (typeof isDeleted === 'boolean') {
        return isDeleted ? 'Inactive' : 'Active';
    }

    return String(isDeleted) === '0' ? 'Active' : 'Inactive';
};

export const mapAdminRecord = (
    admin: AdminSearchRecord,
): AdminSearchResult => ({
    ...admin,
    status: resolveStatus(admin.is_deleted),
    total_events: normalizeStat(admin.total_events),
    pending_events: normalizeStat(admin.pending_events),
    active_events: normalizeStat(admin.active_events),
    rejected_events: normalizeStat(admin.rejected_events),
});

export function useAdminSearch({
    statusFilter,
    perPage = 6,
}: UseAdminSearchOptions) {
    return usePaginatedSearch<AdminSearchRecord, AdminSearchResult>({
        endpoint: superadmin.admin.search().url,
        perPage,
        buildParams: () =>
            statusFilter !== 'all'
                ? {
                      status: statusFilter,
                  }
                : undefined,
        mapResult: mapAdminRecord,
        dependencies: [statusFilter],
    });
}
