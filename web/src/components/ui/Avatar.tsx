'use client';

import Image from 'next/image';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const avatarVariants = cva('relative rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold', {
  variants: {
    size: {
      xs: 'h-6 w-6 text-xs',
      sm: 'h-8 w-8 text-sm',
      md: 'h-10 w-10 text-base',
      lg: 'h-12 w-12 text-lg',
      xl: 'h-16 w-16 text-xl',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

interface AvatarProps extends VariantProps<typeof avatarVariants> {
  src?: string;
  name?: string;
  className?: string;
  alt?: string;
}

export function Avatar({ src, name = '', size, className }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={cn(avatarVariants({ size }), className)}>
      {src ? (
        <Image src={src} alt={name} fill className="object-cover rounded-full" />
      ) : (
        <span>{initials || '?'}</span>
      )}
    </div>
  );
}
