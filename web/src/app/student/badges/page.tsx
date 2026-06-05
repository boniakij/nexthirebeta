'use client';

import { useState, useEffect, Suspense } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Card, CardBody, CardHeader, Badge as BadgeComponent, Spinner } from '@/components/ui';
import { gamificationApi } from '@/lib/api/gamification';
import { Lock, Zap, Trophy } from 'lucide-react';

interface Badge {
  id: number;
  slug: string;
  name: string;
  description: string;
  icon_path: string | null;
  xp_reward: number;
  category: 'achievement' | 'skill' | 'milestone' | 'special';
  unlocked_at?: string;
  is_locked?: boolean;
}

function BadgesContent() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [myBadges, setMyBadges] = useState<Badge[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const [allRes, myRes] = await Promise.all([
          gamificationApi.getAllBadges(),
          gamificationApi.getMyBadges(),
        ]);

        const allBadges = allRes.data.data || [];
        const myBadgeIds = (myRes.data.data || []).map((b: Badge) => b.id);

        // Mark badges as locked/unlocked
        const enrichedBadges = allBadges.map((badge: Badge) => ({
          ...badge,
          is_locked: !myBadgeIds.includes(badge.id),
        }));

        setBadges(enrichedBadges);
        setMyBadges(myRes.data.data || []);
      } catch (error) {
        console.error('Failed to fetch badges:', error);
        const mockBadges = getMockBadges();
        setBadges(mockBadges);
        setMyBadges(mockBadges.filter((b) => !b.is_locked));
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, []);

  const categories = [
    { id: 'all', label: 'All Badges' },
    { id: 'achievement', label: 'Achievements' },
    { id: 'skill', label: 'Skills' },
    { id: 'milestone', label: 'Milestones' },
    { id: 'special', label: 'Special' },
  ];

  const filteredBadges =
    selectedCategory === 'all'
      ? badges
      : badges.filter((badge) => badge.category === selectedCategory);

  // Sort: unlocked first, then by category
  const sortedBadges = [...filteredBadges].sort((a, b) => {
    if (a.is_locked === b.is_locked) return 0;
    return a.is_locked ? 1 : -1;
  });

  const unlockedCount = badges.filter((b) => !b.is_locked).length;
  const lockedCount = badges.filter((b) => b.is_locked).length;

  const categoryIcons: Record<string, string> = {
    achievement: '🎯',
    skill: '⚡',
    milestone: '🏆',
    special: '✨',
  };

  const BadgeCard = ({ badge }: { badge: Badge }) => (
    <div
      className={`p-6 rounded-btn text-center transition-all ${
        badge.is_locked
          ? 'bg-gray-100 opacity-60'
          : 'bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200'
      }`}
    >
      <div className="relative inline-block mb-3">
        <div className="text-5xl">{badge.icon_path || categoryIcons[badge.category] || '🏅'}</div>
        {badge.is_locked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
            <Lock className="w-6 h-6 text-white" />
          </div>
        )}
        {badge.unlocked_at && !badge.is_locked && (
          <div className="absolute -top-2 -right-2 bg-success-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
            ✓
          </div>
        )}
      </div>

      <p className="font-bold text-gray-900 mb-1">{badge.name}</p>
      <p className="text-xs text-gray-600 mb-2 h-10 line-clamp-2">{badge.description}</p>

      <div className="flex items-center justify-between">
        <BadgeComponent variant="primary" className="text-xs">
          {categoryIcons[badge.category]} {badge.category}
        </BadgeComponent>
        <div className="flex items-center gap-1 text-xs font-semibold text-purple-600">
          <Zap className="w-3 h-3" />
          +{badge.xp_reward}
        </div>
      </div>

      {badge.unlocked_at && (
        <p className="text-xs text-gray-500 mt-2">Unlocked {new Date(badge.unlocked_at).toLocaleDateString()}</p>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Spinner key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">🏆 Badges</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card>
          <CardBody className="text-center">
            <p className="text-2xl font-bold text-success-500">{unlockedCount}</p>
            <p className="text-xs text-gray-600">Badges Earned</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-2xl font-bold text-warning-400">{lockedCount}</p>
            <p className="text-xs text-gray-600">Locked</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-2xl font-bold text-primary-600">
              {Math.round((unlockedCount / badges.length) * 100)}%
            </p>
            <p className="text-xs text-gray-600">Completion</p>
          </CardBody>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-btn text-sm font-medium transition ${
              selectedCategory === category.id
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      {sortedBadges.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedBadges.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} />
          ))}
        </div>
      ) : (
        <Card>
          <CardBody className="text-center py-12">
            <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No badges in this category</p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

export default function BadgesPage() {
  return (
    <RoleGuard allowedRoles={['student']}>
      <DashboardLayout>
        <Suspense
          fallback={
            <div className="flex justify-center items-center min-h-screen">
              <Spinner size="lg" />
            </div>
          }
        >
          <BadgesContent />
        </Suspense>
      </DashboardLayout>
    </RoleGuard>
  );
}

function getMockBadges(): Badge[] {
  return [
    {
      id: 1,
      slug: 'first-interview',
      name: 'First Interview',
      description: 'Complete your first mock interview',
      icon_path: '🎯',
      xp_reward: 50,
      category: 'achievement',
      unlocked_at: '2026-06-01',
      is_locked: false,
    },
    {
      id: 2,
      slug: 'five-sessions',
      name: 'Five Sessions',
      description: 'Complete 5 interview sessions',
      icon_path: '⚡',
      xp_reward: 100,
      category: 'milestone',
      unlocked_at: '2026-06-03',
      is_locked: false,
    },
    {
      id: 3,
      slug: 'seven-day-streak',
      name: '7 Day Streak',
      description: 'Maintain a 7 day practice streak',
      icon_path: '🔥',
      xp_reward: 75,
      category: 'achievement',
      unlocked_at: '2026-06-05',
      is_locked: false,
    },
    {
      id: 4,
      slug: 'perfect-score',
      name: 'Perfect Score',
      description: 'Score 10/10 in an evaluation',
      icon_path: '⭐',
      xp_reward: 200,
      category: 'special',
      is_locked: true,
    },
    {
      id: 5,
      slug: 'system-design-pro',
      name: 'System Design Pro',
      description: 'Complete 3 system design interviews',
      icon_path: '🏗️',
      xp_reward: 150,
      category: 'skill',
      is_locked: true,
    },
    {
      id: 6,
      slug: 'coding-master',
      name: 'Coding Master',
      description: 'Score average 8+ in coding interviews',
      icon_path: '💻',
      xp_reward: 150,
      category: 'skill',
      is_locked: true,
    },
    {
      id: 7,
      slug: 'top-100',
      name: 'Top 100',
      description: 'Reach rank 100 on leaderboard',
      icon_path: '👑',
      xp_reward: 300,
      category: 'milestone',
      is_locked: true,
    },
    {
      id: 8,
      slug: 'top-10',
      name: 'Top 10',
      description: 'Reach rank 10 on leaderboard',
      icon_path: '🌟',
      xp_reward: 500,
      category: 'special',
      is_locked: true,
    },
  ];
}
