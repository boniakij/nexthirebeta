'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Badge, Button, Input, Spinner } from '@/components/ui';
import { Calendar, Plus, Trash2, Clock, Lock, Settings } from 'lucide-react';
import apiClient from '@/lib/api/client';

export default function AvailabilityPage() {
  const [activeTab, setActiveTab] = useState<'calendar' | 'weekly' | 'slots' | 'blocked' | 'rules'>('calendar');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Weekly Schedule State
  const [weeklySchedule, setWeeklySchedule] = useState<any[]>([]);
  const [editingWeekly, setEditingWeekly] = useState(false);

  // Slots State
  const [slots, setSlots] = useState<any[]>([]);
  const [newSlot, setNewSlot] = useState({ date: '', start_time: '', end_time: '', slot_duration_minutes: 45 });

  // Blocked Dates State
  const [blockedDates, setBlockedDates] = useState<any[]>([]);
  const [newBlockedDate, setNewBlockedDate] = useState({ block_type: 'personal_leave', date: '', is_full_day: true, reason: '' });

  // Booking Rules State
  const [bookingRules, setBookingRules] = useState<any>(null);
  const [editingRules, setEditingRules] = useState(false);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [weeklyRes, rulesRes] = await Promise.all([
          apiClient.get('/trainers/me/availability/weekly-schedule').catch(() => ({ data: { success: false, data: [] } })),
          apiClient.get('/trainers/me/availability/booking-rules').catch(() => ({ data: { success: false, data: {} } })),
        ]);

        if (weeklyRes.data?.success) setWeeklySchedule(weeklyRes.data.data);
        if (rulesRes.data?.success) setBookingRules(rulesRes.data.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
        <h1 className="text-3xl font-bold text-gray-900">Availability Calendar</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
        {[
          { id: 'calendar', label: '📅 Calendar' },
          { id: 'weekly', label: '🕐 Weekly Schedule' },
          { id: 'slots', label: '➕ Add Slot' },
          { id: 'blocked', label: '🔒 Block Dates' },
          { id: 'rules', label: '⚙️ Booking Rules' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      {!loading && activeTab === 'calendar' && (
        <Card className="shadow-lg border-0">
          <CardHeader><h2 className="text-xl font-bold">Availability Calendar</h2></CardHeader>
          <CardBody>
            <p className="text-gray-600">Calendar view coming soon. Use tabs to manage availability.</p>
          </CardBody>
        </Card>
      )}

      {!loading && activeTab === 'weekly' && (
        <Card className="shadow-lg border-0">
          <CardBody className="space-y-4">
            <p className="text-gray-600 mb-4">Set your regular weekly availability hours.</p>
            {days.map((day, idx) => (
              <div key={day} className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold">{day}</h3>
                <p className="text-sm text-gray-500 mt-2">Configure coming soon</p>
              </div>
            ))}
          </CardBody>
        </Card>
      )}

      {!loading && activeTab === 'slots' && (
        <Card className="shadow-lg border-0">
          <CardHeader><h2 className="text-xl font-bold">Add One-Time Slot</h2></CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input type="date" placeholder="Date" />
              <Input type="time" placeholder="Start Time" />
              <Input type="time" placeholder="End Time" />
              <Input type="number" placeholder="Duration (minutes)" min="15" />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 w-full">
              <Plus className="w-4 h-4 mr-2" /> Add Slot
            </Button>
          </CardBody>
        </Card>
      )}

      {!loading && activeTab === 'blocked' && (
        <Card className="shadow-lg border-0">
          <CardHeader><h2 className="text-xl font-bold">Block Dates</h2></CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select className="px-3 py-2 border border-gray-300 rounded-lg">
                <option>Personal Leave</option>
                <option>Public Holiday</option>
                <option>Emergency</option>
                <option>Vacation</option>
              </select>
              <Input type="date" placeholder="Date" />
              <Input placeholder="Reason (optional)" />
            </div>
            <Button className="bg-red-600 hover:bg-red-700 w-full">
              <Lock className="w-4 h-4 mr-2" /> Block Date
            </Button>
          </CardBody>
        </Card>
      )}

      {!loading && activeTab === 'rules' && (
        <Card className="shadow-lg border-0">
          <CardHeader><h2 className="text-xl font-bold">Booking Rules</h2></CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Minimum Notice</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">6 hours</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Max Booking Ahead</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">30 days</p>
              </div>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 mt-6">Edit Rules</Button>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
