'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardBody, Button, Badge, Spinner } from '@/components/ui';
import { Star, Clock, Users, ArrowRight, Search, Filter, MapPin } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 via-primary-600 to-purple-600 py-12 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Interview Package Feed</h1>
          <p className="text-xl text-primary-100 max-w-2xl mb-8">
            Browse latest mock interview, CV review, and career coaching packages from expert trainers worldwide
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by package, trainer, skill, company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 border-0 focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 md:hidden px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filters</span>
              {activeFiltersCount > 0 && (
                <Badge variant="primary" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </button>

            {/* Desktop Filters */}
            <div className="hidden md:flex items-center gap-3 overflow-x-auto pb-2">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white hover:border-primary-400 transition"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Country */}
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white hover:border-primary-400 transition"
              >
                <option value="">All Countries</option>
                {COUNTRIES.map(country => (
                  <option key={country.code} value={country.code}>
                    {getFlagEmoji(country.code)} {country.name}
                  </option>
                ))}
              </select>

              {/* Category */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white hover:border-primary-400 transition"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {/* Level */}
              <select
                value={selectedTargetLevel}
                onChange={(e) => setSelectedTargetLevel(e.target.value)}
                className="px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white hover:border-primary-400 transition"
              >
                <option value="">All Levels</option>
                {TARGET_LEVELS.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>

              {/* Price */}
              <select
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white hover:border-primary-400 transition"
              >
                <option value="">All Prices</option>
                {PRICE_RANGES.map(range => (
                  <option key={range.label} value={`${range.min}-${range.max}`}>
                    {range.label}
                  </option>
                ))}
              </select>

              {/* Language */}
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white hover:border-primary-400 transition"
              >
                <option value="">All Languages</option>
                {LANGUAGES.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>

              {/* Duration */}
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white hover:border-primary-400 transition"
              >
                <option value="">All Durations</option>
                {DURATIONS.map(dur => (
                  <option key={dur} value={dur}>{dur} min</option>
                ))}
              </select>

              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="px-3 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="md:hidden grid grid-cols-2 gap-3 mb-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {[
                { label: 'Country', value: selectedCountry, onChange: setSelectedCountry, options: COUNTRIES.map(c => ({ label: `${c.name}`, value: c.code })) },
                { label: 'Category', value: selectedCategory, onChange: setSelectedCategory, options: CATEGORIES.map(c => ({ label: c, value: c })) },
                { label: 'Level', value: selectedTargetLevel, onChange: setSelectedTargetLevel, options: TARGET_LEVELS.map(l => ({ label: l, value: l })) },
              ].map((filter, idx) => (
                <select
                  key={idx}
                  value={filter.value}
                  onChange={(e) => filter.onChange(e.target.value)}
                  className="px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white"
                >
                  <option value="">All {filter.label}s</option>
                  {filter.options.map((opt: any) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ))}

              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="col-span-2 px-3 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition border border-primary-300"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Feed Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading && sortedPackages.length === 0 ? (
            <div className="flex justify-center items-center py-24">
              <Spinner size="lg" />
            </div>
          ) : sortedPackages.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-lg border-2 border-dashed border-gray-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No packages found</h3>
              <p className="text-gray-600 mb-6">Try changing your filters or search with another keyword</p>
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-primary-600 hover:text-primary-700 font-semibold"
                >
                  Clear filters and try again
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {sortedPackages.map((pkg) => (
                <Card
                  key={pkg.package_id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-primary-300"
                >
                  <CardBody className="p-6">
                    {/* Trainer Header Section */}
                    <div className="flex items-start justify-between mb-5 pb-5 border-b border-gray-200">
                      <div className="flex gap-4 flex-1">
                        {/* Avatar */}
                        <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex-shrink-0 flex items-center justify-center text-white text-lg font-bold shadow-sm">
                          {pkg.trainer.avatar_text}
                        </div>

                        {/* Trainer Info */}
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900">{pkg.trainer.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{pkg.trainer.professional_title}</p>

                          {/* Rating & Sessions */}
                          <div className="flex items-center gap-3 text-sm mb-3">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold text-gray-900">{pkg.trainer.rating.toFixed(1)}</span>
                            </div>
                            <span className="text-gray-600">•</span>
                            <span className="text-gray-600">{pkg.trainer.total_sessions} sessions completed</span>
                          </div>

                          {/* Country */}
                          {pkg.trainer.country_name && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                              <span className="text-lg">{pkg.trainer.country_flag || getFlagEmoji(pkg.trainer.country_code)}</span>
                              <span className="font-medium">{pkg.trainer.country_name}</span>
                              {pkg.trainer.city && <span className="text-gray-500">({pkg.trainer.city})</span>}
                            </div>
                          )}

                          <Link href={`/trainers/${pkg.trainer.id}`}>
                            <Button variant="outline" size="sm" className="text-xs">
                              View Profile
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Package Info Section */}
                    <div className="space-y-4">
                      {/* Tags and Time */}
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex gap-2 items-center flex-wrap">
                          <Badge variant="primary" className="text-xs capitalize">
                            {pkg.category}
                          </Badge>
                          <Badge variant="gray" className="text-xs">
                            {pkg.target_level}
                          </Badge>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {getTimeAgo(pkg.published_at)}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="text-xl font-bold text-gray-900 leading-tight">
                        {pkg.title}
                      </h2>

                      {/* Description */}
                      <p className="text-gray-700 text-sm line-clamp-2">
                        {pkg.short_description}
                      </p>

                      {/* Package Details Grid */}
                      <div className="grid grid-cols-3 gap-4 py-4 bg-gray-50 rounded-lg px-4 -mx-6 mx-0">
                        <div>
                          <p className="text-xs text-gray-600 font-medium">Duration</p>
                          <p className="font-bold text-gray-900">{pkg.duration_minutes}m</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-medium">Language</p>
                          <p className="font-bold text-gray-900 text-sm">{pkg.language}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-medium">Available</p>
                          <p className="font-bold text-green-600 text-sm">{getAvailabilityText(pkg.next_available_slot)}</p>
                        </div>
                      </div>

                      {/* Price & Actions */}
                      <div className="flex items-center justify-between pt-4">
                        <div>
                          <p className="text-xs text-gray-600 font-medium mb-1">Price</p>
                          <div className="flex items-baseline gap-2">
                            {pkg.discount_price ? (
                              <>
                                <p className="text-2xl font-bold text-primary-600">
                                  ৳{pkg.discount_price.toLocaleString()}
                                </p>
                                <p className="text-xs line-through text-gray-400">
                                  ৳{pkg.price.toLocaleString()}
                                </p>
                              </>
                            ) : (
                              <p className="text-2xl font-bold text-primary-600">
                                ৳{pkg.price.toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/packages/${pkg.package_id}`}>
                            <Button variant="outline" size="sm">
                              Details
                            </Button>
                          </Link>
                          <Link href={isAuthenticated ? `/book/${pkg.trainer.id}?package=${pkg.package_id}` : '/auth/login'}>
                            <Button size="sm" className="gap-2">
                              Book <ArrowRight className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {sortedPackages.length > 0 && (
        <section className="py-16 bg-primary-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to ace your interview?</h2>
            <p className="text-primary-100 mb-8 max-w-2xl mx-auto text-lg">
              Pick any package from expert trainers worldwide and start your journey today
            </p>
            {!isAuthenticated && (
              <Link href="/auth/register">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                  Get Started Now
                </Button>
              </Link>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
