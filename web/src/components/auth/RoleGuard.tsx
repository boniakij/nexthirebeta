'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Spinner } from '@/components/ui';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;

    // Not authenticated
    if (!isAuthenticated || !user) {
      const returnUrl = searchParams.get('returnUrl') || window.location.pathname;
      router.push(`/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`);
      return;
    }

    // Wrong role
    if (!allowedRoles.includes(user.role)) {
      router.push('/unauthorized');
      return;
    }

    // Email not verified
    if (!user.email_verified_at) {
      router.push('/auth/verify-email');
      return;
    }
  }, [isAuthenticated, user, isLoading, allowedRoles, router, searchParams]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="lg" />
      </div>
    );
  }

  // Not authenticated or wrong role
  if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
