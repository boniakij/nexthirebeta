'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/lib/api/auth';
import { Input, Button } from '@/components/ui';
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

  const handleLogin = async (email: string, password: string) => {
    setGlobalError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await authApi.login({ email, password });
      const responseData = response.data;

      if (responseData.success) {
        // Set both tokens AND user data from the correct nested properties
        const { user, tokens } = responseData.data;
        setTokens(tokens.access_token, tokens.refresh_token);
        const { setUser } = useAuthStore.getState();
        setUser(user);

        setSuccess('Login successful! Redirecting...');

        setTimeout(() => {
          if (user?.role === 'student') {
            router.push('/student/dashboard');
          } else if (user?.role === 'trainer') {
            router.push('/trainer/dashboard');
          } else if (user?.role === 'company') {
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

  const onSubmit = async (data: LoginFormValues) => {
    await handleLogin(data.email, data.password);
  };

  // Quick login for development
  const quickLogin = (role: 'student' | 'trainer' | 'company' | 'admin') => {
    const credentials: Record<string, { email: string; password: string }> = {
      student: { email: 'student1@nexthire.com', password: 'password123' },
      trainer: { email: 'trainer1@nexthire.com', password: 'password123' },
      company: { email: 'company1@nexthire.com', password: 'password123' },
      admin: { email: 'admin@nexthire.com', password: 'admin@123' },
    };
    const cred = credentials[role];
    handleLogin(cred.email, cred.password);
  };

  return (
    <div className="min-h-screen flex selection:bg-primary-500 selection:text-white">
      {/* Left side - Login Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white relative">
        {/* Decorative subtle blob */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute top-1/2 -right-24 w-72 h-72 bg-purple-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob [animation-delay:2000ms]"></div>
        </div>

        <div className="mx-auto w-full max-w-sm lg:max-w-md relative z-10">
          <div className="mb-10">
            <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/30 group-hover:scale-105 transition-transform">
                NH
              </div>
              <span className="text-2xl font-bold text-gray-900 tracking-tight">NextHire</span>
            </Link>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
              Welcome back
            </h2>
            <p className="text-gray-500 text-lg mt-2">
              Please enter your details to sign in.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl">
            {globalError && (
              <div className="mb-6 p-4 bg-danger-50/50 border border-danger-100 text-danger-700 rounded-xl text-sm flex items-start gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 text-danger-500 shrink-0 mt-0.5" />
                <p className="font-medium">{globalError}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-success-50/50 border border-success-100 text-success-700 rounded-xl text-sm flex items-start gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
                <CheckCircle className="w-5 h-5 text-success-500 shrink-0 mt-0.5" />
                <p className="font-medium">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <Input
                  label="Email Address"
                  type="email"
                  {...register('email')}
                  error={errors.email?.message}
                  placeholder="you@example.com"
                  icon={<Mail className="w-5 h-5 text-gray-400" />}
                  disabled={loading}
                  className="h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors rounded-xl"
                />
              </div>

              <div>
                <Input
                  label="Password"
                  type="password"
                  {...register('password')}
                  error={errors.password?.message}
                  placeholder="••••••••"
                  icon={<Lock className="w-5 h-5 text-gray-400" />}
                  disabled={loading}
                  className="h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors rounded-xl"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5">
                    <input
                      type="checkbox"
                      {...register('rememberMe')}
                      className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-md checked:bg-primary-600 checked:border-primary-600 focus:ring-2 focus:ring-primary-600/20 focus:outline-none transition-all disabled:opacity-50"
                      disabled={loading}
                    />
                    <CheckCircle className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                  </div>
                  <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors select-none">
                    Remember me
                  </span>
                </label>

                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full h-12 text-base font-bold shadow-lg shadow-primary-600/20 hover:shadow-primary-600/30 transition-all rounded-xl mt-2"
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Quick Login Buttons for Development */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 text-center">
                Quick Login (Development)
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 text-sm font-semibold bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 rounded-lg transition-all"
                  disabled={loading}
                  onClick={() => quickLogin('student')}
                >
                  👨‍🎓 Student
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 text-sm font-semibold bg-green-50 hover:bg-green-100 border-green-200 text-green-700 rounded-lg transition-all"
                  disabled={loading}
                  onClick={() => quickLogin('trainer')}
                >
                  👨‍🏫 Trainer
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 text-sm font-semibold bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700 rounded-lg transition-all"
                  disabled={loading}
                  onClick={() => quickLogin('company')}
                >
                  🏢 Company
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 text-sm font-semibold bg-red-50 hover:bg-red-100 border-red-200 text-red-700 rounded-lg transition-all"
                  disabled={loading}
                  onClick={() => quickLogin('admin')}
                >
                  🔐 Admin
                </Button>
              </div>
            </div>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium z-10">Or continue with</span>
                </div>
              </div>

              <div className="mt-8">
                <Button
                  variant="outline"
                  className="w-full h-12 flex items-center justify-center gap-3 bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 font-semibold rounded-xl transition-all shadow-sm"
                  disabled={loading}
                  type="button"
                  onClick={() => {
                    // Google OAuth placeholder
                  }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Google
                </Button>
              </div>
            </div>

            <p className="mt-10 text-center text-sm text-gray-600 font-medium">
              Don't have an account?{' '}
              <Link href="/auth/register" className="font-bold text-primary-600 hover:text-primary-700 transition-colors">
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Showcase/Image */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-gray-900 to-purple-900 opacity-90 z-0"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 z-0"></div>
        
        {/* Glow effects */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-pulse [animation-delay:2000ms]"></div>

        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
          <div className="max-w-lg">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-semibold mb-8 backdrop-blur-md shadow-inner">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Over 5,000 students hired
            </div>
            <h3 className="text-4xl xl:text-5xl font-bold mb-6 leading-tight tracking-tight">
              Master the interview. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-purple-300">
                Secure the offer.
              </span>
            </h3>
            <p className="text-lg text-gray-300 mb-12 leading-relaxed">
              Join the elite platform where ambitious candidates practice with actual engineers from top-tier tech companies. Your dream job is one mock interview away.
            </p>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-400/20 to-purple-400/20 rounded-bl-full filter blur-xl"></div>
              
              <div className="flex gap-1 mb-6 relative z-10">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 drop-shadow-md" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-white text-lg font-medium italic mb-8 relative z-10 leading-relaxed">
                "The mock interviews were harder than the real thing. When I actually interviewed at Google, I felt completely over-prepared. Highly recommended!"
              </p>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl border-2 border-white/40 shadow-lg">
                  SJ
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">Sarah Jenkins</h4>
                  <p className="text-sm text-gray-300">Software Engineer @ Google</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
