'use client';

import React from 'react';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  } | React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  const isButtonAction = action && typeof action === 'object' && 'label' in action && 'onClick' in action;

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && <div className="text-6xl mb-4">{icon}</div>}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-gray-600 mb-6 max-w-md">{description}</p>}
      {action && (
        isButtonAction ? (
          <button
            onClick={(action as any).onClick}
            className="px-4 py-2 bg-primary-600 text-white rounded-btn font-medium hover:bg-primary-700"
          >
            {(action as any).label}
          </button>
        ) : (
          <div>{action as React.ReactNode}</div>
        )
      )}
    </div>
  );
}
