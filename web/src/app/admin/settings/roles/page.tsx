'use client';
export const dynamic = 'force-dynamic';
import { Card, CardBody, CardHeader, Button, Input, Spinner } from '@/components/ui';
import { useState } from 'react';
import { Save, X } from 'lucide-react';

export default function RolesAndPermissionsPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Roles & Permissions</h1>
      
      <Card>
        <CardHeader>
          <h2 className="font-bold text-gray-900">Roles & Permissions</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Settings</label>
            <Input placeholder="Enter settings..." />
          </div>

          <div className="flex gap-3">
            <Button variant="primary" className="flex items-center gap-2">
              <Save className="w-5 h-5" />
              Save Changes
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}