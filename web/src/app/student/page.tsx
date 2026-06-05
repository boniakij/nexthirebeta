'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

interface Trainer {
  id: number;
  full_name: string;
  expertise_domains: string[];
  average_rating: number;
  total_reviews: number;
  total_sessions: number;
  is_approved: boolean;
}

export default function StudentDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchDomain, setSearchDomain] = useState('');
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'student') {
      router.push('/auth/login');
      return;
    }

    // TODO: Fetch student stats and trainers from API
    setLoading(false);
  }, [isAuthenticated, user, router]);

  const filteredTrainers = trainers.filter(trainer => {
    if (searchDomain && !trainer.expertise_domains.includes(searchDomain)) {
      return false;
    }
    if (trainer.average_rating < minRating) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">NextHire</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button
              onClick={() => {
                useAuthStore.setState({ isAuthenticated: false, user: null });
                router.push('/auth/login');
              }}
              className="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-gray-500 text-sm font-medium">Level</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">1</p>
            <p className="text-xs text-gray-500 mt-1">Newcomer</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-gray-500 text-sm font-medium">XP Points</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">0</p>
            <p className="text-xs text-gray-500 mt-1">0 / 200 to level 2</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-gray-500 text-sm font-medium">Interviews</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">0</p>
            <p className="text-xs text-gray-500 mt-1">Book your first!</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-gray-500 text-sm font-medium">Badges</h3>
            <p className="text-3xl font-bold text-yellow-600 mt-2">0</p>
            <p className="text-xs text-gray-500 mt-1">Earn achievements</p>
          </div>
        </div>

        {/* Browse Trainers Section */}
        <section className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Browse Trainers</h2>
              <p className="text-gray-600 mt-1">Book mock interviews with expert trainers</p>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Domain / Skills
              </label>
              <select
                value={searchDomain}
                onChange={(e) => setSearchDomain(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Domains</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="DevOps">DevOps</option>
                <option value="Data Science">Data Science</option>
                <option value="Product Management">Product Management</option>
                <option value="Cybersecurity">Cybersecurity</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Rating
              </label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="0">All Ratings</option>
                <option value="3">3+ stars</option>
                <option value="4">4+ stars</option>
                <option value="5">5 stars only</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchDomain('');
                  setMinRating(0);
                }}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Trainers Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrainers.length > 0 ? (
              filteredTrainers.map((trainer) => (
                <div
                  key={trainer.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{trainer.full_name}</h3>
                      <p className="text-sm text-gray-500">
                        {trainer.expertise_domains.slice(0, 2).join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex text-yellow-400">
                      {'★'.repeat(Math.round(trainer.average_rating))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {trainer.average_rating.toFixed(1)} ({trainer.total_reviews})
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mb-4">
                    {trainer.total_sessions} sessions completed
                  </p>

                  <Link
                    href={`/student/trainers/${trainer.id}`}
                    className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition"
                  >
                    View & Book
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No trainers found matching your filters</p>
              </div>
            )}
          </div>

          {trainers.length === 0 && filteredTrainers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Loading trainers...</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
