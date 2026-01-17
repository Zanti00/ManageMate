import {
    Dispatch,
    SetStateAction,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

type PaginatedMeta = {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
};

type PaginatedResponse<T> = {
    data?: T[];
    meta?: Partial<PaginatedMeta>;
};

type ParamsBuilderContext = {
    query: string;
    page: number;
    perPage: number;
};

type ParamsBuilder = (
    context: ParamsBuilderContext,
) => Record<string, string | number | undefined | null> | undefined;

type UsePaginatedSearchOptions<TInput, TMapped> = {
    endpoint: string;
    perPage?: number;
    debounceMs?: number;
    buildParams?: ParamsBuilder;
    mapResult?: (item: TInput) => TMapped;
    dependencies?: unknown[];
    enabled?: boolean;
};

type UsePaginatedSearchResult<T> = {
    searchQuery: string;
    setSearchQuery: Dispatch<SetStateAction<string>>;
    debouncedQuery: string;
    results: T[];
    meta: PaginatedMeta | null;
    page: number;
    setPage: Dispatch<SetStateAction<number>>;
    isLoading: boolean;
    error: string | null;
    hasActiveSearch: boolean;
    resetSearch: () => void;
};

export function usePaginatedSearch<TInput = unknown, TMapped = TInput>({
    endpoint,
    perPage = 6,
    debounceMs = 400,
    buildParams,
    mapResult,
    dependencies = [],
    enabled = true,
}: UsePaginatedSearchOptions<
    TInput,
    TMapped
>): UsePaginatedSearchResult<TMapped> {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [results, setResults] = useState<TMapped[]>([]);
    const [meta, setMeta] = useState<PaginatedMeta | null>(null);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const buildParamsRef = useRef(buildParams);
    const mapResultRef = useRef(mapResult);

    useEffect(() => {
        buildParamsRef.current = buildParams;
    }, [buildParams]);

    useEffect(() => {
        mapResultRef.current = mapResult;
    }, [mapResult]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery.trim());
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [searchQuery, debounceMs]);

    useEffect(() => {
        setPage(1);
    }, [debouncedQuery, ...dependencies]);

    useEffect(() => {
        if (!enabled || debouncedQuery === '') {
            setResults([]);
            setMeta(null);
            setError(null);
            setIsLoading(false);

            return;
        }

        const controller = new AbortController();

        async function fetchResults() {
            setIsLoading(true);
            setError(null);

            try {
                const params = new URLSearchParams({
                    query: debouncedQuery,
                    page: String(page),
                    per_page: String(perPage),
                });

                const extraParams = buildParamsRef.current?.({
                    query: debouncedQuery,
                    page,
                    perPage,
                });

                if (extraParams) {
                    Object.entries(extraParams).forEach(([key, value]) => {
                        if (
                            value === undefined ||
                            value === null ||
                            value === ''
                        ) {
                            return;
                        }

                        params.set(key, String(value));
                    });
                }

                const response = await fetch(
                    `${endpoint}?${params.toString()}`,
                    {
                        headers: {
                            Accept: 'application/json',
                            'X-Requested-With': 'XMLHttpRequest',
                        },
                        signal: controller.signal,
                    },
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch search results.');
                }

                const payload: PaginatedResponse<TInput> =
                    await response.json();
                const mapper = mapResultRef.current;
                const mappedData = (payload.data ?? []).map((item) =>
                    mapper ? mapper(item) : (item as unknown as TMapped),
                );

                setResults(mappedData);

                const total = payload.meta?.total ?? mappedData.length;
                const resolvedMeta: PaginatedMeta = {
                    current_page: payload.meta?.current_page ?? page,
                    per_page: payload.meta?.per_page ?? perPage,
                    total,
                    last_page:
                        payload.meta?.last_page ??
                        Math.max(
                            1,
                            Math.ceil(
                                Math.max(total, 1) / Math.max(perPage, 1),
                            ),
                        ),
                };

                setMeta(resolvedMeta);
            } catch (err) {
                if ((err as Error).name === 'AbortError') {
                    return;
                }

                setError((err as Error).message ?? 'Failed to search.');
                setResults([]);
                setMeta(null);
            } finally {
                setIsLoading(false);
            }
        }

        fetchResults();

        return () => controller.abort();
    }, [endpoint, perPage, debouncedQuery, page, enabled, ...dependencies]);

    const hasActiveSearch = useMemo(
        () => debouncedQuery.length > 0,
        [debouncedQuery],
    );

    const resetSearch = () => {
        setSearchQuery('');
        setDebouncedQuery('');
        setResults([]);
        setMeta(null);
        setError(null);
        setIsLoading(false);
        setPage(1);
    };

    return {
        searchQuery,
        setSearchQuery,
        debouncedQuery,
        results,
        meta,
        page,
        setPage,
        isLoading,
        error,
        hasActiveSearch,
        resetSearch,
    };
}
