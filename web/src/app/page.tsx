'use client';

import Link from 'next/link';
import { Button } from '@/components/ui';
import { Navbar } from '@/components/layout/Navbar';
import { useEffect, useState } from 'react';

const StatCounter = ({ value, label }: { value: number; label: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => (prev < value ? prev + Math.ceil(value / 50) : value));
    }, 20);
    return () => clearInterval(interval);
  }, [value]);

  return (
    <div className="text-center">
      <p className="text-3xl font-bold text-primary-600">{count.toLocaleString()}+</p>
      <p className="text-gray-600">{label}</p>
    </div>
  );
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-purple-50 py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            Land Your Dream Job 🚀
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Practice with expert trainers, earn XP, unlock badges, and get hired by top companies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg">Sign Up Free</Button>
            </Link>
            <button className="px-8 py-3 border-2 border-primary-600 text-primary-600 rounded-btn font-bold hover:bg-primary-50 transition">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCounter value={5000} label="Students" />
            <StatCounter value={500} label="Trainers" />
            <StatCounter value={200} label="Companies" />
            <StatCounter value={50000} label="Sessions" />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-16">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '📝',
                title: 'Register & Complete Profile',
                description: 'Create your account and showcase your skills and experience.',
              },
              {
                icon: '🎓',
                title: 'Book Expert Trainers',
                description: 'Choose from 500+ trainers and book mock interviews in your preferred domain.',
              },
              {
                icon: '🏢',
                title: 'Get Hired by Top Companies',
                description: 'Ace interviews and land your dream job with companies using our platform.',
              },
            ].map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="text-6xl mb-4">{step.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Trainers */}
      <section className="py-20 sm:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-16">
            Featured Trainers
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Arjun Kumar', domains: 'System Design, Backend', rating: 4.9, price: '₹500/hr' },
              { name: 'Priya Sharma', domains: 'Frontend, Full-Stack', rating: 4.8, price: '₹450/hr' },
              { name: 'Rahul Singh', domains: 'DevOps, Cloud', rating: 4.7, price: '₹600/hr' },
              { name: 'Fatima Ahmed', domains: 'Data Science, ML', rating: 4.9, price: '₹700/hr' },
              { name: 'Nadia Islam', domains: 'HR, Behavioral', rating: 4.6, price: '₹350/hr' },
              { name: 'Hassan Khan', domains: 'Mobile, React Native', rating: 4.8, price: '₹500/hr' },
            ].map((trainer, idx) => (
              <div
                key={idx}
                className="bg-white rounded-card border border-gray-200 p-6 hover:shadow-lg transition"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-full mb-4 flex items-center justify-center text-2xl">
                  👤
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{trainer.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{trainer.domains}</p>
                <div className="flex items-center justify-between">
                  <span className="text-yellow-400">⭐ {trainer.rating}</span>
                  <span className="font-bold text-primary-600">{trainer.price}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/trainers">
              <Button size="lg" variant="outline">
                View All Trainers
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section className="py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-16">
            🏆 Top Performers
          </h2>
          <div className="bg-white rounded-card border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Rank</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Student</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">XP</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Level</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { rank: 1, name: 'Arjun Kumar', xp: 25000, level: 10 },
                  { rank: 2, name: 'Fatima Ahmed', xp: 24500, level: 10 },
                  { rank: 3, name: 'Rahul Singh', xp: 23800, level: 9 },
                  { rank: 4, name: 'Ayesha Khan', xp: 22100, level: 9 },
                  { rank: 5, name: 'Priya Sharma', xp: 20500, level: 8 },
                ].map((entry) => (
                  <tr key={entry.rank} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 font-bold text-gray-900">{entry.rank}</td>
                    <td className="py-4 px-6 text-gray-900">{entry.name}</td>
                    <td className="py-4 px-6 font-bold text-primary-600">{entry.xp.toLocaleString()}</td>
                    <td className="py-4 px-6">
                      <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                        Level {entry.level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-center mt-8">
            <Link href="/leaderboard">
              <Button size="lg" variant="outline">
                View Full Leaderboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 sm:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-16">
            What Students Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: 'NextHire helped me land a job at Google within 2 months!',
                author: 'Arjun Kumar',
                rating: 5,
              },
              {
                quote: 'The trainers are incredibly knowledgeable and supportive.',
                author: 'Priya Sharma',
                rating: 5,
              },
              {
                quote: 'The gamification system keeps me motivated to practice daily.',
                author: 'Rahul Singh',
                rating: 5,
              },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-white rounded-card border border-gray-200 p-6 hover:shadow-lg transition"
              >
                <p className="text-yellow-400 mb-3">{'⭐'.repeat(testimonial.rating)}</p>
                <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                <p className="font-semibold text-gray-900">— {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32 bg-gradient-to-r from-primary-600 to-purple-600">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Ace Your Interviews?</h2>
          <p className="text-lg mb-8 opacity-90">Join 5,000+ students who've already landed their dream jobs.</p>
          <Link href="/auth/register">
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary-600">
              Get Started Free →
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-white mb-4">NextHire</h3>
              <p className="text-sm">Landing dreams, one interview at a time.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">For Students</a></li>
                <li><a href="#" className="hover:text-white">For Trainers</a></li>
                <li><a href="#" className="hover:text-white">For Companies</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Guides</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 NextHire. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
