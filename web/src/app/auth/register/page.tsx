'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '@/lib/api/auth';
import { Input, Button } from '@/components/ui';
import { User, Mail, Lock, AlertCircle, CheckCircle, Briefcase, GraduationCap, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const registerSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirmation: z.string(),
  role: z.enum(['student', 'trainer', 'company']),
  terms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and privacy policy'
  }),
}).refine(d => d.password === d.password_confirmation, {
  message: 'Passwords do not match',
  path: ['password_confirmation'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

import { useSearchParams } from 'next/navigation';

export function RegisterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = (searchParams.get('role') as 'student' | 'trainer' | 'company') || 'student';

  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [success, setSuccess] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: defaultRole,
    }
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFormValues) => {
    setGlobalError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await authApi.register({
        email: data.email,
        full_name: data.full_name,
        password: data.password,
        password_confirmation: data.password_confirmation,
        role: data.role,
      });

      if (response.data.success) {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => {
          router.push('/auth/login');
        }, 1500);
      }
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Registration failed';
      setGlobalError(message);
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { id: 'student', label: 'Student', icon: <GraduationCap className="w-5 h-5" />, desc: 'Learn and prepare' },
    { id: 'trainer', label: 'Trainer', icon: <Briefcase className="w-5 h-5" />, desc: 'Conduct interviews' },
    { id: 'company', label: 'Company', icon: <Building2 className="w-5 h-5" />, desc: 'Hire top talent' },
  ] as const;

  return (
    <div className="min-h-screen flex selection:bg-primary-500 selection:text-white">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col py-10 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white relative">
        {/* Decorative subtle blob */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute top-1/2 -right-24 w-72 h-72 bg-purple-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob [animation-delay:2000ms]"></div>
        </div>

        <div className="mx-auto w-full max-w-sm lg:max-w-md relative z-10 flex-1 flex flex-col justify-center">
          <div className="mb-8 mt-4">
            <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/30 group-hover:scale-105 transition-transform">
                NH
              </div>
              <span className="text-2xl font-bold text-gray-900 tracking-tight">NextHire</span>
            </Link>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
              Create an account
            </h2>
            <p className="text-gray-500 text-lg mt-2">
              Join us to land your dream job or find top talent.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl pb-8">
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
              
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  I am a... <span className="text-danger-600">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {roleOptions.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      disabled={loading}
                      onClick={() => setValue('role', role.id, { shouldValidate: true })}
                      className={cn(
                        "relative flex flex-col items-center justify-center p-3 border-2 rounded-xl transition-all duration-200 text-center gap-2",
                        selectedRole === role.id 
                          ? "border-primary-600 bg-primary-50 text-primary-700 shadow-md shadow-primary-500/10 scale-[1.02]"
                          : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                      )}
                    >
                      <div className={selectedRole === role.id ? "text-primary-600" : "text-gray-400"}>
                        {role.icon}
                      </div>
                      <div>
                        <div className="text-sm font-bold leading-none">{role.label}</div>
                        <div className="text-[10px] font-medium text-gray-500 mt-1 hidden sm:block opacity-80">{role.desc}</div>
                      </div>
                      
                      {/* Selection indicator checkmark */}
                      {selectedRole === role.id && (
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center text-white shadow-sm border-2 border-white">
                          <CheckCircle className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                {errors.role && <p className="text-xs font-medium text-danger-600 mt-1">{errors.role.message}</p>}
              </div>

              <Input
                label="Full Name"
                type="text"
                {...register('full_name')}
                error={errors.full_name?.message}
                placeholder="John Doe"
                icon={<User className="w-5 h-5 text-gray-400" />}
                disabled={loading}
                className="h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors rounded-xl"
              />

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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

                <Input
                  label="Confirm Password"
                  type="password"
                  {...register('password_confirmation')}
                  error={errors.password_confirmation?.message}
                  placeholder="••••••••"
                  icon={<Lock className="w-5 h-5 text-gray-400" />}
                  disabled={loading}
                  className="h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors rounded-xl"
                />
              </div>

              <div className="pt-2 pb-1">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5 mt-0.5 shrink-0">
                    <input
                      type="checkbox"
                      {...register('terms')}
                      className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-md checked:bg-primary-600 checked:border-primary-600 focus:ring-2 focus:ring-primary-600/20 focus:outline-none transition-all disabled:opacity-50"
                      disabled={loading}
                    />
                    <CheckCircle className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                  </div>
                  <div className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                    I agree to the <Link href="/terms" className="text-primary-600 font-bold hover:text-primary-700 underline-offset-2 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary-600 font-bold hover:text-primary-700 underline-offset-2 hover:underline">Privacy Policy</Link>.
                  </div>
                </label>
                {errors.terms && <p className="text-xs font-medium text-danger-600 mt-1.5">{errors.terms.message}</p>}
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full h-12 text-base font-bold shadow-lg shadow-primary-600/20 hover:shadow-primary-600/30 transition-all rounded-xl mt-2"
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

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
              Already have an account?{' '}
              <Link href="/auth/login" className="font-bold text-primary-600 hover:text-primary-700 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Showcase/Image (Sticky for scrolling left pane) */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden bg-gray-900 sticky top-0 h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-gray-900 to-purple-900 opacity-90 z-0"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 z-0"></div>
        
        {/* Glow effects */}
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-primary-500 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-pulse [animation-delay:2000ms]"></div>

        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
          <div className="max-w-lg">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-semibold mb-8 backdrop-blur-md shadow-inner">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              Top companies are hiring
            </div>
            <h3 className="text-4xl xl:text-5xl font-bold mb-6 leading-tight tracking-tight">
              Start your journey. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-primary-300">
                Level up your career.
              </span>
            </h3>
            <p className="text-lg text-gray-300 mb-12 leading-relaxed">
              Create an account in seconds. Practice technical interviews, get expert feedback, and connect with recruiters actively searching for top talent.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl relative overflow-hidden transition-transform hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary-400/20 to-purple-400/20 rounded-bl-full filter blur-xl"></div>
                <GraduationCap className="w-8 h-8 text-primary-300 mb-4" />
                <h4 className="font-bold text-white text-lg mb-2">Practice</h4>
                <p className="text-sm text-gray-300">1-on-1 mock interviews with industry experts.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl relative overflow-hidden transition-transform hover:-translate-y-1">
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-primary-400/20 rounded-tl-full filter blur-xl"></div>
                <Briefcase className="w-8 h-8 text-purple-300 mb-4" />
                <h4 className="font-bold text-white text-lg mb-2">Get Hired</h4>
                <p className="text-sm text-gray-300">Fast-track your applications to top companies.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Suspense } from 'react';

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <RegisterPageContent />
    </Suspense>
  );
}
