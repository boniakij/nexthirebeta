'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardBody, Button, Badge, Spinner } from '@/components/ui';
import { ArrowRight, Filter } from 'lucide-react';
import axios from 'axios';

export default function PackagesPage() {
  const [packages, setPackages] = useState<any[]>([
    { id: 1, title: 'Beginner Interview Prep', price: 2000, difficulty_level: 'beginner', duration: 30, sessions: 3 },
    { id: 2, title: 'Intermediate Interview Prep', price: 3500, difficulty_level: 'intermediate', duration: 45, sessions: 5 },
    { id: 3, title: 'Advanced Interview Prep', price: 5000, difficulty_level: 'advanced', duration: 60, sessions: 7 },
  ]);

  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await axios.get('/api/interview-packages?per_page=12');
        if (res.data?.data?.length > 0) {
          setPackages(res.data.data);
        }
      } catch (err) {
        console.log('Using mock packages data');
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const filteredPackages = filter === 'all'
    ? packages
    : packages.filter(pkg => pkg.difficulty_level === filter);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-br from-primary-50 to-purple-50 py-16 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Interview Packages</h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Choose the perfect interview preparation package for your skill level
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 overflow-x-auto pb-4">
            <Filter className="w-5 h-5 text-gray-500 flex-shrink-0" />
            {['all', 'beginner', 'intermediate', 'advanced'].map(level => (
              <button
                key={level}
                onClick={() => setFilter(level)}
                className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-colors ${
                  filter === level
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {level === 'all' ? 'All Packages' : level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <Spinner size="lg" />
            </div>
          ) : filteredPackages.length === 0 ? (
            <div className="text-center py-24">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No packages found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters</p>
              <button
                onClick={() => setFilter('all')}
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                View all packages
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPackages.map((pkg) => (
                <Card key={pkg.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-gray-200 flex flex-col h-full group">
                  <CardBody className="flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="primary" className="text-xs capitalize">
                        {pkg.difficulty_level}
                      </Badge>
                      <span className="text-xs text-gray-500">⏱️ {pkg.session_duration || pkg.duration}m</span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {pkg.title}
                    </h3>

                    <p className="text-sm text-gray-600 mb-6 flex-1">
                      {pkg.description || 'Professional interview preparation with personalized feedback and practice sessions.'}
                    </p>

                    <div className="space-y-2 mb-6 text-sm text-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Sessions:</span>
                        <span className="font-semibold">{pkg.number_of_sessions || pkg.sessions}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Validity:</span>
                        <span className="font-semibold">{pkg.package_validity || 90} days</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                      <div className="font-bold text-gray-900 text-lg">
                        ৳{(pkg.price || 0).toLocaleString()}
                      </div>
                      <Link href={`/packages/${pkg.id}`}>
                        <Button size="sm" className="gap-2">
                          View <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to level up your interview skills?</h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto text-lg">
            Pick a package and start your journey to landing your dream job today
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
