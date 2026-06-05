'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader, Badge, Button, Input, Spinner } from '@/components/ui';
import { Search, Download, Eye, Edit, Trash2, AlertTriangle } from 'lucide-react';

interface Complaint {
  id: number;
  trainer_name: string;
  complainant_name: string;
  subject: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  created_at: string;
}

const mockComplaints: Complaint[] = [
  {
    id: 1,
    trainer_name: 'Alex Williams',
    complainant_name: 'John Doe',
    subject: 'Unprofessional behavior',
    description: 'Trainer was rude and dismissive during session.',
    severity: 'high',
    status: 'investigating',
    created_at: '2026-06-02',
  },
  {
    id: 2,
    trainer_name: 'Mike Johnson',
    complainant_name: 'Jane Smith',
    subject: 'No-show session',
    description: 'Trainer did not show up for scheduled session.',
    severity: 'medium',
    status: 'open',
    created_at: '2026-06-01',
  },
  {
    id: 3,
    trainer_name: 'Sarah Johnson',
    complainant_name: 'Ahmed Hassan',
    subject: 'Poor session quality',
    description: 'Session content was not aligned with syllabus.',
    severity: 'low',
    status: 'resolved',
    created_at: '2026-05-25',
  },
];

export default function TrainerComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.trainer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.complainant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || complaint.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'danger';
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'warning';
      case 'investigating': return 'info';
      case 'resolved': return 'success';
      case 'closed': return 'gray';
      default: return 'gray';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trainer Complaints</h1>
          <p className="text-gray-600 mt-2">Track and manage trainer complaints</p>
        </div>
        <Button variant="primary" className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search by trainer, complainant, or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Severity:</label>
            <div className="flex gap-2 flex-wrap">
              {['all', 'critical', 'high', 'medium', 'low'].map(severity => (
                <button
                  key={severity}
                  onClick={() => setSeverityFilter(severity)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    severityFilter === severity
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {severity.charAt(0).toUpperCase() + severity.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Status:</label>
            <div className="flex gap-2 flex-wrap">
              {['all', 'open', 'investigating', 'resolved', 'closed'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    statusFilter === status
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Complaints List */}
      <Card>
        <CardHeader>
          <h2 className="font-bold text-gray-900">
            Complaints ({filteredComplaints.length})
          </h2>
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="text-center py-12">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No complaints found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredComplaints.map(complaint => (
                <div
                  key={complaint.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{complaint.subject}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Against <span className="font-semibold">{complaint.trainer_name}</span> by <span className="font-semibold">{complaint.complainant_name}</span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={getSeverityColor(complaint.severity) as any}>
                        {complaint.severity.toUpperCase()}
                      </Badge>
                      <Badge variant={getStatusColor(complaint.status) as any}>
                        {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-3 bg-gray-50 p-3 rounded-lg">
                    {complaint.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      Reported on {complaint.created_at}
                    </p>

                    <div className="flex gap-2">
                      <Button variant="outline" className="text-sm">
                        <Eye className="w-4 h-4" />
                        Investigate
                      </Button>
                      <Button variant="outline" className="text-sm">
                        <Edit className="w-4 h-4" />
                        Update Status
                      </Button>
                      <Button variant="outline" className="text-sm">
                        <Trash2 className="w-4 h-4" />
                        Close
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
