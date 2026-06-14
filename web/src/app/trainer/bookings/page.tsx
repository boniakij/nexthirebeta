'use client';

import { Card, CardBody, CardHeader } from '@/components/ui';
import { BookOpen } from 'lucide-react';

export default function BookingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>

      <Card>
        <CardBody className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No bookings yet</p>
          <p className="text-sm text-gray-500 mt-2">Your bookings will appear here</p>
        </CardBody>
      </Card>
    </div>
  );
}
