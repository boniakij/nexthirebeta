'use client';

import { useState, useEffect, Suspense } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Card, CardBody, CardHeader, Button, Badge, Spinner, Input } from '@/components/ui';
import { trainerApi } from '@/lib/api/trainer';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';

interface TimeSlot {
  id?: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
}

interface AvailabilityDay {
  date: string;
  slots: TimeSlot[];
}

function AvailabilityContent() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [newSlotStart, setNewSlotStart] = useState('09:00');
  const [newSlotEnd, setNewSlotEnd] = useState('10:00');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      // Fetch availability for selected date
      setSlots(getMockSlots(selectedDate));
    }
  }, [selectedDate]);

  const handleAddSlot = () => {
    if (newSlotStart && newSlotEnd) {
      setSlots([...slots, { start_time: newSlotStart, end_time: newSlotEnd, is_booked: false }]);
      setNewSlotStart('10:00');
      setNewSlotEnd('11:00');
    }
  };

  const handleRemoveSlot = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  const handleSaveAvailability = async () => {
    try {
      setLoading(true);
      if (selectedDate && slots.length > 0) {
        await trainerApi.setAvailability({
          date: selectedDate,
          slots: slots.map((s) => ({ start_time: s.start_time, end_time: s.end_time })),
        });
        alert('Availability saved successfully!');
        setSelectedDate(null);
        setSlots([]);
      }
    } catch (error) {
      console.error('Failed to save availability:', error);
      alert('Failed to save availability');
    } finally {
      setLoading(false);
    }
  };

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">📅 Availability Calendar</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-btn">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-bold text-gray-900">{monthName}</h2>
                <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-btn">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center font-semibold text-gray-600 text-sm">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {blanks.map((_, i) => (
                  <div key={`blank-${i}`} />
                ))}
                {days.map((day) => {
                  const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                  const dateStr = date.toISOString().split('T')[0];
                  const isSelected = selectedDate === dateStr;
                  const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

                  return (
                    <button
                      key={day}
                      onClick={() => !isPast && setSelectedDate(dateStr)}
                      disabled={isPast}
                      className={`p-3 rounded-btn text-sm font-semibold transition ${
                        isSelected
                          ? 'bg-primary-600 text-white'
                          : isPast
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Slot Management */}
        <Card>
          <CardHeader>
            <h2 className="font-bold text-gray-900">
              {selectedDate ? `Slots for ${selectedDate}` : 'Select a Date'}
            </h2>
          </CardHeader>
          <CardBody className="space-y-4">
            {selectedDate ? (
              <>
                <div className="space-y-3">
                  {slots.map((slot, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-btn flex items-center justify-between ${
                        slot.is_booked ? 'bg-blue-100' : 'bg-green-100'
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-gray-900">
                          {slot.start_time} - {slot.end_time}
                        </p>
                        <Badge variant={slot.is_booked ? 'primary' : 'success'} className="text-xs mt-1">
                          {slot.is_booked ? 'Booked' : 'Available'}
                        </Badge>
                      </div>
                      {!slot.is_booked && (
                        <button
                          onClick={() => handleRemoveSlot(idx)}
                          className="p-1 hover:bg-red-200 rounded transition"
                        >
                          <X className="w-4 h-4 text-danger-600" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Add Time Slot</label>
                  <div className="space-y-2 mb-3">
                    <Input
                      type="time"
                      value={newSlotStart}
                      onChange={(e) => setNewSlotStart(e.target.value)}
                      placeholder="Start time"
                    />
                    <Input
                      type="time"
                      value={newSlotEnd}
                      onChange={(e) => setNewSlotEnd(e.target.value)}
                      placeholder="End time"
                    />
                  </div>
                  <Button onClick={handleAddSlot} variant="outline" className="w-full flex items-center justify-center gap-2 mb-3">
                    <Plus className="w-4 h-4" />
                    Add Slot
                  </Button>
                </div>

                {slots.length > 0 && (
                  <Button
                    onClick={handleSaveAvailability}
                    loading={loading}
                    className="w-full"
                  >
                    Save Availability
                  </Button>
                )}
              </>
            ) : (
              <p className="text-center text-gray-500 py-8">Select a date to manage slots</p>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default function AvailabilityPage() {
  return (
    <RoleGuard allowedRoles={['trainer']}>
      <DashboardLayout>
        <Suspense
          fallback={
            <div className="flex justify-center items-center min-h-screen">
              <Spinner size="lg" />
            </div>
          }
        >
          <AvailabilityContent />
        </Suspense>
      </DashboardLayout>
    </RoleGuard>
  );
}

function getMockSlots(date: string): TimeSlot[] {
  return [
    { start_time: '09:00', end_time: '10:00', is_booked: false },
    { start_time: '10:30', end_time: '11:30', is_booked: true },
    { start_time: '14:00', end_time: '15:00', is_booked: false },
    { start_time: '15:30', end_time: '16:30', is_booked: false },
  ];
}
