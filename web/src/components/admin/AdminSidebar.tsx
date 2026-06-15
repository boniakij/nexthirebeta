'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  LayoutDashboard, Users, UserCheck, Building2, Briefcase,
  MessageSquare, Zap, Star, BarChart3, FileText, Settings,
  Lock, HelpCircle, Menu, X, ChevronDown,
  TrendingUp, DollarSign, Bell, CreditCard, Package
} from 'lucide-react';

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  href?: string;
  submenu?: Array<{
    title: string;
    href: string;
  }>;
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    href: '/admin/dashboard',
  },
  {
    title: 'User Management',
    icon: <Users className="w-5 h-5" />,
    submenu: [
      { title: 'All Users', href: '/admin/users' },
      { title: 'Students', href: '/admin/users?role=student' },
      { title: 'Trainers', href: '/admin/users?role=trainer' },
      { title: 'Companies', href: '/admin/users?role=company' },
      { title: 'Admins', href: '/admin/users?role=admin' },
      { title: 'Suspended Users', href: '/admin/users?status=suspended' },
    ],
  },
  {
    title: 'Trainer Management',
    icon: <UserCheck className="w-5 h-5" />,
    submenu: [
      { title: 'Pending Approval', href: '/admin/trainers/pending' },
      { title: 'Approved Trainers', href: '/admin/trainers/approved' },
      { title: 'Trainer Profiles', href: '/admin/trainers' },
      { title: 'Packages', href: '/admin/trainers/packages' },
      { title: 'Ratings & Reviews', href: '/admin/trainers/reviews' },
      { title: 'Complaints', href: '/admin/trainers/complaints' },
    ],
  },
  {
    title: 'Company Management',
    icon: <Building2 className="w-5 h-5" />,
    submenu: [
      { title: 'Pending KYC', href: '/admin/companies/pending' },
      { title: 'Verified Companies', href: '/admin/companies/verified' },
      { title: 'Profiles', href: '/admin/companies' },
      { title: 'Campaigns', href: '/admin/companies/campaigns' },
      { title: 'Candidates', href: '/admin/companies/candidates' },
      { title: 'Messages', href: '/admin/companies/messages' },
    ],
  },
  {
    title: 'Feed Management',
    icon: <Package className="w-5 h-5" />,
    submenu: [
      { title: 'Overview', href: '/admin/feed' },
      { title: 'Packages', href: '/admin/feed/packages' },
      { title: 'Featured', href: '/admin/feed/featured' },
      { title: 'Categories', href: '/admin/feed/categories' },
      { title: 'Countries', href: '/admin/feed/countries' },
      { title: 'Ranking Rules', href: '/admin/feed/ranking' },
    ],
  },
  {
    title: 'Bookings & Sessions',
    icon: <Briefcase className="w-5 h-5" />,
    submenu: [
      { title: 'All Bookings', href: '/admin/bookings' },
      { title: 'Upcoming Sessions', href: '/admin/bookings/upcoming' },
      { title: 'Live Sessions', href: '/admin/bookings/live' },
      { title: 'Completed', href: '/admin/bookings/completed' },
      { title: 'Cancelled', href: '/admin/bookings/cancelled' },
      { title: 'Issues', href: '/admin/bookings/issues' },
    ],
  },
  {
    title: 'Payments & Payouts',
    icon: <DollarSign className="w-5 h-5" />,
    submenu: [
      { title: 'Payment History', href: '/admin/payments' },
      { title: 'Failed Payments', href: '/admin/payments/failed' },
      { title: 'Refunds', href: '/admin/payments/refunds' },
      { title: 'Trainer Payouts', href: '/admin/payouts' },
      { title: 'Pending Payouts', href: '/admin/payouts/pending' },
      { title: 'Invoices', href: '/admin/invoices' },
      { title: 'Commission Reports', href: '/admin/reports/commission' },
    ],
  },
  {
    title: 'Gamification',
    icon: <Zap className="w-5 h-5" />,
    submenu: [
      { title: 'XP Management', href: '/admin/gamification/xp' },
      { title: 'Badges', href: '/admin/gamification/badges' },
      { title: 'Levels', href: '/admin/gamification/levels' },
      { title: 'Leaderboards', href: '/admin/gamification/leaderboard' },
      { title: 'Streaks', href: '/admin/gamification/streaks' },
      { title: 'XP History', href: '/admin/gamification/history' },
    ],
  },
  {
    title: 'Reviews & Complaints',
    icon: <Star className="w-5 h-5" />,
    submenu: [
      { title: 'Reviews', href: '/admin/reviews' },
      { title: 'Feedback', href: '/admin/feedback' },
      { title: 'Reported Reviews', href: '/admin/reviews/reported' },
      { title: 'Complaints', href: '/admin/complaints' },
      { title: 'Dispute Cases', href: '/admin/disputes' },
    ],
  },
  {
    title: 'Notifications',
    icon: <Bell className="w-5 h-5" />,
    submenu: [
      { title: 'Send Notification', href: '/admin/notifications/send' },
      { title: 'Broadcast', href: '/admin/notifications/broadcast' },
      { title: 'Email Campaigns', href: '/admin/notifications/email' },
      { title: 'SMS Alerts', href: '/admin/notifications/sms' },
      { title: 'History', href: '/admin/notifications/history' },
    ],
  },
  {
    title: 'Reports & Analytics',
    icon: <BarChart3 className="w-5 h-5" />,
    submenu: [
      { title: 'User Growth', href: '/admin/reports/users' },
      { title: 'Revenue', href: '/admin/reports/revenue' },
      { title: 'Bookings', href: '/admin/reports/bookings' },
      { title: 'Trainer Performance', href: '/admin/reports/trainers' },
      { title: 'Campaigns', href: '/admin/reports/campaigns' },
      { title: 'Payment Gateway', href: '/admin/reports/payments' },
      { title: 'Export', href: '/admin/reports/export' },
    ],
  },
  {
    title: 'Content Management',
    icon: <FileText className="w-5 h-5" />,
    submenu: [
      { title: 'Landing Page', href: '/admin/content/landing' },
      { title: 'Testimonials', href: '/admin/content/testimonials' },
      { title: 'FAQs', href: '/admin/content/faqs' },
      { title: 'Blog', href: '/admin/content/blog' },
      { title: 'Terms & Conditions', href: '/admin/content/terms' },
      { title: 'Privacy Policy', href: '/admin/content/privacy' },
    ],
  },
  {
    title: 'Security',
    icon: <Lock className="w-5 h-5" />,
    submenu: [
      { title: 'Login Logs', href: '/admin/security/logs' },
      { title: 'Activity Logs', href: '/admin/security/activity' },
      { title: 'Audit Logs', href: '/admin/security/audit' },
      { title: 'Suspicious Activity', href: '/admin/security/suspicious' },
      { title: 'Rate Limit', href: '/admin/security/rate-limit' },
    ],
  },
  {
    title: 'Support',
    icon: <HelpCircle className="w-5 h-5" />,
    submenu: [
      { title: 'Tickets', href: '/admin/support/tickets' },
      { title: 'Messages', href: '/admin/support/messages' },
      { title: 'Help Center', href: '/admin/support/help' },
      { title: 'Issues', href: '/admin/support/issues' },
    ],
  },
  {
    title: 'Settings',
    icon: <Settings className="w-5 h-5" />,
    submenu: [
      { title: 'General', href: '/admin/settings' },
      { title: 'Payment Gateway', href: '/admin/settings/payment' },
      { title: 'Video Meeting', href: '/admin/settings/video' },
      { title: 'Email & SMS', href: '/admin/settings/communication' },
      { title: 'Roles & Permissions', href: '/admin/settings/roles' },
      { title: 'Language', href: '/admin/settings/language' },
    ],
  },
];

