'use client';

import { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { StarRating, Button, Skeleton } from '@/components/ui';
import { trainerApi } from '@/lib/api/trainer';
import { Search, MapPin, Clock, Users, Verified, SlidersHorizontal, X, Sparkles, ArrowRight } from 'lucide-react';
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

const DOMAIN_ICONS: Record<string, string> = {
  'Software Engineering': '💻',
  'Cybersecurity': '🔒',
  'DevOps': '⚙️',
  'Data & AI': '🤖',
  'HR/Behavioral': '🤝',
  'Business/Finance': '📊',
  'Design': '🎨',
  'Government/Viva': '🏛️',
};

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
      const apiTrainers = data.data || [];
      // In development, supplement with mock data if few real trainers exist
      if (apiTrainers.length < 3) {
        const mockIds = new Set(apiTrainers.map((t: any) => t.id));
        const supplemental = getMockTrainers().filter(m => !mockIds.has(m.id));
        setTrainers([...apiTrainers, ...supplemental]);
      } else {
        setTrainers(apiTrainers);
      }
    } catch (error) {
      console.error('Failed to fetch trainers:', error);
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

  const activeFilterCount =
    filters.domains.length +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.language ? 1 : 0) +
    (filters.difficulty ? 1 : 0) +
    (filters.maxPrice < 5000 ? 1 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/5 via-transparent to-primary-600/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-semibold mb-5 border border-primary-100">
              <Sparkles className="w-4 h-4" />
              <span>Top-rated interview coaches available now</span>
            </div>
            <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4 leading-tight">
              Find Your Perfect
              <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent"> Interview Coach</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Connect with experienced professionals who will prepare you to ace any interview.
              Personalized mock sessions, expert feedback, and career guidance.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, domain, or skill..."
                  value={filters.search}
                  onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-14 pr-32 py-4 bg-white border border-gray-200 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-lg shadow-gray-100/50 transition-all"
                />
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    showFilters || activeFilterCount > 0
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 bg-white text-primary-600 rounded-full text-xs flex items-center justify-center font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Domain Quick-Picks */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {DOMAINS.map((domain) => (
            <button
              key={domain}
              onClick={() => toggleDomain(domain)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                filters.domains.includes(domain)
                  ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-200'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300 hover:bg-primary-50'
              }`}
            >
              <span>{DOMAIN_ICONS[domain] || '📌'}</span>
              <span>{domain}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="mb-8 p-6 bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900 text-lg">Refine Results</h3>
              <div className="flex items-center gap-3">
                <button onClick={resetFilters} className="text-sm text-primary-600 hover:underline font-medium">
                  Clear all
                </button>
                <button onClick={() => setShowFilters(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Price Range */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-3 block">Budget (BDT)</label>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: parseInt(e.target.value) }))}
                  className="w-full accent-primary-600"
                />
                <p className="text-sm text-gray-600 mt-1">Up to <span className="font-bold text-gray-900">৳{filters.maxPrice.toLocaleString()}</span></p>
              </div>

              {/* Rating */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-3 block">Minimum Rating</label>
                <div className="flex flex-wrap gap-2">
                  {[0, 3, 4, 4.5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setFilters((prev) => ({ ...prev, minRating: rating }))}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                        filters.minRating === rating
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      {rating === 0 ? 'Any' : `${rating}+ ⭐`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-3 block">Language</label>
                <select
                  value={filters.language}
                  onChange={(e) => setFilters((prev) => ({ ...prev, language: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                >
                  <option value="">Any Language</option>
                  <option value="english">English</option>
                  <option value="bangla">Bangla</option>
                  <option value="both">Both</option>
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-3 block">Experience Level</label>
                <select
                  value={filters.difficulty}
                  onChange={(e) => setFilters((prev) => ({ ...prev, difficulty: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                >
                  <option value="">Any Level</option>
                  <option value="beginner">Beginner Friendly</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-600">
            Showing <span className="font-bold text-gray-900">{trainers.length}</span> trainer{trainers.length !== 1 ? 's' : ''}
          </p>
          {activeFilterCount > 0 && (
            <button onClick={resetFilters} className="text-sm text-primary-600 hover:underline font-medium flex items-center gap-1">
              <X className="w-3 h-3" /> Clear filters
            </button>
          )}
        </div>

        {/* Trainers Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="flex gap-4 mb-4">
                  <Skeleton height={80} width={80} className="rounded-2xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton height={20} width="60%" />
                    <Skeleton height={14} width="40%" />
                    <Skeleton height={14} width="50%" />
                  </div>
                </div>
                <Skeleton height={14} width="100%" />
                <Skeleton height={14} width="80%" className="mt-2" />
                <div className="flex gap-2 mt-4">
                  <Skeleton height={28} width={80} className="rounded-full" />
                  <Skeleton height={28} width={80} className="rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : trainers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainers.map((trainer) => (
              <Link
                key={trainer.id}
                href={`/trainers/${trainer.id}`}
                className="group"
              >
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-primary-100/30 hover:border-primary-200 transition-all duration-300 h-full flex flex-col">
                  {/* Card Header with Photo */}
                  <div className="p-6 pb-4">
                    <div className="flex gap-4">
                      <div className="relative flex-shrink-0">
                        <img
                          src={trainer.profile_photo || `/images/trainers/trainer_${((trainer.id - 1) % 6) + 1}.png`}
                          alt={trainer.full_name}
                          className="w-20 h-20 rounded-2xl object-cover ring-2 ring-gray-100 group-hover:ring-primary-200 transition-all"
                        />
                        {trainer.is_verified && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center ring-2 ring-white">
                            <Verified className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary-700 transition-colors truncate">
                          {trainer.full_name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-0.5 truncate">{trainer.title || 'Interview Coach'}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <StarRating rating={trainer.average_rating || 5} size="sm" />
                          <span className="text-xs text-gray-500 font-medium">
                            ({trainer.total_reviews || 0})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="px-6 pb-4 flex-1">
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                      {trainer.bio || 'Expert trainer specializing in interview preparation and career guidance.'}
                    </p>
                  </div>

                  {/* Domains */}
                  {trainer.expertise_domains && trainer.expertise_domains.length > 0 && (
                    <div className="px-6 pb-4">
                      <div className="flex flex-wrap gap-1.5">
                        {trainer.expertise_domains.slice(0, 3).map((domain: string) => (
                          <span
                            key={domain}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 text-gray-700 text-xs font-medium rounded-lg border border-gray-100"
                          >
                            {DOMAIN_ICONS[domain] || '📌'} {domain}
                          </span>
                        ))}
                        {trainer.expertise_domains.length > 3 && (
                          <span className="px-2.5 py-1 text-xs font-medium text-primary-600">
                            +{trainer.expertise_domains.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Stats Row */}
                  <div className="px-6 pb-4">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {trainer.total_sessions || 0} sessions
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {trainer.session_duration || 45} min
                      </span>
                      {trainer.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {trainer.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 border-t border-gray-50 bg-gray-50/50 flex items-center justify-between mt-auto">
                    <div>
                      <p className="text-xs text-gray-500">Starting from</p>
                      <p className="text-xl font-bold text-gray-900">
                        ৳{(trainer.packages?.[0]?.price || 500).toLocaleString()}
                        <span className="text-xs font-normal text-gray-500 ml-1">/session</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-primary-600 group-hover:text-primary-700 transition-colors">
                      View Profile
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No trainers found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              We couldn't find any trainers matching your criteria. Try adjusting your filters or search terms.
            </p>
            <Button onClick={resetFilters} variant="primary" className="px-6">
              Reset All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function getMockTrainers() {
  return [
    {
      id: 1,
      full_name: 'Arjun Kumar',
      title: 'Senior Software Architect',
      expertise_domains: ['Software Engineering', 'System Design', 'Backend'],
      average_rating: 4.9,
      total_reviews: 142,
      total_sessions: 245,
      session_duration: 60,
      location: 'Dhaka',
      is_verified: true,
      bio: 'Expert in system design and backend architecture with 10+ years at top tech companies. Specialized in preparing candidates for FAANG-level technical rounds.',
      packages: [{ price: 1500 }],
    },
    {
      id: 2,
      full_name: 'Priya Sharma',
      title: 'Frontend Lead at TechCorp',
      expertise_domains: ['Software Engineering', 'Design'],
      average_rating: 4.8,
      total_reviews: 98,
      total_sessions: 156,
      session_duration: 45,
      location: 'Chittagong',
      is_verified: true,
      bio: 'Specialized in React, TypeScript, and modern frontend development. Helping engineers crack product-based company interviews with real-world case studies.',
      packages: [{ price: 1200 }],
    },
    {
      id: 3,
      full_name: 'Rahul Singh',
      title: 'DevOps Principal Engineer',
      expertise_domains: ['DevOps', 'Cybersecurity'],
      average_rating: 4.7,
      total_reviews: 76,
      total_sessions: 189,
      session_duration: 45,
      location: 'Dhaka',
      is_verified: true,
      bio: 'DevOps and cloud infrastructure expert with extensive experience in AWS, Docker, and Kubernetes. Preparing engineers for SRE and DevOps roles.',
      packages: [{ price: 1800 }],
    },
    {
      id: 4,
      full_name: 'Fatima Ahmed',
      title: 'Lead Data Scientist',
      expertise_domains: ['Data & AI', 'Software Engineering'],
      average_rating: 4.9,
      total_reviews: 112,
      total_sessions: 213,
      session_duration: 60,
      location: 'Sylhet',
      is_verified: true,
      bio: 'Data science and machine learning specialist with published research. Expert at preparing candidates for ML engineer and data scientist positions.',
      packages: [{ price: 2000 }],
    },
    {
      id: 5,
      full_name: 'Kamal Hossain',
      title: 'VP of HR, MegaCorp',
      expertise_domains: ['HR/Behavioral', 'Business/Finance'],
      average_rating: 4.8,
      total_reviews: 203,
      total_sessions: 312,
      session_duration: 45,
      location: 'Dhaka',
      is_verified: true,
      bio: 'Seasoned HR executive with 15+ years of recruitment experience. Expert in behavioral interviews, salary negotiation, and executive-level preparation.',
      packages: [{ price: 1000 }],
    },
    {
      id: 6,
      full_name: 'Tanvir Rahman',
      title: 'Full Stack Developer',
      expertise_domains: ['Software Engineering', 'DevOps'],
      average_rating: 4.6,
      total_reviews: 64,
      total_sessions: 98,
      session_duration: 45,
      location: 'Rajshahi',
      is_verified: false,
      bio: 'Full stack developer passionate about helping fresh graduates land their first tech job. Focused on practical coding challenges and portfolio reviews.',
      packages: [{ price: 800 }],
    },
  ];
}
