'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardBody, Button, Badge, Spinner } from '@/components/ui';
import { Star, Clock, Users, ArrowRight, Search, Filter, MapPin, Sparkles, ChevronDown, SlidersHorizontal, Calendar } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

interface FeedPackage {
  package_id: number;
  title: string;
  short_description: string;
  category: string;
  target_level: string;
  duration_minutes: number;
  language: string;
  price: number;
  discount_price?: number;
  currency: string;
  published_at: string;
  next_available_slot: string;
  trainer: {
    id: number;
    name: string;
    avatar?: string;
    avatar_text?: string;
    professional_title: string;
    rating: number;
    total_sessions: number;
    country_code?: string;
    country_name?: string;
    country_flag?: string;
    city?: string;
  };
}

const CATEGORIES = ['HR Interview', 'Technical Interview', 'CV Review', 'Career Counseling', 'LinkedIn Review', 'Company Interview Prep'];
const LANGUAGES = ['Bangla', 'English', 'Bangla + English'];
const DURATIONS = [30, 45, 60];
const TARGET_LEVELS = ['Fresher', 'Junior', 'Mid-Level', 'Senior', 'Executive'];
const COUNTRIES = [
  { code: 'BD', name: 'Bangladesh' },
  { code: 'IN', name: 'India' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'GLOBAL', name: 'Remote / Global' },
];
const PRICE_RANGES = [
  { label: 'Free', min: 0, max: 0 },
  { label: 'Under ৳500', min: 1, max: 500 },
  { label: '৳500-৳1000', min: 500, max: 1000 },
  { label: '৳1000-৳2000', min: 1000, max: 2000 },
  { label: '৳2000+', min: 2000, max: 999999 },
];
const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'price_low', label: 'Price Low to High' },
  { value: 'price_high', label: 'Price High to Low' },
  { value: 'top_rated', label: 'Top Rated' },
];

