'use client';

import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Button, Card } from '@/components/ui';
import { ArrowRight, CheckCircle2, DollarSign, Calendar, Users, Briefcase, Star } from 'lucide-react';

export default function BecomeTrainerPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-primary-100 selection:text-primary-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-primary-900 pt-20 pb-24 sm:pt-32 sm:pb-32 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/20 text-primary-200 border border-primary-500/30 text-sm font-semibold mb-6 backdrop-blur-sm">
                <Star className="w-4 h-4 text-yellow-400" />
                Join the top 1% of industry experts
              </div>
              <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
                Share Your Expertise. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">
                  Earn on Your Terms.
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-10 max-w-xl leading-relaxed">
                Become a NextHire trainer and help candidates crack their dream interviews. Set your own schedule, build your personal brand, and earn money doing what you love.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/register?role=trainer" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 gap-2 group bg-primary-600 hover:bg-primary-500 text-white border-none">
                    Apply as Trainer
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="#how-it-works" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8 border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-purple-500 rounded-3xl blur-3xl opacity-30 animate-pulse"></div>
              <div className="relative bg-gray-800 border border-gray-700 rounded-3xl p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-700">
                  <div>
                    <h3 className="font-bold text-xl">Monthly Earnings</h3>
                    <p className="text-gray-400 text-sm">Estimated for 10 hrs/week</p>
                  </div>
                  <div className="text-3xl font-extrabold text-primary-400">৳45,000+</div>
                </div>
                <div className="space-y-6">
                  {[
                    { label: 'System Design Mock', price: '৳2,000', bookings: 12 },
                    { label: 'Frontend Interview', price: '৳1,500', bookings: 8 },
                    { label: 'Resume Review', price: '৳800', bookings: 15 },
                  ].map((stat, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-success-400" />
                        </div>
                        <div>
                          <div className="font-semibold">{stat.label}</div>
                          <div className="text-xs text-gray-400">{stat.bookings} bookings this month</div>
                        </div>
                      </div>
                      <div className="font-bold text-gray-300">{stat.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-primary-600 tracking-wide uppercase mb-2">Benefits</h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900">Why train on NextHire?</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: DollarSign,
                title: 'Set Your Own Rates',
                desc: 'You have full control over your pricing. Charge per session, create bundle packages, and get paid securely.'
              },
              {
                icon: Calendar,
                title: 'Flexible Schedule',
                desc: 'Work whenever you want. Open your calendar slots only when you have free time. No minimum hours required.'
              },
              {
                icon: Users,
                title: 'Global Audience',
                desc: 'Connect with thousands of ambitious candidates from around the world looking for your specific expertise.'
              },
              {
                icon: Briefcase,
                title: 'Build Your Personal Brand',
                desc: 'Collect public reviews, improve your trainer rating, and establish yourself as an industry thought leader.'
              },
              {
                icon: CheckCircle2,
                title: 'Zero Admin Work',
                desc: 'We handle scheduling, payments, video calls, and reminders. You just focus on delivering great feedback.'
              },
              {
                icon: Star,
                title: 'Top Tier Community',
                desc: 'Network with other expert trainers from top tech companies in our exclusive trainer community.'
              }
            ].map((benefit, i) => (
              <Card key={i} className="p-6 border-gray-100 hover:shadow-lg transition-shadow bg-gray-50/50">
                <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center mb-6">
                  <benefit.icon className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h4>
                <p className="text-gray-600 leading-relaxed">{benefit.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-primary-600 tracking-wide uppercase mb-2">Process</h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900">How to get started</h3>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="hidden md:block absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            <div className="space-y-12">
              {[
                { step: 1, title: 'Apply & Verify', desc: 'Create your account and verify your professional identity via LinkedIn or corporate email.' },
                { step: 2, title: 'Create Packages', desc: 'Design your mock interview packages, set your duration, and define your prices.' },
                { step: 3, title: 'Set Availability', desc: 'Sync your calendar and mark the times you are available to take sessions.' },
                { step: 4, title: 'Start Earning', desc: 'Accept bookings, conduct interviews, give feedback, and receive your payouts.' }
              ].map((item, i) => (
                <div key={i} className="relative flex gap-8 items-start md:items-center">
                  <div className="w-16 h-16 rounded-full bg-white border-4 border-primary-100 flex items-center justify-center flex-shrink-0 z-10 shadow-sm">
                    <span className="text-xl font-bold text-primary-600">{item.step}</span>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex-1">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h4>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-6">Ready to shape the next generation of tech talent?</h2>
          <p className="text-xl text-gray-600 mb-10">
            Join NextHire today. Application takes less than 5 minutes.
          </p>
          <Link href="/auth/register?role=trainer">
            <Button size="lg" className="h-16 px-10 text-lg gap-2 shadow-xl shadow-primary-500/20 hover:shadow-primary-500/40 transition-all hover:-translate-y-1">
              Apply to Become a Trainer
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} NextHire. All rights reserved.</p>
      </footer>
    </div>
  );
}
