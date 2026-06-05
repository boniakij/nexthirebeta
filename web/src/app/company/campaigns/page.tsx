'use client';

import { useState, useEffect, Suspense } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Card, CardBody, CardHeader, Badge, Button, Modal, Input, Tabs, Spinner } from '@/components/ui';
import { companyApi } from '@/lib/api/company';
import { Plus, Users, Clock } from 'lucide-react';

interface Campaign {
  id: number;
  title: string;
  job_role: string;
  description: string;
  domain: string;
  status: 'active' | 'draft' | 'archived';
  candidate_count: number;
  created_at: string;
}

function CampaignsContent() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activeTab, setActiveTab] = useState('active');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    job_role: '',
    description: '',
    domain: 'Software Engineering',
    requirements: [] as string[],
  });
  const [newRequirement, setNewRequirement] = useState('');

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const { data } = await companyApi.getCampaigns();
        setCampaigns(data.data || []);
      } catch (error) {
        console.error('Failed to fetch campaigns:', error);
        setCampaigns(getMockCampaigns());
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const handleCreateCampaign = async () => {
    try {
      await companyApi.createCampaign(formData);
      setShowModal(false);
      setFormData({ title: '', job_role: '', description: '', domain: 'Software Engineering', requirements: [] });
      // Refresh campaigns
    } catch (error) {
      console.error('Failed to create campaign:', error);
    }
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData({
        ...formData,
        requirements: [...formData.requirements, newRequirement],
      });
      setNewRequirement('');
    }
  };

  const removeRequirement = (idx: number) => {
    setFormData({
      ...formData,
      requirements: formData.requirements.filter((_, i) => i !== idx),
    });
  };

  const filteredCampaigns = campaigns.filter(
    (c) => c.status === (activeTab === 'active' ? 'active' : activeTab === 'draft' ? 'draft' : 'archived')
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">🎯 Hiring Campaigns</h1>
        <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Campaign
        </Button>
      </div>

      <Tabs
        tabs={[
          { id: 'active', label: '✓ Active' },
          { id: 'draft', label: '📝 Draft' },
          { id: 'archived', label: '📦 Archived' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {filteredCampaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCampaigns.map((campaign) => (
            <Card key={campaign.id} className="hover:shadow-card-hover transition">
              <CardBody>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900">{campaign.title}</h3>
                  <Badge variant={campaign.status === 'active' ? 'success' : 'warning'}>
                    {campaign.status}
                  </Badge>
                </div>

                <p className="text-gray-600 mb-3">{campaign.description}</p>

                <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    Role: {campaign.job_role}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    {campaign.candidate_count} candidates
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={() => {
                    // Navigate to pipeline
                  }}
                >
                  Manage Campaign
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardBody className="text-center py-12">
            <p className="text-gray-600 mb-4">No {activeTab} campaigns</p>
            {activeTab === 'active' && (
              <Button onClick={() => setShowModal(true)}>Create Campaign</Button>
            )}
          </CardBody>
        </Card>
      )}

      {/* Create Campaign Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create Campaign"
      >
        <div className="space-y-4">
          <Input
            label="Campaign Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Senior Backend Engineer"
          />

          <Input
            label="Job Role"
            value={formData.job_role}
            onChange={(e) => setFormData({ ...formData, job_role: e.target.value })}
            placeholder="e.g., Backend Developer"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the role and requirements..."
              className="w-full px-3 py-2 border border-gray-300 rounded-btn focus:outline-none focus:ring-2 focus:ring-primary-600"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
            <select
              value={formData.domain}
              onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-btn focus:outline-none focus:ring-2 focus:ring-primary-600"
            >
              <option>Software Engineering</option>
              <option>Data & AI</option>
              <option>DevOps</option>
              <option>Design</option>
              <option>Product Management</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Requirements (Tags)</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
                placeholder="Add requirement and press Enter"
              />
              <Button onClick={addRequirement} size="sm">Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.requirements.map((req, idx) => (
                <Badge key={idx} variant="primary" className="cursor-pointer">
                  {req}
                  <button
                    onClick={() => removeRequirement(idx)}
                    className="ml-2 hover:opacity-70"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleCreateCampaign} variant="primary" className="flex-1">
              Create Campaign
            </Button>
            <Button onClick={() => setShowModal(false)} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function CampaignsPage() {
  return (
    <RoleGuard allowedRoles={['company']}>
      <DashboardLayout>
        <Suspense
          fallback={
            <div className="flex justify-center items-center min-h-screen">
              <Spinner size="lg" />
            </div>
          }
        >
          <CampaignsContent />
        </Suspense>
      </DashboardLayout>
    </RoleGuard>
  );
}

function getMockCampaigns(): Campaign[] {
  return [
    {
      id: 1,
      title: 'Senior Backend Engineer',
      job_role: 'Backend',
      description: 'Looking for experienced backend engineer with Node.js expertise',
      domain: 'Software Engineering',
      status: 'active',
      candidate_count: 12,
      created_at: '2026-06-01',
    },
    {
      id: 2,
      title: 'Frontend Developer',
      job_role: 'Frontend',
      description: 'React specialist needed for our product team',
      domain: 'Software Engineering',
      status: 'active',
      candidate_count: 8,
      created_at: '2026-06-02',
    },
    {
      id: 3,
      title: 'Data Science Intern',
      job_role: 'Data Science',
      description: 'Internship opportunity for data science students',
      domain: 'Data & AI',
      status: 'draft',
      candidate_count: 0,
      created_at: '2026-06-03',
    },
  ];
}
