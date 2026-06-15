'use client';

import Link from 'next/link';
import { Card, Badge, Button } from '@/components/ui';
import { TrainerPackage } from '@/types/trainerPackage';
import { Edit2, Copy, Eye, MoreVertical } from 'lucide-react';

interface PackageTableProps {
  packages: TrainerPackage[];
  onDuplicate: (id: number) => void;
  onHide: (id: number) => void;
}

function getStatusColor(status: string) {
  switch (status) {
    case 'active':
      return 'success';
    case 'draft':
      return 'primary';
    case 'pending_review':
      return 'warning';
    case 'hidden':
      return 'gray';
    case 'deactivated':
      return 'gray';
    case 'rejected':
      return 'danger';
    default:
      return 'primary';
  }
}

function formatStatus(status: string) {
  return status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1);
}

export default function PackageTable({ packages, onDuplicate, onHide }: PackageTableProps) {
  if (packages.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <div className="p-12 text-center">
          <p className="text-gray-500 mb-4">No packages found</p>
          <Link href="/trainer/packages/create">
            <Button>Create First Package</Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Package</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Bookings</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {packages.map((pkg) => (
              <tr key={pkg.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <Link href={`/trainer/packages/${pkg.id}`}>
                    <p className="font-semibold text-gray-900 hover:text-primary-600">{pkg.title}</p>
                  </Link>
                  <p className="text-xs text-gray-500">{pkg.duration_minutes} min • {pkg.session_mode}</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{pkg.category}</td>
                <td className="px-6 py-4 font-semibold text-gray-900">
                  {pkg.currency} {pkg.price.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <Badge variant={getStatusColor(pkg.status) as any} className="capitalize">
                    {formatStatus(pkg.status)}
                  </Badge>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900">{pkg.total_bookings}</td>
                <td className="px-6 py-4 flex items-center gap-2">
                  <Link href={`/trainer/packages/${pkg.id}`}>
                    <button className="p-2 hover:bg-gray-100 rounded transition" title="View">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                  </Link>
                  <Link href={`/trainer/packages/${pkg.id}/edit`}>
                    <button className="p-2 hover:bg-gray-100 rounded transition" title="Edit">
                      <Edit2 className="w-4 h-4 text-gray-600" />
                    </button>
                  </Link>
                  <button
                    onClick={() => onDuplicate(pkg.id)}
                    className="p-2 hover:bg-gray-100 rounded transition"
                    title="Duplicate"
                  >
                    <Copy className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded transition" title="More">
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
