'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '@/lib/api/auth';
import { Input, Button, Card, CardBody, CardHeader, Spinner } from '@/components/ui';
import { Lock, AlertCircle, CheckCircle } from 'lucide-react';

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirmation: z.string(),
}).refine(d => d.password === d.password_confirmation, {
  message: 'Passwords do not match',
  path: ['password_confirmation'],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [success, setSuccess] = useState(false);

  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setGlobalError('');
    
    if (!token) {
      setGlobalError('Invalid or missing reset token.');
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.resetPassword({
        token,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      }
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to reset password';
      setGlobalError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-card-hover bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <h1 className="text-xl font-semibold text-gray-900 text-center">Set New Password</h1>
      </CardHeader>
      <CardBody>
        {success ? (
          <div className="flex flex-col items-center space-y-4 text-center py-4">
            <CheckCircle className="w-16 h-16 text-success-500" />
            <h3 className="text-lg font-medium text-gray-900">Password Reset!</h3>
            <p className="text-gray-600 text-sm">
              Your password has been reset successfully. Redirecting to login...
            </p>
          </div>
        ) : (
          <>
            {globalError && (
              <div className="mb-4 p-3 bg-danger-600/10 border border-danger-600/20 text-danger-600 rounded-btn text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {globalError}
              </div>
            )}

            {!token && !globalError && (
              <div className="mb-4 p-3 bg-warning-400/10 border border-warning-400/20 text-warning-700 rounded-btn text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                No reset token provided. Please use the link sent to your email.
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="New Password"
                type="password"
                {...register('password')}
                error={errors.password?.message}
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4" />}
                disabled={loading || !token}
              />

              <Input
                label="Confirm New Password"
                type="password"
                {...register('password_confirmation')}
                error={errors.password_confirmation?.message}
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4" />}
                disabled={loading || !token}
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full mt-2"
                loading={loading}
                disabled={loading || !token}
              >
                Reset Password
              </Button>
            </form>
          </>
        )}
      </CardBody>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-bold text-primary-600 tracking-tight">NextHire</span>
          </Link>
          <p className="text-gray-500 mt-2">Almost there! Create your new password.</p>
        </div>
        <Suspense fallback={
          <div className="flex justify-center p-8">
            <Spinner size="lg" className="text-primary-600" />
          </div>
        }>
          <ResetPasswordContent />
        </Suspense>
      </div>
    </div>
  );
}
