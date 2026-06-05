'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

export interface PaginationProps {
  cursor?: string | null;
  hasMore: boolean;
  onNext: () => void;
  loading?: boolean;
  pageInfo?: {
    current: number;
    total: number;
    perPage: number;
  };
}

export function Pagination({ cursor, hasMore, onNext, loading = false, pageInfo }: PaginationProps) {
  // Cursor-based pagination (default)
  if (cursor !== undefined) {
    return (
      <div className="flex items-center justify-center gap-2 py-8">
        {hasMore && (
          <Button
            onClick={onNext}
            disabled={loading}
            loading={loading}
            className="flex items-center gap-2"
          >
            Load More
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
        {!hasMore && (
          <p className="text-sm text-gray-500">No more results</p>
        )}
      </div>
    );
  }

  // Traditional page-based pagination
  if (pageInfo) {
    const { current, total } = pageInfo;
    const canGoPrev = current > 1;
    const canGoNext = current < total;

    return (
      <div className="flex items-center justify-center gap-4 py-8">
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={!canGoPrev || loading}
          loading={loading}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <span className="text-sm text-gray-600">
          Page <span className="font-semibold">{current}</span> of{' '}
          <span className="font-semibold">{total}</span>
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={!canGoNext || loading}
          loading={loading}
          className="flex items-center gap-1"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return null;
}
