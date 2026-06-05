'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/lib/api/auth';
import { Input, Button, Card, CardBody, CardHeader, CardFooter } from '@/components/ui';
import { Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { setTokens } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [success, setSuccess] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    setGlobalError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await authApi.login({ email: data.email, password: data.password });
      const responseData = response.data;

      if (responseData.success) {
        setTokens(responseData.data.access_token, responseData.data.refresh_token);
        setSuccess('Login successful! Redirecting...');

        setTimeout(() => {
          if (responseData.data.user?.role === 'student') {
            router.push('/student/dashboard');
          } else if (responseData.data.user.role === 'trainer') {
            router.push('/trainer/dashboard');
          } else if (responseData.data.user.role === 'company') {
            router.push('/company/dashboard');
          } else {
            router.push('/admin/dashboard');
          }
        }, 500);
      }
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Login failed';
      setGlobalError(message);
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
          <p className="text-gray-500 mt-2">Welcome back! Please enter your details.</p>
        </div>

        <Card className="border-0 shadow-card-hover bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <h1 className="text-xl font-semibold text-gray-900 text-center">Log In to Your Account</h1>
          </CardHeader>
          <CardBody>
            {globalError && (
              <div className="mb-4 p-3 bg-danger-600/10 border border-danger-600/20 text-danger-600 rounded-btn text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {globalError}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-success-500/10 border border-success-500/20 text-success-500 rounded-btn text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="Email Address"
                type="email"
                {...register('email')}
                error={errors.email?.message}
                placeholder="you@example.com"
                icon={<Mail className="w-4 h-4" />}
                disabled={loading}
              />

              <Input
                label="Password"
                type="password"
                {...register('password')}
                error={errors.password?.message}
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4" />}
                disabled={loading}
              />

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      {...register('rememberMe')}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-600"
                      disabled={loading}
                    />
                  </div>
                  <span className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    Remember for 30 days
                  </span>
                </label>

                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full mt-4 h-11"
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  disabled={loading}
                  onClick={() => {
                    // Google OAuth placeholder
                  }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </Button>
              </div>
            </div>
          </CardBody>
          <CardFooter className="justify-center border-t border-gray-100 bg-gray-50/50 rounded-b-card">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/auth/register" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
