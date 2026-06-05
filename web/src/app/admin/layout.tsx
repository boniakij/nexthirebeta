'use client';

import { useState } from 'react';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <AdminSidebar open={sidebarOpen} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

          {/* Content Area */}
          <main className="flex-1 overflow-auto bg-gray-100">
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
