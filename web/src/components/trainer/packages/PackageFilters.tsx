'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

interface PackageFiltersProps {
  onSearch: (search: string) => void;
  onStatusChange: (status: string) => void;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: string) => void;
}

const STATUSES = [
  { value: '', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'draft', label: 'Draft' },
  { value: 'hidden', label: 'Hidden' },
  { value: 'deactivated', label: 'Deactivated' },
  { value: 'pending_review', label: 'Pending Review' },
  { value: 'rejected', label: 'Rejected' },
];

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'HR Interview', label: 'HR Interview' },
  { value: 'Technical Interview', label: 'Technical Interview' },
  { value: 'CV Review', label: 'CV Review' },
  { value: 'Career Counseling', label: 'Career Counseling' },
  { value: 'LinkedIn Review', label: 'LinkedIn Review' },
  { value: 'Company Interview Prep', label: 'Company Interview Prep' },
];

const SORTS = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'price_low', label: 'Price Low to High' },
  { value: 'price_high', label: 'Price High to Low' },
  { value: 'most_booked', label: 'Most Booked' },
];

export default function PackageFilters({
  onSearch,
  onStatusChange,
  onCategoryChange,
  onSortChange,
}: PackageFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search package title, category, skill..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <select
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        >
          <option value="">Status</option>
          {STATUSES.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => onCategoryChange(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        >
          <option value="">Category</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => onSortChange(e.target.value)}
          defaultValue="latest"
          className="px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        >
          {SORTS.map((sort) => (
            <option key={sort.value} value={sort.value}>
              {sort.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
