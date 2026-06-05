'use client';

export default function TrainerDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-blue-600">NextHire - Trainer Dashboard</h1>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Total Sessions</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Average Rating</h3>
            <p className="text-3xl font-bold text-yellow-600 mt-2">0.0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Earnings (BDT)</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">0</p>
          </div>
        </div>

        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Upcoming Sessions</h2>
          <p className="text-gray-600">View your scheduled mock interviews</p>
        </section>
      </div>
    </div>
  );
}
