'use client';

import { useState, useEffect, Suspense } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Card, CardBody, CardHeader, Badge, Button, Input, Spinner, Avatar } from '@/components/ui';
import { companyApi } from '@/lib/api/company';
import { Search, Filter, Star, Award, Plus } from 'lucide-react';

interface Candidate {
  id: number;
  name: string;
  email: string;
  level: number;
  xp: number;
  rating: number;
  domain: string;
  status: string;
  badges_count: number;
}

function CandidatesContent() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [minRating, setMinRating] = useState(0);

  const domains = ['Software Engineering', 'Data & AI', 'DevOps', 'Design', 'Cybersecurity'];
  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const { data } = await companyApi.getCandidates();
        setCandidates(data.data || []);
        setFilteredCandidates(data.data || []);
      } catch (error) {
        console.error('Failed to fetch candidates:', error);
        const mockCandidates = getMockCandidates();
        setCandidates(mockCandidates);
        setFilteredCandidates(mockCandidates);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  useEffect(() => {
    let filtered = candidates;

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Domain filter
    if (selectedDomain) {
      filtered = filtered.filter((c) => c.domain === selectedDomain);
    }

    // Level filter
    if (selectedLevel) {
      filtered = filtered.filter((c) => c.level === getLevelNumber(selectedLevel));
    }

    // Rating filter
    filtered = filtered.filter((c) => c.rating >= minRating);

    setFilteredCandidates(filtered);
  }, [searchQuery, selectedDomain, selectedLevel, minRating, candidates]);

  const handleAddCandidate = async (candidateId: number) => {
    try {
      // API call to add to campaign
      alert('Candidate added to campaign!');
    } catch (error) {
      console.error('Failed to add candidate:', error);
    }
  };

  const getLevelNumber = (level: string) => {
    const levelMap: Record<string, number> = {
      'Beginner': 1,
      'Intermediate': 2,
      'Advanced': 3,
      'Expert': 4,
    };
    return levelMap[level] || 0;
  };

  const getLevelLabel = (level: number) => {
    const labels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
    return labels[level - 1] || 'Unknown';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">🔍 Search Talent Pool</h1>

      {/* Filters */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
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

            {/* Domain */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-btn focus:outline-none focus:ring-2 focus:ring-primary-600"
              >
                <option value="">All Domains</option>
                {domains.map((domain) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
            </div>

            {/* Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-btn focus:outline-none focus:ring-2 focus:ring-primary-600"
              >
                <option value="">All Levels</option>
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Rating</label>
              <div className="flex gap-2">
                {[0, 3, 3.5, 4, 4.5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setMinRating(rating)}
                    className={`px-3 py-2 rounded-btn text-sm font-medium transition ${
                      minRating === rating
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {rating === 0 ? 'All' : `${rating}+`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          <span className="font-bold">{filteredCandidates.length}</span> candidates found
        </p>
      </div>

      {/* Candidates Grid */}
      {filteredCandidates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map((candidate) => (
            <Card key={candidate.id} className="hover:shadow-card-hover transition">
              <CardBody>
                <div className="flex items-start gap-3 mb-3">
                  <Avatar name={candidate.name} size="lg" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900">{candidate.name}</h3>
                    <p className="text-xs text-gray-600 truncate">{candidate.email}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium text-gray-700">{candidate.rating}/5.0</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pb-3 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <Badge variant="primary">{candidate.domain}</Badge>
                    <Badge variant="purple">{getLevelLabel(candidate.level)}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-gray-50 rounded p-2">
                      <p className="text-xs text-gray-600">XP</p>
                      <p className="font-bold text-gray-900">{candidate.xp.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <p className="text-xs text-gray-600">Badges</p>
                      <p className="font-bold text-gray-900">{candidate.badges_count}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-3">
                  <Button
                    onClick={() => handleAddCandidate(candidate.id)}
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </Button>
                  <Button variant="outline" className="flex-1">
                    View Profile
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardBody className="text-center py-12">
            <p className="text-gray-600 mb-4">No candidates match your filters</p>
            <Button onClick={() => { setSearchQuery(''); setSelectedDomain(''); setSelectedLevel(''); setMinRating(0); }}>
              Reset Filters
            </Button>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

export default function CandidatesPage() {
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
          <CandidatesContent />
        </Suspense>
      </DashboardLayout>
    </RoleGuard>
  );
}

function getMockCandidates(): Candidate[] {
  return [
    { id: 1, name: 'Arjun Kumar', email: 'arjun@example.com', level: 5, xp: 12500, rating: 4.2, domain: 'Software Engineering', status: 'Available', badges_count: 8 },
    { id: 2, name: 'Priya Sharma', email: 'priya@example.com', level: 4, xp: 10200, rating: 4.5, domain: 'Software Engineering', status: 'Available', badges_count: 6 },
    { id: 3, name: 'Rahul Singh', email: 'rahul@example.com', level: 3, xp: 8900, rating: 4.1, domain: 'Data & AI', status: 'Available', badges_count: 5 },
    { id: 4, name: 'Fatima Ahmed', email: 'fatima@example.com', level: 4, xp: 11200, rating: 4.8, domain: 'DevOps', status: 'Available', badges_count: 7 },
    { id: 5, name: 'Nadia Islam', email: 'nadia@example.com', level: 4, xp: 9500, rating: 4.3, domain: 'Software Engineering', status: 'Available', badges_count: 6 },
    { id: 6, name: 'Vikram Patel', email: 'vikram@example.com', level: 5, xp: 13200, rating: 4.7, domain: 'Software Engineering', status: 'Available', badges_count: 9 },
    { id: 7, name: 'Hassan Ali', email: 'hassan@example.com', level: 6, xp: 14500, rating: 4.9, domain: 'Cybersecurity', status: 'Available', badges_count: 11 },
    { id: 8, name: 'Zara Khan', email: 'zara@example.com', level: 6, xp: 15800, rating: 5.0, domain: 'Data & AI', status: 'Available', badges_count: 12 },
    { id: 9, name: 'Rohan Das', email: 'rohan@example.com', level: 3, xp: 7200, rating: 3.9, domain: 'Software Engineering', status: 'Available', badges_count: 4 },
    { id: 10, name: 'Maya Gupta', email: 'maya@example.com', level: 4, xp: 10800, rating: 4.4, domain: 'Design', status: 'Available', badges_count: 7 },
  ];
}
