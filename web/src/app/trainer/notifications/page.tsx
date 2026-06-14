'use client';

import { Card, CardBody } from '@/components/ui';
import { Bell } from 'lucide-react';

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
      <Card>
        <CardBody className="text-center py-12">
          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No new notifications</p>
          <p className="text-sm text-gray-500 mt-2">You're all caught up</p>
        </CardBody>
      </Card>
    </div>
  );
}
