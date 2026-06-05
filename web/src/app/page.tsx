'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">NextHire</h1>
            <div className="flex gap-4">
              <Link href="/login" className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded">
                Login
              </Link>
              <Link href="/register" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="text-center py-12">
          <h2 className="text-4xl font-bold mb-4">Mock Interview Platform</h2>
          <p className="text-xl text-gray-600 mb-8">
            Connect with expert trainers and prepare for your dream job
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/register?role=student" 
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              Sign Up as Student
            </Link>
            <Link 
              href="/register?role=trainer" 
              className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-semibold"
            >
              Join as Trainer
            </Link>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-8 py-12">
          {[
            { title: 'Expert Trainers', desc: 'Learn from industry professionals' },
            { title: 'Real Interviews', desc: 'Mock interviews that feel real' },
            { title: 'Track Progress', desc: 'Gamified learning with XP and badges' },
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
