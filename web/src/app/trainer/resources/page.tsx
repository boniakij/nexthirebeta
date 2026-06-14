'use client';

import { Card, CardBody } from '@/components/ui';
import { BookMarked } from 'lucide-react';

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Resources</h1>
      <Card>
        <CardBody className="text-center py-12">
          <BookMarked className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No resources available</p>
          <p className="text-sm text-gray-500 mt-2">Check back soon for training materials and guides</p>
        </CardBody>
      </Card>
    </div>
  );
}
