'use client';

import { useEffect, useState } from 'react';
import { Card, Spinner } from '@/components/ui';
import axios from 'axios';
import BadgeCard from '@/components/gamification/BadgeCard';

export default function TrainerBadgesPage() {
  const [badges, setBadges] = useState<any[]>([]);
  const [xpSummary, setXpSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [badgesRes, xpRes] = await Promise.all([
          axios.get('/api/v1/trainers/me/badges'),
          axios.get('/api/v1/trainers/me/xp-summary'),
        ]);
        setBadges(badgesRes.data?.data || []);
        setXpSummary(xpRes.data?.data);
      } catch (error) {
        console.error('Failed to fetch trainer data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        <p className="text-gray-600 mt-1">Your achievements as a trainer</p>
      </div>

      {xpSummary && (
        <Card className="border-0 shadow-sm bg-gradient-to-r from-primary-50 to-purple-50">
          <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total XP</p>
              <p className="text-2xl font-bold text-primary-600">{xpSummary.total_xp.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Current Level</p>
              <p className="text-2xl font-bold text-primary-600">{xpSummary.current_level_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Badges Earned</p>
              <p className="text-2xl font-bold text-primary-600">{xpSummary.badges_earned}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Rating</p>
              <p className="text-2xl font-bold text-primary-600">⭐ {xpSummary.rating || '—'}</p>
            </div>
          </div>
        </Card>
      )}

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Badges Earned</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {badges.filter(b => b.is_unlocked).map(badge => (
            <BadgeCard
              key={badge.badge_id}
              name={badge.name}
              description={badge.description}
              iconUrl={badge.icon_url}
              xpReward={badge.xp_reward}
              isUnlocked={true}
            />
          ))}
        </div>
      </div>

      {badges.filter(b => !b.is_unlocked).length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Locked Badges</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {badges.filter(b => !b.is_unlocked).map(badge => (
              <BadgeCard
                key={badge.badge_id}
                name={badge.name}
                description={badge.description}
                iconUrl={badge.icon_url}
                xpReward={badge.xp_reward}
                isUnlocked={false}
                currentProgress={badge.progress}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
