'use client';

import { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardBody, StarRating, Button, Badge, Input, Select, Skeleton } from '@/components/ui';
import { trainerApi } from '@/lib/api/trainer';
import { Search, ChevronDown } from 'lucide-react';
import Link from 'next/link';

interface FilterState {
  search: string;
  domains: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
  language: string;
  difficulty: string;
}

const DOMAINS = [
  'Software Engineering',
  'Cybersecurity',
  'DevOps',
  'Data & AI',
  'HR/Behavioral',
  'Business/Finance',
  'Design',
  'Government/Viva',
];

export default function TrainersPage() {
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    domains: [],
    minPrice: 0,
    maxPrice: 5000,
    minRating: 0,
    language: '',
    difficulty: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchTrainers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await trainerApi.listTrainers({
        search: filters.search || undefined,
        domains: filters.domains.length > 0 ? filters.domains.join(',') : undefined,
        min_price: filters.minPrice > 0 ? filters.minPrice : undefined,
        max_price: filters.maxPrice < 5000 ? filters.maxPrice : undefined,
        min_rating: filters.minRating > 0 ? filters.minRating : undefined,
        language: filters.language || undefined,
        difficulty: filters.difficulty || undefined,
      });
      setTrainers(data.data || []);
    } catch (error) {
      console.error('Failed to fetch trainers:', error);
      // Use mock data on error
      setTrainers(getMockTrainers());
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchTrainers();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [filters, fetchTrainers]);

  const toggleDomain = (domain: string) => {
    setFilters((prev) => ({
      ...prev,
      domains: prev.domains.includes(domain)
        ? prev.domains.filter((d) => d !== domain)
        : [...prev.domains, domain],
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      domains: [],
      minPrice: 0,
      maxPrice: 5000,
      minRating: 0,
      language: '',
      difficulty: '',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Find Expert Trainers</h1>
          <p className="text-lg text-gray-600">Connect with experienced professionals for interview preparation</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block lg:col-span-1`}>
            <Card className="sticky top-24">
              <CardBody className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center justify-between">
                    Filters
                    <button
                      onClick={resetFilters}
                      className="text-xs text-primary-600 hover:underline"
                    >
                      Reset
                    </button>
                  </h3>
                </div>

                {/* Search */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Search</label>
                  <Input
                    type="text"
                    placeholder="Trainer name..."
                    icon={<Search className="w-4 h-4" />}
                    value={filters.search}
                    onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                  />
                </div>

                {/* Domains */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block">Domains</label>
                  <div className="space-y-2">
                    {DOMAINS.map((domain) => (
                      <label key={domain} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.domains.includes(domain)}
                          onChange={() => toggleDomain(domain)}
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm text-gray-700">{domain}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block">Price Range (BDT)</label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="100"
                      value={filters.maxPrice}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, maxPrice: parseInt(e.target.value) }))
                      }
                      className="w-full"
                    />
                    <p className="text-xs text-gray-600">Up to ৳{filters.maxPrice.toLocaleString()}</p>
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Minimum Rating</label>
                  <div className="space-y-2">
                    {[0, 3, 4, 4.5].map((rating) => (
                      <label key={rating} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="rating"
                          checked={filters.minRating === rating}
                          onChange={() => setFilters((prev) => ({ ...prev, minRating: rating }))}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700">
                          {rating === 0 ? 'Any' : `${rating}+ stars`}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Language */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Language</label>
                  <select
                    value={filters.language}
                    onChange={(e) => setFilters((prev) => ({ ...prev, language: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-btn text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
                  >
                    <option value="">Any Language</option>
                    <option value="english">English</option>
                    <option value="bangla">Bangla</option>
                    <option value="both">Both</option>
                  </select>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Difficulty</label>
                  <select
                    value={filters.difficulty}
                    onChange={(e) => setFilters((prev) => ({ ...prev, difficulty: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-btn text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
                  >
                    <option value="">Any Level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Trainers Grid */}
          <div className="lg:col-span-3">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-btn hover:bg-gray-50"
              >
                <span>Filters</span>
                <ChevronDown className={`w-4 h-4 transition ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} height={300} />
                ))}
              </div>
            ) : trainers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {trainers.map((trainer) => (
                  <Card key={trainer.id} className="hover:shadow-card-hover transition">
                    <CardBody>
                      <div className="flex gap-4">
                        {trainer.profile_photo && (
                          <img
                            src={trainer.profile_photo}
                            alt={trainer.full_name}
                            className="w-20 h-20 rounded-full object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-900">{trainer.full_name}</h3>
                          <StarRating rating={trainer.average_rating || 5} size="sm" />
                          <p className="text-xs text-gray-600 mt-1">
                            {trainer.total_reviews || 0} reviews · {trainer.total_sessions || 0} sessions
                          </p>
                        </div>
                      </div>

                      {trainer.expertise_domains && (
                        <div className="flex flex-wrap gap-2 my-3">
                          {trainer.expertise_domains.slice(0, 3).map((domain: string) => (
                            <Badge key={domain} variant="primary" className="text-xs">
                              {domain}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <p className="text-sm text-gray-600 mb-4">{trainer.bio || 'Expert trainer'}</p>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-gray-900">
                            ৳{trainer.packages?.[0]?.price || 500}
                          </p>
                          <p className="text-xs text-gray-500">/session</p>
                        </div>
                        <Link href={`/trainers/${trainer.id}`}>
                          <Button size="sm">View Profile</Button>
                        </Link>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No trainers found. Try adjusting your filters.</p>
                <Button onClick={resetFilters} variant="outline">
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getMockTrainers() {
  return [
    {
      id: 1,
      full_name: 'Arjun Kumar',
      expertise_domains: ['System Design', 'Backend'],
      average_rating: 4.9,
      total_reviews: 142,
      total_sessions: 245,
      bio: 'Expert in system design and backend architecture',
      packages: [{ price: 500 }],
    },
    {
      id: 2,
      full_name: 'Priya Sharma',
      expertise_domains: ['Frontend', 'React'],
      average_rating: 4.8,
      total_reviews: 98,
      total_sessions: 156,
      bio: 'Specialized in React and modern frontend development',
      packages: [{ price: 450 }],
    },
    {
      id: 3,
      full_name: 'Rahul Singh',
      expertise_domains: ['DevOps', 'Cloud'],
      average_rating: 4.7,
      total_reviews: 76,
      total_sessions: 189,
      bio: 'DevOps and cloud infrastructure expert',
      packages: [{ price: 600 }],
    },
    {
      id: 4,
      full_name: 'Fatima Ahmed',
      expertise_domains: ['Data & AI', 'ML'],
      average_rating: 4.9,
      total_reviews: 112,
      total_sessions: 213,
      bio: 'Data science and machine learning specialist',
      packages: [{ price: 700 }],
    },
  ];
}
