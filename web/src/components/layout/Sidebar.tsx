'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui';

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const navByRole: Record<string, NavItem[]> = {
  student: [
    { label: 'Dashboard', href: '/student/dashboard', icon: '📊' },
    { label: 'Book Interview', href: '/trainers', icon: '📅' },
    { label: 'My Sessions', href: '/student/sessions', icon: '🎥' },
    { label: 'Evaluations', href: '/student/evaluations', icon: '📋' },
    { label: 'Badges', href: '/student/badges', icon: '🏆' },
    { label: 'Leaderboard', href: '/leaderboard', icon: '🌍' },
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
  admin: [
    { label: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
    { label: 'Users', href: '/admin/users', icon: '👥' },
    { label: 'Trainers', href: '/admin/trainers', icon: '🎓' },
    { label: 'Companies', href: '/admin/companies', icon: '🏢' },
    { label: 'Reports', href: '/admin/reports', icon: '📈' },
  ],
};

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open = true, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();

  if (!user) return null;

  const navItems = navByRole[user.role] || [];

  return (
    <div
      className={cn(
        'fixed md:sticky left-0 top-16 md:top-0 h-[calc(100vh-4rem)] md:h-screen w-64 bg-white border-r border-gray-200 overflow-y-auto transition-transform md:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <div className="p-4 space-y-6">
        {/* Nav Items */}
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onClose?.()}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-btn font-medium transition-colors',
                pathname.startsWith(item.href)
                  ? 'bg-primary-100 text-primary-600'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Info at Bottom */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center gap-3 px-2">
            <Avatar src={user.profile_photo || undefined} name={user.email} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
