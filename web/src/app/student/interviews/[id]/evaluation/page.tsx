'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';

interface Interview {
  id: number;
  trainer_id: number;
  student_id: number;
  status: string;
}

export default function EvaluationPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, user } = useAuthStore();
  const interviewId = params.id as string;

  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTrainer, setIsTrainer] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Evaluation form state
  const [scores, setScores] = useState({
    communication: 5,
    technical: 5,
    confidence: 5,
    problem_solving: 5,
    english: 5,
    hr_readiness: 5,
  });
  const [overallLevel, setOverallLevel] = useState<
    'not_ready' | 'beginner' | 'intermediate' | 'advanced' | 'industry_ready'
  >('beginner');
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    setIsTrainer(user?.role === 'trainer');
    // TODO: Fetch interview details
    setLoading(false);
  }, [isAuthenticated, user, router]);

  const handleScoreChange = (category: string, value: number) => {
    setScores((prev) => ({
      ...prev,
      [category]: Math.min(Math.max(value, 1), 10),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      // TODO: Call evaluation API endpoint
      // POST /trainers/me/evaluations/{interview_id}

      setSuccess(
        'Evaluation submitted successfully! The student will receive feedback shortly.'
      );

      setTimeout(() => {
        router.push('/trainer');
      }, 2000);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to submit evaluation';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!isTrainer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Interview Completed</h1>
            <p className="text-gray-600 mb-6">
              Your trainer will provide feedback shortly. Check back soon!
            </p>
            <Link
              href="/student"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const avgScore = Math.round(
    (scores.communication +
      scores.technical +
      scores.confidence +
      scores.problem_solving +
      scores.english +
      scores.hr_readiness) /
      6
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-blue-600">Interview Evaluation</h1>
          <p className="text-sm text-gray-600">Provide comprehensive feedback for the student</p>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8">
          {/* Scoring Section */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Performance Scores</h2>
            <p className="text-sm text-gray-600 mb-6">
              Rate the student's performance on a scale of 1-10 (1 = Poor, 10 = Excellent)
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                { key: 'communication', label: 'Communication Skills' },
                { key: 'technical', label: 'Technical Knowledge' },
                { key: 'confidence', label: 'Confidence & Composure' },
                { key: 'problem_solving', label: 'Problem Solving' },
                { key: 'english', label: 'English Proficiency' },
                { key: 'hr_readiness', label: 'HR Interview Readiness' },
              ].map((item) => (
                <div key={item.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {item.label}
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={scores[item.key as keyof typeof scores]}
                      onChange={(e) =>
                        handleScoreChange(item.key, parseInt(e.target.value))
                      }
                      className="flex-1 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-2xl font-bold text-blue-600 w-8 text-right">
                      {scores[item.key as keyof typeof scores]}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Average Score */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-600">Average Score</p>
              <p className="text-3xl font-bold text-blue-600">{avgScore}/10</p>
            </div>
          </div>

          {/* Overall Level */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Overall Readiness Level
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {[
                { value: 'not_ready', label: 'Not Ready' },
                { value: 'beginner', label: 'Beginner' },
                { value: 'intermediate', label: 'Intermediate' },
                { value: 'advanced', label: 'Advanced' },
                { value: 'industry_ready', label: 'Industry Ready' },
              ].map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() =>
                    setOverallLevel(
                      level.value as
                        | 'not_ready'
                        | 'beginner'
                        | 'intermediate'
                        | 'advanced'
                        | 'industry_ready'
                    )
                  }
                  className={`px-4 py-2 rounded-lg border-2 transition ${
                    overallLevel === level.value
                      ? 'border-blue-600 bg-blue-50 text-blue-600 font-semibold'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Detailed Feedback & Recommendations
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Provide constructive feedback, areas of improvement, and recommendations for the student..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={6}
            />
            <p className="text-xs text-gray-500 mt-2">
              {feedback.length} / 2000 characters
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              {submitting ? 'Submitting...' : 'Submit Evaluation'}
            </button>
            <Link
              href="/trainer"
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition text-center"
            >
              Cancel
            </Link>
          </div>
        </form>

        {/* Info Card */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-semibold text-yellow-900 mb-2">📋 Evaluation Guidelines</h3>
          <ul className="space-y-1 text-sm text-yellow-800">
            <li>✓ Be fair and constructive in your assessment</li>
            <li>✓ Provide specific examples to support your scores</li>
            <li>✓ Offer actionable suggestions for improvement</li>
            <li>✓ Highlight strengths and positive aspects</li>
            <li>✓ Students will receive a detailed report based on your evaluation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
