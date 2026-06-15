'use client';

import { useEffect, useState } from 'react';
import { Button, Card, Badge, Spinner } from '@/components/ui';
import axios from 'axios';
import BadgeCard from '@/components/gamification/BadgeCard';

export default function StudentBadgesPage() {
  const [badges, setBadges] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const res = await axios.get('/api/v1/students/me/badges');
        setBadges(res.data?.data || []);
      } catch (error) {
        console.error('Failed to fetch badges:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, []);

  const filteredBadges = badges.filter(badge => {
    if (filter === 'earned') return badge.is_unlocked;
    if (filter === 'locked') return !badge.is_unlocked;
    return true;
  });

  const stats = {
    earned: badges.filter(b => b.is_unlocked).length,
    total: badges.length,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Badges</h1>
        <p className="text-gray-600 mt-1">Earned {stats.earned} of {stats.total} badges</p>
      </div>

      <Card className="border-0 shadow-sm">
        <div className="p-6 flex gap-2 flex-wrap">
          {['all', 'earned', 'locked'].map(f => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              onClick={() => setFilter(f)}
              className="capitalize"
            >
              {f === 'all' ? 'All' : f === 'earned' ? 'Earned' : 'Locked'}
            </Button>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredBadges.map(badge => (
          <BadgeCard
            key={badge.badge_id}
            name={badge.name}
            description={badge.description}
            iconUrl={badge.icon_url}
            xpReward={badge.xp_reward}
            isUnlocked={badge.is_unlocked}
            currentProgress={badge.progress}
          />
        ))}
      </div>

      {filteredBadges.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No badges to display</p>
        </div>
      )}
    </div>
  );
}
