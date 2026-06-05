'use client';

import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Register</h1>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" className="w-full border border-gray-300 rounded px-3 py-2" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" className="w-full border border-gray-300 rounded px-3 py-2" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select className="w-full border border-gray-300 rounded px-3 py-2">
              <option>Student</option>
              <option>Trainer</option>
              <option>Company</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700">
            Register
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <Link href="/auth/login" className="text-blue-600 hover:underline font-semibold">Login</Link>
        </div>
      </div>
    </div>
  );
}
