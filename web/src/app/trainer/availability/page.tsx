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

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarSlots, setCalendarSlots] = useState<any[]>([]);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [weeklyRes, rulesRes, slotsRes] = await Promise.all([
          apiClient.get('/trainers/me/availability/weekly-schedule').catch(() => ({ data: { success: false, data: [] } })),
          apiClient.get('/trainers/me/availability/booking-rules').catch(() => ({ data: { success: false, data: {} } })),
          apiClient.get('/trainers/me/availability/calendar', {
            params: {
              start_date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0],
              end_date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0],
            },
          }).catch(() => ({ data: { success: false, data: {} } })),
        ]);

        if (weeklyRes.data?.success) setWeeklySchedule(weeklyRes.data.data);
        if (rulesRes.data?.success) setBookingRules(rulesRes.data.data);
        if (slotsRes.data?.success) setCalendarSlots(Object.values(slotsRes.data.data).flat());
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentDate]);

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthDays = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const getSlotStatus = (date: string) => {
    const slots = calendarSlots.filter((s: any) => s.date === date);
    if (slots.length === 0) return 'none';
    if (slots.some((s: any) => s.status === 'booked')) return 'booked';
    if (slots.some((s: any) => s.status === 'available')) return 'available';
    return 'other';
  };

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
          <CardHeader className="flex justify-between items-center border-b pb-4">
            <h2 className="text-xl font-bold">Availability Calendar</h2>
            <div className="flex gap-2 items-center">
              <Button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                variant="outline"
                className="px-3 py-1 text-sm"
              >
                ←
              </Button>
              <span className="font-semibold text-gray-900 min-w-32 text-center">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <Button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                variant="outline"
                className="px-3 py-1 text-sm"
              >
                →
              </Button>
              <Button
                onClick={() => setCurrentDate(new Date())}
                variant="outline"
                className="px-3 py-1 text-sm"
              >
                Today
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            {/* Legend */}
            <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-200 border-2 border-green-600 rounded"></div>
                <span className="text-sm text-gray-600">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-200 border-2 border-blue-600 rounded"></div>
                <span className="text-sm text-gray-600">Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 border-2 border-gray-400 rounded"></div>
                <span className="text-sm text-gray-600">No Slots</span>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="overflow-x-auto">
              <div className="grid grid-cols-7 gap-1 mb-4">
                {/* Day headers */}
                {days.map(day => (
                  <div key={day} className="text-center font-semibold text-gray-600 py-2 text-sm">
                    {day.slice(0, 3)}
                  </div>
                ))}

                {/* Empty cells for days before month starts */}
                {Array.from({ length: firstDay }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="aspect-square bg-gray-50 rounded-lg border border-gray-100"></div>
                ))}

                {/* Calendar days */}
                {Array.from({ length: monthDays }).map((_, idx) => {
                  const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), idx + 1);
                  const dateStr = date.toISOString().split('T')[0];
                  const status = getSlotStatus(dateStr);
                  const isToday = new Date().toDateString() === date.toDateString();

                  let bgColor = 'bg-gray-50 border-gray-200';
                  if (status === 'available') bgColor = 'bg-green-50 border-green-300';
                  if (status === 'booked') bgColor = `bg-blue-50 border-blue-300`;

                  return (
                    <div
                      key={idx}
                      className={`aspect-square rounded-lg border-2 p-2 cursor-pointer hover:shadow-md transition ${bgColor} ${
                        isToday ? 'ring-2 ring-blue-600' : ''
                      }`}
                    >
                      <div className="h-full flex flex-col items-center justify-center">
                        <span className={`text-sm font-semibold ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                          {idx + 1}
                        </span>
                        {status === 'available' && <span className="text-xs text-green-600 mt-0.5">●</span>}
                        {status === 'booked' && <span className="text-xs text-blue-600 mt-0.5">●</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Calendar Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Total Slots:</span> {calendarSlots.length} •{' '}
                <span className="font-semibold text-green-600">Available:</span> {calendarSlots.filter((s: any) => s.status === 'available').length} •{' '}
                <span className="font-semibold text-blue-600">Booked:</span> {calendarSlots.filter((s: any) => s.status === 'booked').length}
              </p>
            </div>
          </CardBody>
        </Card>
      )}

      {!loading && activeTab === 'weekly' && (
        <Card className="shadow-lg border-0">
          <CardHeader className="flex justify-between items-center border-b pb-4">
            <h2 className="text-xl font-bold">Weekly Schedule</h2>
            {!editingWeekly && (
              <Button onClick={() => setEditingWeekly(true)} className="bg-blue-600 hover:bg-blue-700">
                Edit Schedule
              </Button>
            )}
          </CardHeader>
          <CardBody className="space-y-4">
            <p className="text-gray-600 mb-4">Set your regular weekly availability hours.</p>
            {days.map((day, idx) => {
              const schedule = weeklySchedule.find((s: any) => s.day_of_week === idx);
              return (
                <div key={day} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{day}</h3>
                    {editingWeekly ? (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={schedule?.is_available || false}
                          onChange={(e) => {
                            const updated = weeklySchedule.filter((s: any) => s.day_of_week !== idx);
                            if (e.target.checked) {
                              updated.push({
                                day_of_week: idx,
                                is_available: true,
                                start_time: schedule?.start_time || '09:00',
                                end_time: schedule?.end_time || '17:00',
                                slot_duration_minutes: schedule?.slot_duration_minutes || 60,
                                buffer_minutes: schedule?.buffer_minutes || 15,
                              });
                            }
                            setWeeklySchedule(updated);
                          }}
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm font-medium">Available</span>
                      </label>
                    ) : (
                      <Badge variant={schedule?.is_available ? 'success' : 'gray'}>
                        {schedule?.is_available ? 'Available' : 'Not Available'}
                      </Badge>
                    )}
                  </div>

                  {schedule?.is_available && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 pt-3 border-t border-blue-200">
                      {editingWeekly ? (
                        <>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Start</label>
                            <input
                              type="time"
                              value={schedule?.start_time || '09:00'}
                              onChange={(e) => {
                                const updated = weeklySchedule.map((s: any) =>
                                  s.day_of_week === idx ? { ...s, start_time: e.target.value } : s
                                );
                                setWeeklySchedule(updated);
                              }}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">End</label>
                            <input
                              type="time"
                              value={schedule?.end_time || '17:00'}
                              onChange={(e) => {
                                const updated = weeklySchedule.map((s: any) =>
                                  s.day_of_week === idx ? { ...s, end_time: e.target.value } : s
                                );
                                setWeeklySchedule(updated);
                              }}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Slot (min)</label>
                            <input
                              type="number"
                              value={schedule?.slot_duration_minutes || 60}
                              onChange={(e) => {
                                const updated = weeklySchedule.map((s: any) =>
                                  s.day_of_week === idx ? { ...s, slot_duration_minutes: parseInt(e.target.value) } : s
                                );
                                setWeeklySchedule(updated);
                              }}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                              min="15"
                              max="480"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Buffer (min)</label>
                            <input
                              type="number"
                              value={schedule?.buffer_minutes || 15}
                              onChange={(e) => {
                                const updated = weeklySchedule.map((s: any) =>
                                  s.day_of_week === idx ? { ...s, buffer_minutes: parseInt(e.target.value) } : s
                                );
                                setWeeklySchedule(updated);
                              }}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                              min="0"
                              max="60"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <p className="text-xs text-gray-600">Start</p>
                            <p className="text-sm font-medium text-gray-900">{schedule?.start_time}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">End</p>
                            <p className="text-sm font-medium text-gray-900">{schedule?.end_time}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Slot</p>
                            <p className="text-sm font-medium text-gray-900">{schedule?.slot_duration_minutes}m</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Buffer</p>
                            <p className="text-sm font-medium text-gray-900">{schedule?.buffer_minutes}m</p>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {editingWeekly && (
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                <Button
                  onClick={async () => {
                    try {
                      setLoading(true);
                      const response = await apiClient.put('/trainers/me/availability/weekly-schedule', {
                        schedule: weeklySchedule,
                      });
                      if (response.data?.success) {
                        setEditingWeekly(false);
                        setError('');
                        alert('Weekly schedule updated!');
                      }
                    } catch (err: any) {
                      setError(err.response?.data?.message || 'Failed to save schedule');
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="bg-green-600 hover:bg-green-700 flex-1"
                >
                  Save Schedule
                </Button>
                <Button
                  onClick={() => setEditingWeekly(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            )}
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
