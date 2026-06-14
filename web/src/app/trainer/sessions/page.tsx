'use client';

import { Card, CardBody } from '@/components/ui';
import { Video } from 'lucide-react';

export default function SessionsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Sessions</h1>

      <Card>
        <CardBody className="text-center py-12">
          <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No active sessions</p>
          <p className="text-sm text-gray-500 mt-2">Your sessions will appear here</p>
        </CardBody>
      </Card>
    </div>
  );
}
