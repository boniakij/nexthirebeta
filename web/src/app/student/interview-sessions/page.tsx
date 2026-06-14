'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Badge, Button } from '@/components/ui';
import { Search, Star, Users, Clock, Calendar } from 'lucide-react';

interface Package {
  id: number;
  title: string;
  category: string;
  difficulty_level: string;
  price: number;
  discount_price?: number;
  number_of_sessions: number;
  session_duration: number;
  trainer: { name: string; rating: number };
  total_bookings: number;
}

export default function InterviewSessionsPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // TODO: Call API trainerApi.getAvailablePackages()
    setTimeout(() => {
      setPackages([
        {
          id: 1,
          title: 'Cybersecurity Mock Interview',
          category: 'Cybersecurity',
          difficulty_level: 'Advanced',
          price: 99,
          discount_price: 79,
          number_of_sessions: 3,
          session_duration: 40,
          trainer: { name: 'John Smith', rating: 4.8 },
          total_bookings: 45,
        },
        {
          id: 2,
          title: 'Web Development Technical Interview',
          category: 'Web Development',
          difficulty_level: 'Intermediate',
          price: 79,
          number_of_sessions: 4,
          session_duration: 50,
          trainer: { name: 'Sarah Johnson', rating: 4.6 },
          total_bookings: 32,
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const getDifficultyColor = (level: string) => {
    switch(level) {
      case 'Beginner': return 'primary';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'danger';
      default: return 'gray';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Interview Sessions</h1>
        <p className="text-gray-600 mt-2">Find and book mock interview sessions with expert trainers</p>
      </div>

      <div className="bg-white rounded-lg p-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search interviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-600"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {['all', 'Cybersecurity', 'Web Development', 'Cloud Computing'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium ${selectedCategory === cat ? 'bg-primary-600 text-white' : 'bg-gray-100'}`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map(pkg => (
          <Card key={pkg.id} className="hover:shadow-lg transition-shadow">
            <CardBody className="space-y-4">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{pkg.title}</h3>
                <div className="flex gap-2 mt-2">
                  <Badge variant={getDifficultyColor(pkg.difficulty_level)}>{pkg.difficulty_level}</Badge>
                  <Badge variant="primary">{pkg.category}</Badge>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{pkg.trainer.name}</span>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 ml-auto" />
                  <span>{pkg.trainer.rating}/5</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{pkg.number_of_sessions} sessions</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{pkg.session_duration} min per session</span>
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                {pkg.discount_price ? (
                  <>
                    <span className="text-2xl font-bold text-primary-600">${pkg.discount_price}</span>
                    <span className="text-sm line-through text-gray-400">${pkg.price}</span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-primary-600">${pkg.price}</span>
                )}
              </div>

              <Button variant="primary" className="w-full">Book Now</Button>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
