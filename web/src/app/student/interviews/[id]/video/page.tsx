'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

interface Interview {
  id: number;
  trainer_id: number;
  student_id: number;
  status: string;
  meeting_link: string;
  agora_channel: string;
  scheduled_at: string;
}

export default function VideoSessionPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, user } = useAuthStore();
  const interviewId = params.id as string;

  const videoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [sessionTime, setSessionTime] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // TODO: Fetch interview details and join video session
    // Call API to get Agora token
    // Initialize Agora client and join channel

    setLoading(false);
  }, [isAuthenticated, router]);

  // Timer for session duration
  useEffect(() => {
    if (!joined) return;

    const interval = setInterval(() => {
      setSessionTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [joined]);

  const handleJoinSession = async () => {
    try {
      setError('');
      // TODO: Implement Agora video join logic
      // Initialize microphone and camera
      // Join the Agora channel
      setJoined(true);
    } catch (err: any) {
      setError(err.message || 'Failed to join video session');
    }
  };

  const handleLeaveSession = async () => {
    try {
      setError('');
      // TODO: Implement Agora video leave logic
      // Stop video/audio tracks
      // Leave the channel
      setJoined(false);
      router.push(`/student/interviews/${interviewId}/evaluation`);
    } catch (err: any) {
      setError(err.message || 'Failed to leave session');
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="mb-4">Loading video session...</div>
          <div className="inline-block animate-spin">⚙️</div>
        </div>
      </div>
    );
  }

  if (!joined) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-2xl p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📹</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Ready for Interview?</h1>
            <p className="text-gray-300">
              Please ensure your camera and microphone are working properly before joining.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-gray-300 text-sm">
              <span>✓</span>
              <span>Stable internet connection</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300 text-sm">
              <span>✓</span>
              <span>Camera and microphone enabled</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300 text-sm">
              <span>✓</span>
              <span>Quiet environment recommended</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300 text-sm">
              <span>✓</span>
              <span>Professional appearance suggested</span>
            </div>
          </div>

          <button
            onClick={handleJoinSession}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition text-lg mb-3"
          >
            Join Interview
          </button>

          <button
            onClick={() => router.back()}
            className="w-full px-6 py-3 border-2 border-gray-600 text-gray-300 rounded-lg font-semibold hover:bg-gray-700 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-700 px-4 py-3 flex justify-between items-center">
        <div className="text-white">
          <h1 className="font-bold text-lg">Interview Session</h1>
          <p className="text-sm text-gray-400">Channel: {interview?.agora_channel}</p>
        </div>
        <div className="text-white text-center">
          <div className="text-2xl font-mono font-bold">{formatTime(sessionTime)}</div>
          <div className="text-xs text-gray-400">Elapsed Time</div>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 grid grid-cols-2 gap-4 p-4 overflow-hidden">
        {/* Local Video */}
        <div className="bg-gray-900 rounded-lg overflow-hidden relative group">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          {!cameraEnabled && (
            <div className="absolute inset-0 bg-black flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">📷</div>
                <p className="text-white text-sm">Camera is off</p>
              </div>
            </div>
          )}
          <div className="absolute bottom-2 left-2 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
            You
          </div>
        </div>

        {/* Remote Video */}
        <div className="bg-gray-900 rounded-lg overflow-hidden relative group">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <div className="text-center">
              <div className="text-6xl mb-2">👤</div>
              <p className="text-gray-400">Waiting for trainer...</p>
            </div>
          </div>
          <div className="absolute bottom-2 left-2 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
            Trainer
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-900 border-t border-gray-700 px-4 py-4 flex justify-center gap-4">
        {/* Microphone Toggle */}
        <button
          onClick={() => setMicEnabled(!micEnabled)}
          className={`w-14 h-14 rounded-full flex items-center justify-center font-bold transition ${
            micEnabled
              ? 'bg-gray-700 text-white hover:bg-gray-600'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
          title={micEnabled ? 'Disable mic' : 'Enable mic'}
        >
          {micEnabled ? '🎤' : '🔇'}
        </button>

        {/* Camera Toggle */}
        <button
          onClick={() => setCameraEnabled(!cameraEnabled)}
          className={`w-14 h-14 rounded-full flex items-center justify-center font-bold transition ${
            cameraEnabled
              ? 'bg-gray-700 text-white hover:bg-gray-600'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
          title={cameraEnabled ? 'Disable camera' : 'Enable camera'}
        >
          {cameraEnabled ? '📹' : '📵'}
        </button>

        {/* End Call Button */}
        <button
          onClick={handleLeaveSession}
          className="w-14 h-14 rounded-full bg-red-600 text-white font-bold hover:bg-red-700 transition text-xl"
          title="End call"
        >
          📞
        </button>
      </div>

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg max-w-sm">
          {error}
        </div>
      )}
    </div>
  );
}