export function AdminSidebar({ open }: { open: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isActive = (href?: string) => {
    if (!href) return false;
    const [hrefPath, hrefQuery] = href.split('?');
    if (pathname !== hrefPath) return false;

    if (hrefQuery) {
      const params = new URLSearchParams(hrefQuery);
      for (const [key, value] of params.entries()) {
        if (searchParams.get(key) !== value) return false;
      }
      return true;
    }

    // If href has no query params, but the current URL does, it shouldn't match.
    // e.g., '/admin/users' should not be active when viewing '/admin/users?role=student'
    const hasParams = Array.from(searchParams.keys()).length > 0;
    if (hasParams && hrefPath === '/admin/users') {
      return false;
    }

    return true;
  };

  const isMenuActive = (submenu?: Array<{ href: string }>) => {
    if (!submenu) return false;
    return submenu.some(item => {
      const [hrefPath] = item.href.split('?');
      return pathname.startsWith(hrefPath);
    });
  };

  const [expandedMenu, setExpandedMenu] = useState<string | null>(() => {
    const activeItem = menuItems.find(item => isMenuActive(item.submenu));
    return activeItem ? activeItem.title : null;
  });

  return (
    <aside
      className={`${
        open ? 'w-64' : 'w-20'
      } bg-gray-900 text-white transition-all duration-300 overflow-y-auto shadow-lg`}
    >
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          {open && <span className="font-bold text-lg">Admin</span>}
        </div>
      </div>

      <nav className="mt-6 space-y-2 px-3">
        {menuItems.map((item) => (
          <div key={item.title}>
            {item.href ? (
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                {item.icon}
                {open && <span className="font-medium">{item.title}</span>}
              </Link>
            ) : (
              <>
                <button
                  onClick={() =>
                    setExpandedMenu(
                      expandedMenu === item.title ? null : item.title
                    )
                  }
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isMenuActive(item.submenu)
                      ? 'bg-gray-800 text-primary-400'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  {item.icon}
                  {open && (
                    <>
                      <span className="font-medium flex-1 text-left">
                        {item.title}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          expandedMenu === item.title ? 'rotate-180' : ''
                        }`}
                      />
                    </>
                  )}
                </button>

                {open && expandedMenu === item.title && item.submenu && (
                  <div className="ml-4 mt-2 space-y-1 border-l border-gray-700">
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.href}
                        href={subitem.href}
                        className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
                          isActive(subitem.href)
                            ? 'bg-primary-600 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800'
                        }`}
                      >
                        {subitem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
