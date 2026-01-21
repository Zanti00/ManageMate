import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { JSX } from 'react';

interface PaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
    className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
    isLoading = false,
    className = '',
}) => {
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }

    const from = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const to = Math.min(totalItems, currentPage * itemsPerPage);

    const pages: JSX.Element[] = [];
    for (let page = startPage; page <= endPage; page++) {
        pages.push(
            <Button
                key={page}
                variant={page === currentPage ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPageChange(page)}
                disabled={isLoading}
                className="min-w-[2.5rem]"
            >
                {page}
            </Button>
        );
    }

    return (
        <Card className={`p-4 ${className}`}>
            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                    Showing {from} to {to} of {totalItems} items
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage <= 1 || isLoading}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>
                    <div className="flex gap-1">{pages}</div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage >= totalPages || isLoading}
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default Pagination;
