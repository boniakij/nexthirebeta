'use client';

import { useEffect, useState } from 'react';
import { Card, Spinner, Badge } from '@/components/ui';
import axios from 'axios';

export default function LeaderboardPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [scope, setScope] = useState<'global' | 'country'>('global');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const endpoint = scope === 'global'
          ? '/api/v1/leaderboard/global'
          : '/api/v1/leaderboard/country/BD';
        
        const res = await axios.get(endpoint);
        setUsers(res.data?.data || []);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [scope]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
          <p className="text-gray-600 mt-1">Top performers by XP</p>
        </div>
        <div className="flex gap-2">
          {(['global', 'country'] as const).map(s => (
            <button
              key={s}
              onClick={() => setScope(s)}
              className={`px-4 py-2 rounded font-medium transition-colors ${
                scope === s
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {s === 'global' ? 'Global' : 'Bangladesh'}
            </button>
          ))}
        </div>
      </div>

      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Rank</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Level</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">XP</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Badges</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={user.user_id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-center">
                      {idx < 3 ? (
                        <span className={`text-lg font-bold ${
                          idx === 0 ? 'text-yellow-500' :
                          idx === 1 ? 'text-gray-400' :
                          'text-orange-500'
                        }`}>
                          {'🥇🥈🥉'[idx]}
                        </span>
                      ) : (
                        <span className="text-sm font-semibold text-gray-600">#{idx + 1}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm font-medium text-gray-900">User {user.user_id}</td>
                  <td className="px-6 py-3 text-center">
                    <Badge>{user.current_level}</Badge>
                  </td>
                  <td className="px-6 py-3 text-right text-sm font-bold text-primary-600">
                    {user.total_xp.toLocaleString()}
                  </td>
                  <td className="px-6 py-3 text-center text-sm font-semibold text-gray-600">
                    {user.badges_count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {users.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No leaderboard data yet</p>
        </div>
      )}
    </div>
  );
}
