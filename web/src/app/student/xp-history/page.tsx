'use client';

import { useEffect, useState } from 'react';
import { Card, Spinner } from '@/components/ui';
import axios from 'axios';

export default function XPHistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('/api/v1/students/me/xp-history');
        setHistory(res.data?.data || []);
      } catch (error) {
        console.error('Failed to fetch XP history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  const totalXP = history.reduce((sum, entry) => sum + entry.xp_amount, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">XP History</h1>
        <p className="text-gray-600 mt-1">Total XP: {totalXP.toLocaleString()}</p>
      </div>

      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Event</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">XP</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {new Date(entry.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-900">{entry.event_label}</td>
                  <td className="px-6 py-3 text-sm font-semibold text-primary-600 text-right">
                    +{entry.xp_amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {history.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No XP history yet</p>
        </div>
      )}
    </div>
  );
}
