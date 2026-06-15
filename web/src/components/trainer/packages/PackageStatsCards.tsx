'use client';

import { Card, CardBody } from '@/components/ui';
import { Package, FileText, TrendingUp, Wallet } from 'lucide-react';

interface PackageStatsCardsProps {
  activeCount: number;
  draftCount: number;
  totalBookings: number;
  revenue: number;
}

export default function PackageStatsCards({
  activeCount,
  draftCount,
  totalBookings,
  revenue,
}: PackageStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardBody className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Active Packages</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{activeCount}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Package className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Draft Packages</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{draftCount}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Bookings</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalBookings}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Package Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">৳{revenue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg">
              <Wallet className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
