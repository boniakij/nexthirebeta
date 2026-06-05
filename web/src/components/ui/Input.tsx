'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, icon, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {props.required && <span className="text-danger-600 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          className={cn(
            'w-full px-3 py-2 border rounded-btn text-sm focus:outline-none focus:ring-2 transition-colors',
            icon ? 'pl-10' : '',
            error ? 'border-danger-600 focus:ring-danger-600' : 'border-gray-300 focus:ring-primary-600',
            className
          )}
          {...props}
        />
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{icon}</div>}
      </div>
      {error && <p className="text-xs text-danger-600 mt-1">{error}</p>}
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  )
);

Input.displayName = 'Input';

export { Input };
