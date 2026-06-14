'use client';

import { Card, CardBody } from '@/components/ui';
import { MessageSquare } from 'lucide-react';

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
      <Card>
        <CardBody className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No messages</p>
          <p className="text-sm text-gray-500 mt-2">Your messages will appear here</p>
        </CardBody>
      </Card>
    </div>
  );
}
