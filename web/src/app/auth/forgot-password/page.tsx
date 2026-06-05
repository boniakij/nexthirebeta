'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authApi } from '@/lib/api/auth';
import { Input, Button, Card, CardBody, CardHeader, CardFooter } from '@/components/ui';
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Email address is required');
      return;
    }

    setLoading(true);

    try {
      const { data } = await authApi.forgotPassword({ email });
      if (data.success) {
        setSuccess(true);
      }
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to send reset link';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-bold text-primary-600 tracking-tight">NextHire</span>
          </Link>
          <p className="text-gray-500 mt-2">Reset your password</p>
        </div>

        <Card className="border-0 shadow-card-hover bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <h1 className="text-xl font-semibold text-gray-900 text-center">Forgot Password?</h1>
          </CardHeader>
          <CardBody>
            {success ? (
              <div className="flex flex-col items-center space-y-4 text-center py-4">
                <CheckCircle className="w-16 h-16 text-success-500" />
                <h3 className="text-lg font-medium text-gray-900">Check your inbox</h3>
                <p className="text-gray-600 text-sm">
                  We have sent password reset instructions to <span className="font-semibold">{email}</span>.
                </p>
                <div className="pt-4 w-full">
                  <Link href="/auth/login" className="w-full inline-block">
                    <Button variant="primary" className="w-full">
                      Return to Login
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-6 text-center">
                  Enter your email address and we'll send you a link to reset your password.
                </p>

                {error && (
                  <div className="mb-4 p-3 bg-danger-600/10 border border-danger-600/20 text-danger-600 rounded-btn text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <Input
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    icon={<Mail className="w-4 h-4" />}
                    required
                    disabled={loading}
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    loading={loading}
                    disabled={loading}
                  >
                    Send Reset Link
                  </Button>
                </form>
              </>
            )}
          </CardBody>
          {!success && (
            <CardFooter className="justify-center border-t border-gray-100 bg-gray-50/50 rounded-b-card">
              <Link href="/auth/login" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Link>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
