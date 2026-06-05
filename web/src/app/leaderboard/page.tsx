'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Tabs, Card, CardBody, Avatar, Badge, Skeleton, EmptyState } from '@/components/ui';
import { formatDateRelative } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';

interface LeaderboardEntry {
  rank: number;
  student_id: number;
  name: string;
  avatar: string | null;
  xp: number;
  level: number;
  badges_count: number;
  country: string;
  is_me?: boolean;
}

const MOCK_DATA: Record<string, LeaderboardEntry[]> = {
  global: [
    {
      rank: 1,
      student_id: 1,
      name: 'Arjun Kumar',
      avatar: null,
      xp: 25000,
      level: 10,
      badges_count: 15,
      country: 'India',
    },
    {
      rank: 2,
      student_id: 2,
      name: 'Fatima Ahmed',
      avatar: null,
      xp: 24500,
      level: 10,
      badges_count: 14,
      country: 'Bangladesh',
    },
    {
      rank: 3,
      student_id: 3,
      name: 'Rahul Singh',
      avatar: null,
      xp: 23800,
      level: 9,
      badges_count: 13,
      country: 'India',
    },
    {
      rank: 4,
      student_id: 4,
      name: 'Ayesha Khan',
      avatar: null,
      xp: 22100,
      level: 9,
      badges_count: 12,
      country: 'Pakistan',
    },
    {
      rank: 5,
      student_id: 5,
      name: 'Priya Sharma',
      avatar: null,
      xp: 20500,
      level: 8,
      badges_count: 11,
      country: 'India',
    },
    ...Array.from({ length: 95 }, (_, i) => ({
      rank: i + 6,
      student_id: i + 6,
      name: `User ${i + 6}`,
      avatar: null,
      xp: 15000 - i * 100,
      level: Math.max(1, 8 - Math.floor(i / 20)),
      badges_count: Math.max(1, 10 - Math.floor(i / 15)),
      country: ['India', 'Bangladesh', 'Pakistan'][i % 3],
    })),
  ],
  bangladesh: [
    {
      rank: 1,
      student_id: 2,
      name: 'Fatima Ahmed',
      avatar: null,
      xp: 24500,
      level: 10,
      badges_count: 14,
      country: 'Bangladesh',
    },
    {
      rank: 2,
      student_id: 6,
      name: 'Nadia Islam',
      avatar: null,
      xp: 21000,
      level: 9,
      badges_count: 12,
      country: 'Bangladesh',
    },
    {
      rank: 3,
      student_id: 7,
      name: 'Rahim Hassan',
      avatar: null,
      xp: 19500,
      level: 8,
      badges_count: 11,
      country: 'Bangladesh',
    },
  ],
  india: [
    {
      rank: 1,
      student_id: 1,
      name: 'Arjun Kumar',
      avatar: null,
      xp: 25000,
      level: 10,
      badges_count: 15,
      country: 'India',
    },
    {
      rank: 2,
      student_id: 3,
      name: 'Rahul Singh',
      avatar: null,
      xp: 23800,
      level: 9,
      badges_count: 13,
      country: 'India',
    },
  ],
  pakistan: [
    {
      rank: 1,
      student_id: 4,
      name: 'Ayesha Khan',
      avatar: null,
      xp: 22100,
      level: 9,
      badges_count: 12,
      country: 'Pakistan',
    },
  ],
};

const countryFlags: Record<string, string> = {
  India: '🇮🇳',
  Bangladesh: '🇧🇩',
  Pakistan: '🇵🇰',
};

const levelColors: Record<number, string> = {
  1: 'bg-gray-100 text-gray-700',
  10: 'bg-purple-100 text-purple-700',
  9: 'bg-blue-100 text-blue-700',
  8: 'bg-green-100 text-green-700',
};

