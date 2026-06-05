'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { Button, Card, CardBody, CardHeader, Spinner } from '@/components/ui';
import { CheckCircle, AlertCircle } from 'lucide-react';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Verification token is missing. Please check your email link.');
      return;
    }

    const verifyToken = async () => {
      try {
        const { data } = await authApi.verifyEmail({ token });
        if (data.success) {
          setStatus('success');
          setMessage('Your email has been successfully verified!');
        } else {
          setStatus('error');
          setMessage('Verification failed. The token may be invalid or expired.');
        }
      } catch (error: any) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Verification failed. The token may be invalid or expired.');
      }
    };

    verifyToken();
  }, [searchParams]);

  return (
    <Card className="border-0 shadow-card-hover bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <h1 className="text-xl font-semibold text-gray-900 text-center">Email Verification</h1>
      </CardHeader>
      <CardBody className="flex flex-col items-center justify-center py-8">
        {status === 'loading' && (
          <div className="flex flex-col items-center space-y-4">
            <Spinner size="lg" className="text-primary-600" />
            <p className="text-gray-600">Verifying your email address...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center space-y-4 text-center">
            <CheckCircle className="w-16 h-16 text-success-500" />
            <p className="text-gray-900 font-medium">{message}</p>
            <Button
              variant="primary"
              className="mt-4"
              onClick={() => router.push('/auth/login')}
            >
              Go to Login
            </Button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center space-y-4 text-center">
            <AlertCircle className="w-16 h-16 text-danger-600" />
            <p className="text-danger-600 font-medium">{message}</p>
            <div className="flex flex-col w-full space-y-3 mt-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  // TODO: Implement resend verification
                  alert('Resend verification email to be implemented');
                }}
              >
                Resend Verification Email
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => router.push('/auth/login')}
              >
                Back to Login
              </Button>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-bold text-primary-600 tracking-tight">NextHire</span>
          </Link>
        </div>
        <Suspense fallback={
          <div className="flex justify-center p-8">
            <Spinner size="lg" className="text-primary-600" />
          </div>
        }>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
