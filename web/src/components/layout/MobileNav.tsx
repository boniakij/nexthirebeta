'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const navByRole: Record<string, NavItem[]> = {
  student: [
    { label: 'Dashboard', href: '/student/dashboard', icon: '📊' },
    { label: 'Book', href: '/trainers', icon: '📅' },
    { label: 'Sessions', href: '/student/sessions', icon: '🎥' },
    { label: 'Badges', href: '/student/badges', icon: '🏆' },
    { label: 'Profile', href: '/student/profile', icon: '👤' },
  ],
  trainer: [
    { label: 'Dashboard', href: '/trainer/dashboard', icon: '📊' },
    { label: 'Packages', href: '/trainer/packages', icon: '📦' },
    { label: 'Availability', href: '/trainer/availability', icon: '📅' },
    { label: 'Earnings', href: '/trainer/earnings', icon: '💰' },
    { label: 'Profile', href: '/trainer/profile', icon: '👤' },
  ],
  company: [
    { label: 'Dashboard', href: '/company/dashboard', icon: '📊' },
    { label: 'Campaigns', href: '/company/campaigns', icon: '🎯' },
    { label: 'Candidates', href: '/company/candidates', icon: '👥' },
    { label: 'Profile', href: '/company/profile', icon: '👤' },
  ],
};

export function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  // Only show on mobile and for authenticated users
  if (!user) return null;

  const navItems = navByRole[user.role] || [];
  if (navItems.length === 0) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="flex items-center justify-around">
        {navItems.slice(0, 5).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center flex-1 py-3 transition-colors border-t-2',
              pathname.startsWith(item.href)
                ? 'border-primary-600 text-primary-600 bg-primary-50'
                : 'border-transparent text-gray-600 hover:bg-gray-50'
            )}
          >
            <span className="text-xl mb-1">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
