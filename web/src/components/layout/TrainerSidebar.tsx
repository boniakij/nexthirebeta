'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  Package,
  Calendar,
  Video,
  BookOpen,
  Star,
  MessageSquare,
  TrendingUp,
  BookMarked,
  Bell,
  HelpCircle,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react';

const menuItems = [
  { id: 1, label: 'Dashboard', href: '/trainer/dashboard', icon: LayoutDashboard },
  { id: 2, label: 'My Profile', href: '/trainer/profile', icon: User },
  { id: 3, label: 'Packages', href: '/trainer/packages', icon: Package },
  { id: 4, label: 'Availability', href: '/trainer/availability', icon: Calendar },
  { id: 5, label: 'Sessions', href: '/trainer/sessions', icon: Video },
  { id: 6, label: 'Bookings', href: '/trainer/bookings', icon: BookOpen },
  { id: 7, label: 'Evaluations', href: '/trainer/evaluations', icon: Star },
  { id: 8, label: 'Messages', href: '/trainer/messages', icon: MessageSquare },
  { id: 9, label: 'Reviews', href: '/trainer/reviews', icon: Star },
  { id: 10, label: 'Earnings', href: '/trainer/earnings', icon: TrendingUp },
  { id: 11, label: 'Resources', href: '/trainer/resources', icon: BookMarked },
  { id: 12, label: 'Notifications', href: '/trainer/notifications', icon: Bell },
  { id: 13, label: 'Support', href: '/trainer/support', icon: HelpCircle },
  { id: 14, label: 'Settings', href: '/trainer/settings', icon: Settings },
];

export function TrainerSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname.startsWith(href.split('/').slice(0, 3).join('/'));
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 overflow-y-auto">
      {/* Logo */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
        <Link href="/trainer/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">NH</span>
          </div>
          <span className="font-bold text-lg text-gray-900">NextHire</span>
        </Link>
      </div>

      {/* Main Menu */}
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                active
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-4">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all text-sm font-medium">
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
