'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Card, CardBody, Button } from '@/components/ui';
import { CheckCircle2, Calendar, Clock, User, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function BookingConfirmedPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardBody className="text-center py-12 space-y-6">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-20 h-20 bg-success-50 rounded-full flex items-center justify-center animate-bounce">
                  <CheckCircle2 className="w-12 h-12 text-success-500" />
                </div>
              </div>
            </div>

            {/* Heading */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed! 🎉</h1>
              <p className="text-gray-600">Your interview session has been successfully booked</p>
            </div>

            {/* Booking Details */}
            <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-btn p-6 space-y-4 text-left">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-primary-600 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-600">Trainer</p>
                  <p className="font-semibold text-gray-900">Arjun Kumar</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary-600 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-600">Date</p>
                  <p className="font-semibold text-gray-900">June 10, 2026</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary-600 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-600">Time</p>
                  <p className="font-semibold text-gray-900">2:00 PM (60 minutes)</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary-600 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-600">Meeting Link</p>
                  <p className="font-semibold text-gray-900 text-blue-600 break-all">
                    https://meet.nexthire.com/interview-abc123
                  </p>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-btn p-4 text-left">
              <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ A confirmation email has been sent to your inbox</li>
                <li>✓ Calendar invite added to your calendar</li>
                <li>✓ Join the session 5 minutes before the scheduled time</li>
                <li>✓ Make sure your camera and microphone are working</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => {
                  // Add to Google Calendar
                  const event = encodeURIComponent('System Design Interview with Arjun Kumar');
                  const details = encodeURIComponent('Mock interview session');
                  const startDate = '20260610T140000';
                  const endDate = '20260610T150000';
                  window.open(
                    `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${event}&details=${details}&dates=${startDate}/${endDate}`
                  );
                }}
              >
                📅 Add to Calendar
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Link href="/student/dashboard" className="block">
                  <Button variant="outline" className="w-full">
                    Go to Dashboard
                  </Button>
                </Link>
                <Link href="/student/sessions" className="block">
                  <Button variant="outline" className="w-full">
                    My Sessions
                  </Button>
                </Link>
              </div>
            </div>

            {/* Invoice */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Order #INV-2026-000123</p>
              <Button variant="ghost" size="sm" className="text-primary-600">
                📥 Download Invoice
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
