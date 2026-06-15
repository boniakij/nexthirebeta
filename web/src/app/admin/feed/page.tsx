'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardBody, CardHeader, Button, Badge } from '@/components/ui';
import { TrendingUp, Package, Star, Eye, AlertCircle, Globe } from 'lucide-react';

interface FeedStat {
  label: string;
  value: number;
  description?: string;
  icon: React.ReactNode;
  color: string;
}

interface Activity {
  id: number;
  trainer: string;
  package: string;
  action: string;
  time: string;
  timestamp: number;
}

const MOCK_STATS: FeedStat[] = [
  {
    label: 'Total Feed Packages',
    value: 1240,
    icon: <Package className="w-6 h-6" />,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    label: 'Featured Packages',
    value: 18,
    icon: <Star className="w-6 h-6" />,
    color: 'bg-yellow-50 text-yellow-600',
  },
  {
    label: 'Hidden Packages',
    value: 32,
    icon: <Eye className="w-6 h-6" />,
    color: 'bg-gray-50 text-gray-600',
  },
  {
    label: 'Pending Review',
    value: 14,
    icon: <AlertCircle className="w-6 h-6" />,
    color: 'bg-orange-50 text-orange-600',
  },
  {
    label: 'Reported Packages',
    value: 6,
    icon: <AlertCircle className="w-6 h-6" />,
    color: 'bg-red-50 text-red-600',
  },
  {
    label: 'Active Countries',
    value: 5,
    icon: <Globe className="w-6 h-6" />,
    color: 'bg-green-50 text-green-600',
  },
];

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 1,
    trainer: 'Rahim Uddin',
    package: 'HR Mock Interview',
    action: 'Published',
    time: '1h ago',
    timestamp: Date.now() - 60 * 60 * 1000,
  },
  {
    id: 2,
    trainer: 'Nusrat Jahan',
    package: 'CV Review Package',
    action: 'Featured',
    time: '2h ago',
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
  },
  {
    id: 3,
    trainer: 'Karim Ahmed',
    package: 'Technical Interview',
    action: 'Reported',
    time: '3h ago',
    timestamp: Date.now() - 3 * 60 * 60 * 1000,
  },
  {
    id: 4,
    trainer: 'Priya Singh',
    package: 'Data Structures Guide',
    action: 'Approved',
    time: '4h ago',
    timestamp: Date.now() - 4 * 60 * 60 * 1000,
  },
  {
    id: 5,
    trainer: 'Aisha Khan',
    package: 'Leadership Interview',
    action: 'Rejected',
    time: '5h ago',
    timestamp: Date.now() - 5 * 60 * 60 * 1000,
  },
];

const QUICK_ACTIONS = [
  {
    title: 'Review Pending Packages',
    description: '14 packages waiting for approval',
    href: '/admin/feed/packages?status=pending_review',
    color: 'bg-orange-500 hover:bg-orange-600',
  },
  {
    title: 'Manage Featured Packages',
    description: '18 packages currently featured',
    href: '/admin/feed/featured',
    color: 'bg-yellow-500 hover:bg-yellow-600',
  },
  {
    title: 'View Reported Packages',
    description: '6 packages with reports',
    href: '/admin/feed/reports',
    color: 'bg-red-500 hover:bg-red-600',
  },
  {
    title: 'Feed Ranking Settings',
    description: 'Configure feed algorithm',
    href: '/admin/feed/ranking',
    color: 'bg-purple-500 hover:bg-purple-600',
  },
];

function getActionBadgeColor(action: string) {
  switch (action.toLowerCase()) {
    case 'published':
      return 'success';
    case 'featured':
      return 'primary';
    case 'reported':
      return 'danger';
    case 'approved':
      return 'success';
    case 'rejected':
      return 'danger';
    case 'hidden':
      return 'secondary';
    default:
      return 'primary';
  }
}

export default function AdminFeedOverview() {
  const [activities] = useState<Activity[]>(MOCK_ACTIVITIES);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Feed Management</h1>
        <p className="text-gray-600 mt-1">Control packages shown on the public Feed page</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_STATS.map((stat) => (
          <Card key={stat.label} className="border-0 shadow-sm hover:shadow-md transition">
            <CardBody className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value.toLocaleString()}</p>
                  {stat.description && (
                    <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                  )}
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {QUICK_ACTIONS.map((action) => (
            <Link key={action.title} href={action.href}>
              <Button
                className={`w-full h-full py-6 px-4 text-left ${action.color} text-white transition justify-start flex flex-col items-start`}
              >
                <span className="font-bold text-lg">{action.title}</span>
                <span className="text-sm opacity-90 mt-1">{action.description}</span>
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Latest Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Latest Feed Activity</h2>
          <Link href="/admin/feed/packages">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>

        <Card className="border-0 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Trainer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Package</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {activities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{activity.trainer}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600">{activity.package}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getActionBadgeColor(activity.action)}>
                        {activity.action}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{activity.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Additional Management Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-0 shadow-sm">
          <CardBody className="p-6">
            <h3 className="font-bold text-gray-900 mb-2">Feed Categories</h3>
            <p className="text-sm text-gray-600 mb-4">Manage package categories (HR Interview, Technical, etc.)</p>
            <Link href="/admin/feed/categories">
              <Button variant="outline" size="sm" className="w-full">
                Manage Categories
              </Button>
            </Link>
          </CardBody>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardBody className="p-6">
            <h3 className="font-bold text-gray-900 mb-2">Country Settings</h3>
            <p className="text-sm text-gray-600 mb-4">Control feed visibility by country and currency</p>
            <Link href="/admin/feed/countries">
              <Button variant="outline" size="sm" className="w-full">
                Manage Countries
              </Button>
            </Link>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