export default function LeaderboardPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('global');
  const [loading, setLoading] = useState(false);

  const currentData = MOCK_DATA[activeTab] || MOCK_DATA.global;
  const top3 = currentData.slice(0, 3);
  const rest = currentData.slice(3);

  const tabs = [
    { id: 'global', label: 'Global', count: MOCK_DATA.global.length },
    { id: 'bangladesh', label: 'Bangladesh', count: MOCK_DATA.bangladesh.length },
    { id: 'india', label: 'India', count: MOCK_DATA.india.length },
    { id: 'pakistan', label: 'Pakistan', count: MOCK_DATA.pakistan.length },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🏆 Leaderboard</h1>
          <p className="text-gray-600">Compete globally and earn your place on the leaderboard</p>
        </div>

        {/* Tabs */}
        <Card className="mb-8">
          <CardBody>
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          </CardBody>
        </Card>

        {/* Top 3 Podium */}
        {top3.length > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* 2nd Place */}
              {top3[1] && (
                <Card className="md:order-first">
                  <CardBody className="text-center">
                    <div className="mb-4">
                      <div className="text-6xl mb-2">🥈</div>
                      <Avatar
                        src={top3[1].avatar || undefined}
                        name={top3[1].name}
                        size="xl"
                        className="mx-auto"
                      />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">{top3[1].name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{countryFlags[top3[1].country]}</p>
                    <div className="bg-gray-50 rounded-btn p-3 mb-2">
                      <p className="text-2xl font-bold text-primary-600">{top3[1].xp.toLocaleString()}</p>
                      <p className="text-xs text-gray-600">XP</p>
                    </div>
                    <Badge variant="primary" className="inline-block">
                      Level {top3[1].level}
                    </Badge>
                  </CardBody>
                </Card>
              )}

              {/* 1st Place */}
              {top3[0] && (
                <Card className="border-2 border-yellow-400 md:order-none">
                  <CardBody className="text-center">
                    <div className="mb-4">
                      <div className="text-7xl mb-2">🥇</div>
                      <Avatar
                        src={top3[0].avatar || undefined}
                        name={top3[0].name}
                        size="xl"
                        className="mx-auto"
                      />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">{top3[0].name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{countryFlags[top3[0].country]}</p>
                    <div className="bg-yellow-50 rounded-btn p-3 mb-2">
                      <p className="text-2xl font-bold text-yellow-600">{top3[0].xp.toLocaleString()}</p>
                      <p className="text-xs text-gray-600">XP</p>
                    </div>
                    <Badge variant="warning" className="inline-block">
                      Level {top3[0].level}
                    </Badge>
                  </CardBody>
                </Card>
              )}

              {/* 3rd Place */}
              {top3[2] && (
                <Card className="md:order-last">
                  <CardBody className="text-center">
                    <div className="mb-4">
                      <div className="text-6xl mb-2">🥉</div>
                      <Avatar
                        src={top3[2].avatar || undefined}
                        name={top3[2].name}
                        size="xl"
                        className="mx-auto"
                      />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">{top3[2].name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{countryFlags[top3[2].country]}</p>
                    <div className="bg-orange-50 rounded-btn p-3 mb-2">
                      <p className="text-2xl font-bold text-orange-600">{top3[2].xp.toLocaleString()}</p>
                      <p className="text-xs text-gray-600">XP</p>
                    </div>
                    <Badge variant="success" className="inline-block">
                      Level {top3[2].level}
                    </Badge>
                  </CardBody>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Rankings Table */}
        <Card>
          <CardBody>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Rank</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Student</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Country</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">XP</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Level</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Badges</th>
                  </tr>
                </thead>
                <tbody>
                  {rest.map((entry, idx) => (
                    <tr
                      key={entry.student_id}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition ${
                        entry.is_me ? 'bg-blue-50' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-semibold text-gray-900">{entry.rank}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar src={entry.avatar || undefined} name={entry.name} size="sm" />
                          <span className="font-medium text-gray-900">{entry.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {countryFlags[entry.country]} {entry.country}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-bold text-primary-600">{entry.xp.toLocaleString()}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant="primary" size="sm" className="inline-block">
                          {entry.level}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-sm font-medium text-gray-700">{entry.badges_count}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {rest.length === 0 && (
              <EmptyState
                icon="📊"
                title="No rankings yet"
                description="Be the first to claim a spot on the leaderboard!"
              />
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
