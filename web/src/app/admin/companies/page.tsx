'use client';

import { useState, useEffect, Suspense } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Card, CardBody, CardHeader, Badge, Button, Input, Spinner } from '@/components/ui';
import { adminApi } from '@/lib/api/admin';
import { Search, CheckCircle2, Building2 } from 'lucide-react';

interface Company {
  id: number;
  name: string;
  email: string;
  industry: string;
  kyc_status: 'verified' | 'pending' | 'rejected';
  active_campaigns: number;
  total_hires: number;
  created_at: string;
}

function CompaniesContent() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKYCStatus, setSelectedKYCStatus] = useState('');

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data } = await adminApi.getCompanies();
        setCompanies(data.data || []);
        setFilteredCompanies(data.data || []);
      } catch (error) {
        console.error('Failed to fetch companies:', error);
        const mockCompanies = getMockCompanies();
        setCompanies(mockCompanies);
        setFilteredCompanies(mockCompanies);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    let filtered = companies;

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedKYCStatus) {
      filtered = filtered.filter((c) => c.kyc_status === selectedKYCStatus);
    }

    setFilteredCompanies(filtered);
  }, [searchQuery, selectedKYCStatus, companies]);

  const handleVerifyKYC = async (companyId: number) => {
    try {
      await adminApi.verifyCompanyKYC(companyId);
      setCompanies(
        companies.map((c) => (c.id === companyId ? { ...c, kyc_status: 'verified' as const } : c))
      );
    } catch (error) {
      console.error('Failed to verify KYC:', error);
    }
  };

  const handleRejectKYC = async (companyId: number) => {
    if (confirm('Are you sure you want to reject this company KYC?')) {
      try {
        await adminApi.rejectCompanyKYC(companyId);
        setCompanies(
          companies.map((c) => (c.id === companyId ? { ...c, kyc_status: 'rejected' as const } : c))
        );
      } catch (error) {
        console.error('Failed to reject KYC:', error);
      }
    }
  };

  const getKYCBadgeColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'danger';
      default:
        return 'primary';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  const kycPendingCount = companies.filter((c) => c.kyc_status === 'pending').length;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">🏢 Companies Management</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardBody className="text-center">
            <p className="text-sm text-gray-600 mb-1">Total Companies</p>
            <p className="text-2xl font-bold text-gray-900">{companies.length}</p>
          </CardBody>
        </Card>
        <Card className="border-2 border-green-200 bg-green-50">
          <CardBody className="text-center">
            <p className="text-sm text-green-900 mb-1">KYC Verified</p>
            <p className="text-2xl font-bold text-green-600">
              {companies.filter((c) => c.kyc_status === 'verified').length}
            </p>
          </CardBody>
        </Card>
        <Card className="border-2 border-yellow-200 bg-yellow-50">
          <CardBody className="text-center">
            <p className="text-sm text-yellow-900 mb-1">KYC Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{kycPendingCount}</p>
          </CardBody>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-bold text-gray-900">Filters</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or email..."
                  className="pl-9"
                />
              </div>
            </div>

            {/* KYC Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">KYC Status</label>
              <select
                value={selectedKYCStatus}
                onChange={(e) => setSelectedKYCStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-btn focus:outline-none focus:ring-2 focus:ring-primary-600"
              >
                <option value="">All Statuses</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Companies Table */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-bold text-gray-900">Companies ({filteredCompanies.length})</h2>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Industry</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">KYC Status</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Campaigns</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Hires</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Joined</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.map((company) => (
                  <tr key={company.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-3 px-4 font-medium text-gray-900">{company.name}</td>
                    <td className="py-3 px-4 text-gray-600">{company.email}</td>
                    <td className="py-3 px-4 text-gray-700">{company.industry}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={getKYCBadgeColor(company.kyc_status)}>
                        {company.kyc_status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-gray-900">
                      {company.active_campaigns}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-gray-900">
                      {company.total_hires}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-600">
                      {new Date(company.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {company.kyc_status === 'pending' && (
                        <div className="flex gap-2 justify-center">
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleVerifyKYC(company.id)}
                          >
                            Verify
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleRejectKYC(company.id)}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default function CompaniesPage() {
  return (
    <RoleGuard allowedRoles={['admin']}>
      <DashboardLayout>
        <Suspense
          fallback={
            <div className="flex justify-center items-center min-h-screen">
              <Spinner size="lg" />
            </div>
          }
        >
          <CompaniesContent />
        </Suspense>
      </DashboardLayout>
    </RoleGuard>
  );
}

function getMockCompanies(): Company[] {
  return [
    { id: 1, name: 'Tech Corp Inc', email: 'hr@techcorp.com', industry: 'Software', kyc_status: 'verified', active_campaigns: 3, total_hires: 12, created_at: '2026-03-05' },
    { id: 2, name: 'DataWorks Solutions', email: 'contact@dataworks.com', industry: 'Data Analytics', kyc_status: 'verified', active_campaigns: 2, total_hires: 8, created_at: '2026-04-10' },
    { id: 3, name: 'CloudFirst Ltd', email: 'jobs@cloudfirst.com', industry: 'Cloud Services', kyc_status: 'pending', active_campaigns: 1, total_hires: 3, created_at: '2026-05-15' },
    { id: 4, name: 'Design Studio Pro', email: 'hiring@designstudio.com', industry: 'Design', kyc_status: 'verified', active_campaigns: 2, total_hires: 6, created_at: '2026-02-20' },
    { id: 5, name: 'SecureNet Systems', email: 'careers@securenet.com', industry: 'Cybersecurity', kyc_status: 'rejected', active_campaigns: 0, total_hires: 0, created_at: '2026-05-28' },
    { id: 6, name: 'FinTech Innovations', email: 'hr@fintech.com', industry: 'Finance', kyc_status: 'pending', active_campaigns: 1, total_hires: 2, created_at: '2026-05-30' },
  ];
}
