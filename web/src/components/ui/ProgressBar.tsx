'use client';

import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max: number;
  color?: 'primary' | 'success' | 'warning' | 'purple';
  label?: string;
  showValue?: boolean;
  animate?: boolean;
}

const colorClasses = {
  primary: 'bg-primary-600',
  success: 'bg-success-500',
  warning: 'bg-warning-400',
  purple: 'bg-purple-600',
};

export function ProgressBar({
  value,
  max,
  color = 'primary',
  label,
  showValue = true,
  animate = true,
}: ProgressBarProps) {
  const percentage = (value / max) * 100;

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
          {showValue && <span className="text-sm text-gray-600">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            animate && 'duration-500 ease-out',
            colorClasses[color]
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}
