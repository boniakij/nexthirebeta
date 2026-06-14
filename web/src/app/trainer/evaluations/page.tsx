'use client';

import { Card, CardBody } from '@/components/ui';
import { Star } from 'lucide-react';

export default function EvaluationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Evaluations</h1>
      <Card>
        <CardBody className="text-center py-12">
          <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No evaluations yet</p>
          <p className="text-sm text-gray-500 mt-2">Your evaluations will appear here</p>
        </CardBody>
      </Card>
    </div>
  );
}
