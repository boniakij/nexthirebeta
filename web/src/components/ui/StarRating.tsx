'use client';

import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  count?: number;
  editable?: boolean;
  onRate?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-4xl',
};

export function StarRating({
  rating,
  count,
  editable = false,
  onRate,
  size = 'md',
}: StarRatingProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => editable && onRate?.(star)}
            className={cn(
              sizeClasses[size],
              editable && 'cursor-pointer hover:opacity-80',
              !editable && 'cursor-default'
            )}
            disabled={!editable}
          >
            {star <= Math.round(rating) ? '⭐' : '☆'}
          </button>
        ))}
      </div>
      {count !== undefined && (
        <span className="text-sm text-gray-600 ml-2">
          {rating.toFixed(1)} ({count})
        </span>
      )}
    </div>
  );
}
