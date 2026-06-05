'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const badgeVariants = cva('inline-flex items-center justify-center px-2.5 py-1 text-xs font-semibold rounded-full', {
  variants: {
    variant: {
      primary: 'bg-primary-100 text-primary-700',
      success: 'bg-success-50 text-success-500',
      warning: 'bg-yellow-100 text-warning-400',
      danger: 'bg-red-100 text-danger-600',
      purple: 'bg-purple-100 text-purple-600',
      gray: 'bg-gray-100 text-gray-700',
    },
    size: {
      sm: 'text-xs px-2 py-0.5',
      md: 'text-sm px-3 py-1',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}
