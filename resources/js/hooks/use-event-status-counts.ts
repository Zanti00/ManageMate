import { useMemo } from 'react';

export type StatusCounts<Status extends string> = Record<
    Status | 'all',
    number
>;

interface UseEventStatusCountsParams<TEvent, Status extends string> {
    baseEvents: TEvent[];
    searchResults: TEvent[];
    hasActiveSearch: boolean;
    statuses: readonly Status[];
    statusResolver?: (event: TEvent) => Status | undefined;
}

export function useEventStatusCounts<
    Status extends string,
    TEvent extends { status?: Status } = { status?: Status },
>({
    baseEvents,
    searchResults,
    hasActiveSearch,
    statuses,
    statusResolver,
}: UseEventStatusCountsParams<TEvent, Status>): StatusCounts<Status> {
    return useMemo(() => {
        const counts = statuses.reduce(
            (acc, status) => {
                acc[status] = 0;
                return acc;
            },
            { all: 0 } as StatusCounts<Status>,
        );

        const source = hasActiveSearch ? searchResults : baseEvents;

        source.forEach((event) => {
            counts.all += 1;
            const resolvedStatus =
                statusResolver?.(event) ?? event.status ?? undefined;

            if (resolvedStatus && statuses.includes(resolvedStatus)) {
                counts[resolvedStatus] += 1;
            }
        });

        return counts;
    }, [baseEvents, searchResults, hasActiveSearch, statuses, statusResolver]);
}