// Flag generation function
function getFlagEmoji(countryCode?: string): string {
  if (!countryCode || countryCode === 'GLOBAL') return '🌐';
  return countryCode
    .toUpperCase()
    .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

// Mock packages with country data
const MOCK_PACKAGES: FeedPackage[] = [
  {
    package_id: 1,
    title: 'HR Mock Interview for Fresh Graduates',
    short_description: '45-minute structured HR interview with feedback',
    category: 'HR Interview',
    target_level: 'Fresher',
    duration_minutes: 45,
    language: 'Bangla + English',
    price: 800,
    currency: 'BDT',
    published_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    next_available_slot: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    trainer: {
      id: 15,
      name: 'Rahim Uddin',
      avatar_text: 'R',
      professional_title: 'Senior HR Manager',
      rating: 4.8,
      total_sessions: 126,
      country_code: 'BD',
      country_name: 'Bangladesh',
      country_flag: '🇧🇩',
      city: 'Dhaka',
    },
  },
  {
    package_id: 2,
    title: 'System Design Interview Mastery',
    short_description: 'In-depth system design patterns with real-world examples',
    category: 'Technical Interview',
    target_level: 'Mid-Level',
    duration_minutes: 60,
    language: 'English',
    price: 1500,
    currency: 'BDT',
    published_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    next_available_slot: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    trainer: {
      id: 1,
      name: 'Arjun Kumar',
      avatar_text: 'A',
      professional_title: 'Software Architect',
      rating: 4.9,
      total_sessions: 245,
      country_code: 'IN',
      country_name: 'India',
      country_flag: '🇮🇳',
      city: 'Bangalore',
    },
  },
  {
    package_id: 3,
    title: 'Professional CV Writing & Optimization',
    short_description: 'Complete CV review, optimization, and ATS-friendly formatting',
    category: 'CV Review',
    target_level: 'Fresher',
    duration_minutes: 45,
    language: 'Bangla + English',
    price: 600,
    discount_price: 500,
    currency: 'BDT',
    published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    next_available_slot: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    trainer: {
      id: 20,
      name: 'Fatema Khan',
      avatar_text: 'F',
      professional_title: 'HR Recruiter & CV Expert',
      rating: 4.7,
      total_sessions: 89,
      country_code: 'BD',
      country_name: 'Bangladesh',
      country_flag: '🇧🇩',
      city: 'Chittagong',
    },
  },
  {
    package_id: 4,
    title: 'Data Structures & Algorithms Bootcamp',
    short_description: 'Master DSA with live coding practice for FAANG interviews',
    category: 'Technical Interview',
    target_level: 'Fresher',
    duration_minutes: 60,
    language: 'English',
    price: 1200,
    currency: 'BDT',
    published_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    next_available_slot: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    trainer: {
      id: 2,
      name: 'Priya Singh',
      avatar_text: 'P',
      professional_title: 'Senior Engineer, Google',
      rating: 4.9,
      total_sessions: 156,
      country_code: 'US',
      country_name: 'United States',
      country_flag: '🇺🇸',
      city: 'San Francisco',
    },
  },
  {
    package_id: 5,
    title: 'LinkedIn Profile Optimization',
    short_description: 'Complete LinkedIn makeover to attract recruiters',
    category: 'LinkedIn Review',
    target_level: 'Junior',
    duration_minutes: 30,
    language: 'Bangla',
    price: 400,
    currency: 'BDT',
    published_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    next_available_slot: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    trainer: {
      id: 25,
      name: 'Shantanu Roy',
      avatar_text: 'S',
      professional_title: 'Career Coach',
      rating: 4.6,
      total_sessions: 67,
      country_code: 'BD',
      country_name: 'Bangladesh',
      country_flag: '🇧🇩',
      city: 'Dhaka',
    },
  },
  {
    package_id: 6,
    title: 'Amazon Leadership Interview Prep',
    short_description: 'STAR method training for Amazon LEADER principles',
    category: 'Company Interview Prep',
    target_level: 'Mid-Level',
    duration_minutes: 45,
    language: 'English',
    price: 900,
    currency: 'BDT',
    published_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    next_available_slot: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
    trainer: {
      id: 3,
      name: 'Aisha Khan',
      avatar_text: 'A',
      professional_title: 'Amazon Manager (6+ years)',
      rating: 4.95,
      total_sessions: 203,
      country_code: 'US',
      country_name: 'United States',
      country_flag: '🇺🇸',
      city: 'Seattle',
    },
  },
  {
    package_id: 7,
    title: 'Web Development Interview Crash Course',
    short_description: 'Frontend, backend, databases - complete web dev interview prep',
    category: 'Technical Interview',
    target_level: 'Junior',
    duration_minutes: 60,
    language: 'English',
    price: 1100,
    currency: 'BDT',
    published_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    next_available_slot: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    trainer: {
      id: 18,
      name: 'James Wilson',
      avatar_text: 'J',
      professional_title: 'Full-Stack Developer',
      rating: 4.7,
      total_sessions: 134,
      country_code: 'GB',
      country_name: 'United Kingdom',
      country_flag: '🇬🇧',
      city: 'London',
    },
  },
  {
    package_id: 8,
    title: 'Startup Founder Interview Prep',
    short_description: 'Learn how startup founders think and ace founder interviews',
    category: 'Career Counseling',
    target_level: 'Senior',
    duration_minutes: 45,
    language: 'English',
    price: 1300,
    currency: 'BDT',
    published_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    next_available_slot: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    trainer: {
      id: 28,
      name: 'Michael Chen',
      avatar_text: 'M',
      professional_title: 'Startup Founder & Investor',
      rating: 4.8,
      total_sessions: 78,
      country_code: 'GLOBAL',
      country_name: 'Remote / Global',
      country_flag: '🌐',
    },
  },
];

export default function FeedPage() {
  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<string>('');
  const [selectedTargetLevel, setSelectedTargetLevel] = useState<string>('');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('latest');
  const [showFilters, setShowFilters] = useState(false);

  // Data State
  const [packages, setPackages] = useState<FeedPackage[]>(MOCK_PACKAGES);
  const [isLoading, setIsLoading] = useState(false);

  const { isAuthenticated } = useAuthStore();

  // Filter packages
  const filteredPackages = packages.filter(pkg => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !pkg.title.toLowerCase().includes(query) &&
        !pkg.short_description.toLowerCase().includes(query) &&
        !pkg.trainer.name.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    if (selectedCategory && pkg.category !== selectedCategory) return false;
    if (selectedLanguage && pkg.language !== selectedLanguage) return false;
    if (selectedDuration && pkg.duration_minutes !== parseInt(selectedDuration)) return false;
    if (selectedTargetLevel && pkg.target_level !== selectedTargetLevel) return false;
    if (selectedCountry && pkg.trainer.country_code !== selectedCountry) return false;

    if (selectedPriceRange) {
      const [min, max] = selectedPriceRange.split('-').map(Number);
      if (pkg.price < min || pkg.price > max) return false;
    }

    return true;
  });

  // Sort packages
  const sortedPackages = [...filteredPackages].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.trainer.total_sessions - a.trainer.total_sessions;
      case 'price_low':
        return (a.discount_price || a.price) - (b.discount_price || b.price);
      case 'price_high':
        return (b.discount_price || b.price) - (a.discount_price || a.price);
      case 'top_rated':
        return b.trainer.rating - a.trainer.rating;
      case 'latest':
      default:
        return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
    }
  });

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const getAvailabilityText = (slotStr: string) => {
    const slot = new Date(slotStr);
    const now = new Date();
    const daysAhead = Math.floor((slot.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));

    if (daysAhead === 0) return 'Today';
    if (daysAhead === 1) return 'Tomorrow';
    if (daysAhead < 7) return `In ${daysAhead} days`;
    return slot.toLocaleDateString();
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedCountry('');
    setSelectedLanguage('');
    setSelectedDuration('');
    setSelectedTargetLevel('');
    setSelectedPriceRange('');
    setSortBy('latest');
  };

  const activeFiltersCount = [
    searchQuery,
    selectedCategory,
    selectedCountry,
    selectedLanguage,
    selectedDuration,
    selectedTargetLevel,
    selectedPriceRange,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-primary-100 selection:text-primary-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-primary-900 pt-20 pb-28 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-500 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-pulse [animation-delay:2000ms]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-semibold mb-8 backdrop-blur-md shadow-inner">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            Discover Premium Interview Packages
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
            Level up with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">Expert Coaching</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Browse our live feed of freshly posted mock interviews, CV reviews, and career counseling sessions from top industry professionals.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-3xl mx-auto bg-white/10 backdrop-blur-xl p-2 rounded-2xl border border-white/20 shadow-2xl flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by package, trainer, skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-gray-900 placeholder-gray-500 border-0 focus:ring-2 focus:ring-primary-500 text-lg transition-all"
              />
            </div>
            <Button 
              size="lg" 
              onClick={() => setShowFilters(!showFilters)}
              className={`h-auto py-4 px-6 rounded-xl gap-2 font-bold transition-all ${showFilters ? 'bg-primary-500 text-white border-primary-500' : 'bg-white/10 text-white border-transparent hover:bg-white/20'}`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full ml-1">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </div>

          {/* Quick Category Pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {CATEGORIES.slice(0, 5).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all backdrop-blur-md ${
                  selectedCategory === cat
                    ? 'bg-primary-500 text-white border-primary-500 shadow-lg'
                    : 'bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Filters Expansion Panel */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200 shadow-lg animate-in slide-in-from-top-4 fade-in duration-300 relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary-600" /> Advanced Filters
              </h3>
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-sm font-semibold text-danger-600 hover:text-danger-700 hover:underline"
                >
                  Reset all filters
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {/* Sort */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sort By</label>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full appearance-none pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors cursor-pointer"
                  >
                    {SORT_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Country */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Country</label>
                <div className="relative">
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full appearance-none pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors cursor-pointer"
                  >
                    <option value="">Any Country</option>
                    {COUNTRIES.map(c => (
                      <option key={c.code} value={c.code}>{getFlagEmoji(c.code)} {c.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2 lg:col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</label>
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full appearance-none pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors cursor-pointer"
                  >
                    <option value="">Any Category</option>
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Level */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Target Level</label>
                <div className="relative">
                  <select
                    value={selectedTargetLevel}
                    onChange={(e) => setSelectedTargetLevel(e.target.value)}
                    className="w-full appearance-none pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors cursor-pointer"
                  >
                    <option value="">Any Level</option>
                    {TARGET_LEVELS.map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Price Range</label>
                <div className="relative">
                  <select
                    value={selectedPriceRange}
                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                    className="w-full appearance-none pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors cursor-pointer"
                  >
                    <option value="">Any Price</option>
                    {PRICE_RANGES.map(range => (
                      <option key={range.label} value={`${range.min}-${range.max}`}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feed Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">Latest Packages</h2>
              <p className="text-gray-500 mt-1">Showing {sortedPackages.length} available packages</p>
            </div>
          </div>

          {isLoading && sortedPackages.length === 0 ? (
            <div className="flex justify-center items-center py-24">
              <Spinner size="lg" />
            </div>
          ) : sortedPackages.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-gray-200 shadow-sm max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No packages found</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">We couldn't find any packages matching your current filters. Try adjusting your search criteria.</p>
              {activeFiltersCount > 0 && (
                <Button size="lg" onClick={resetFilters} className="font-bold">
                  Clear All Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              {sortedPackages.map((pkg) => (
                <div
                  key={pkg.package_id}
                  className="group bg-white rounded-3xl overflow-hidden border border-gray-200 hover:border-primary-300 hover:shadow-xl transition-all duration-300 relative flex flex-col hover:-translate-y-1"
                >
                  {/* Decorative Gradient Top */}
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="p-6 sm:p-8 flex-1 flex flex-col">
                    {/* Header: Badges & Time */}
                    <div className="flex justify-between items-start mb-5">
                      <div className="flex gap-2 flex-wrap">
                        <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-bold uppercase tracking-wider rounded-lg border border-primary-100">
                          {pkg.category}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider rounded-lg border border-gray-200">
                          {pkg.target_level}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-gray-500 whitespace-nowrap bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
                        {getTimeAgo(pkg.published_at)}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-primary-700 transition-colors line-clamp-2">
                      {pkg.title}
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base mb-6 line-clamp-2 leading-relaxed">
                      {pkg.short_description}
                    </p>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 p-4 bg-gray-50/80 border border-gray-100 rounded-2xl">
                      <div className="flex flex-col items-center justify-center text-center border-r border-gray-200">
                        <Clock className="w-5 h-5 text-gray-400 mb-1.5" />
                        <p className="text-[10px] sm:text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5">Duration</p>
                        <p className="font-bold text-gray-900 text-sm">{pkg.duration_minutes}m</p>
                      </div>
                      <div className="flex flex-col items-center justify-center text-center border-r border-gray-200 px-2">
                        <Users className="w-5 h-5 text-gray-400 mb-1.5" />
                        <p className="text-[10px] sm:text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5">Language</p>
                        <p className="font-bold text-gray-900 text-sm truncate w-full">{pkg.language}</p>
                      </div>
                      <div className="flex flex-col items-center justify-center text-center px-2">
                        <Calendar className="w-5 h-5 text-green-500 mb-1.5" />
                        <p className="text-[10px] sm:text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5">Available</p>
                        <p className="font-bold text-green-600 text-sm truncate w-full">{getAvailabilityText(pkg.next_available_slot)}</p>
                      </div>
                    </div>

                    <div className="mt-auto"></div>

                    {/* Divider */}
                    <div className="border-t border-gray-100 my-5"></div>

                    {/* Footer: Trainer Info & Action */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Trainer Profile Snippet */}
                      <Link href={`/trainers/${pkg.trainer.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-md shadow-primary-500/20">
                          {pkg.trainer.avatar_text}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-gray-900 text-sm sm:text-base">{pkg.trainer.name}</h4>
                            <span title={pkg.trainer.country_name} className="text-base">{pkg.trainer.country_flag || getFlagEmoji(pkg.trainer.country_code)}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                            <div className="flex items-center gap-0.5 bg-yellow-50 px-1.5 py-0.5 rounded-md border border-yellow-100">
                              <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                              <span className="font-bold text-yellow-700">{pkg.trainer.rating.toFixed(1)}</span>
                            </div>
                            <span>• {pkg.trainer.total_sessions} sessions</span>
                          </div>
                        </div>
                      </Link>

                      {/* Price & Book */}
                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 sm:gap-2">
                        <div className="flex items-baseline gap-2">
                          {pkg.discount_price ? (
                            <>
                              <span className="text-xs sm:text-sm line-through text-gray-400">৳{pkg.price.toLocaleString()}</span>
                              <span className="text-xl sm:text-2xl font-black text-primary-600">৳{pkg.discount_price.toLocaleString()}</span>
                            </>
                          ) : (
                            <span className="text-xl sm:text-2xl font-black text-gray-900">৳{pkg.price.toLocaleString()}</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/packages/${pkg.package_id}`}>
                            <Button variant="outline" size="sm" className="hidden sm:inline-flex rounded-xl border-gray-200 hover:bg-gray-50 text-gray-700">
                              Details
                            </Button>
                          </Link>
                          <Link href={isAuthenticated ? `/book/${pkg.trainer.id}?package=${pkg.package_id}` : '/auth/login'}>
                            <Button size="sm" className="rounded-xl font-bold bg-primary-600 hover:bg-primary-700 text-white border-none shadow-md shadow-primary-500/20 group-hover:shadow-primary-500/40 px-6">
                              Book
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer CTA */}
      {sortedPackages.length > 0 && (
        <section className="py-24 bg-gray-900 text-white text-center relative overflow-hidden mt-12 border-t-4 border-primary-500">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20"></div>
          <div className="relative z-10 max-w-3xl mx-auto px-4">
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 tracking-tight">Ready to ace your interview?</h2>
            <p className="text-gray-300 mb-10 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              Book a session with top industry experts and start practicing today. Your dream job is just an interview away.
            </p>
            {!isAuthenticated && (
              <Link href="/auth/register">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 h-16 px-10 text-lg font-bold border-none shadow-2xl hover:scale-105 transition-transform">
                  Create Free Account
                </Button>
              </Link>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
