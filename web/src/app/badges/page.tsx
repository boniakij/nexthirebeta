'use client';

import { useEffect, useState } from 'react';
import { Card, Spinner } from '@/components/ui';
import axios from 'axios';
import BadgeCard from '@/components/gamification/BadgeCard';

export default function PublicBadgesPage() {
  const [badgesByCategory, setBadgesByCategory] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const categoryOrder = ['interview', 'skill', 'milestone', 'streak', 'profile', 'leaderboard', 'trainer', 'special'];

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const res = await axios.get('/api/v1/badges');
        setBadgesByCategory(res.data?.data || {});
      } catch (error) {
        console.error('Failed to fetch badges:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  const getCategoryTitle = (category: string): string => {
    const titles: Record<string, string> = {
      interview: 'Interview Badges',
      skill: 'Skill Badges',
      milestone: 'Milestone Badges',
      streak: 'Streak Badges',
      profile: 'Profile Badges',
      leaderboard: 'Leaderboard Badges',
      trainer: 'Trainer Badges',
      special: 'Special Badges',
    };
    return titles[category] || category.charAt(0).toUpperCase() + category.slice(1);
  };

  const getCategoryDescription = (category: string): string => {
    const descriptions: Record<string, string> = {
      interview: 'Earn these by completing mock interviews',
      skill: 'Demonstrate your expertise and skills',
      milestone: 'Reach major achievements',
      streak: 'Maintain consistent progress',
      profile: 'Complete your profile and upload documents',
      leaderboard: 'Rank among the top performers',
      trainer: 'Achievements for interview coaches',
      special: 'Exclusive and limited-time badges',
    };
    return descriptions[category] || '';
  };

  return (
    <div className="space-y-12">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Badges</h1>
        <p className="text-xl text-gray-600">Unlock achievements and showcase your progress</p>
      </div>

      {categoryOrder.map(category => {
        const badges = badgesByCategory[category] || [];
        if (badges.length === 0) return null;

        return (
          <section key={category} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{getCategoryTitle(category)}</h2>
              <p className="text-gray-600 mt-1">{getCategoryDescription(category)}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {badges.map((badge: any) => (
                <BadgeCard
                  key={badge.id}
                  name={badge.name}
                  description={badge.description}
                  iconUrl={badge.icon_path}
                  xpReward={badge.xp_reward}
                  isUnlocked={true}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
