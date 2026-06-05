'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '@/lib/api/auth';
import { Input, Button, Card, CardBody, CardHeader, CardFooter } from '@/components/ui';
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

export default function RegisterPage() {
  const router = useRouter();
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
      role: 'student',
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-bold text-primary-600 tracking-tight">NextHire</span>
          </Link>
          <p className="text-gray-500 mt-2">Join us to land your dream job or find top talent.</p>
        </div>

        <Card className="border-0 shadow-card-hover bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <h1 className="text-xl font-semibold text-gray-900 text-center">Create your account</h1>
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
              
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
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
                        "relative flex flex-col items-center justify-center p-3 border rounded-btn transition-all duration-200 text-center gap-2",
                        selectedRole === role.id 
                          ? "border-primary-600 bg-primary-50 text-primary-700 ring-1 ring-primary-600 shadow-sm"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                      )}
                    >
                      <div className={selectedRole === role.id ? "text-primary-600" : "text-gray-400"}>
                        {role.icon}
                      </div>
                      <div>
                        <div className="text-sm font-medium leading-none">{role.label}</div>
                        <div className="text-[10px] text-gray-500 mt-1 hidden sm:block">{role.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
                {errors.role && <p className="text-xs text-danger-600 mt-1">{errors.role.message}</p>}
              </div>

              <Input
                label="Full Name"
                type="text"
                {...register('full_name')}
                error={errors.full_name?.message}
                placeholder="John Doe"
                icon={<User className="w-4 h-4" />}
                disabled={loading}
              />

              <Input
                label="Email Address"
                type="email"
                {...register('email')}
                error={errors.email?.message}
                placeholder="you@example.com"
                icon={<Mail className="w-4 h-4" />}
                disabled={loading}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Password"
                  type="password"
                  {...register('password')}
                  error={errors.password?.message}
                  placeholder="••••••••"
                  icon={<Lock className="w-4 h-4" />}
                  disabled={loading}
                />

                <Input
                  label="Confirm Password"
                  type="password"
                  {...register('password_confirmation')}
                  error={errors.password_confirmation?.message}
                  placeholder="••••••••"
                  icon={<Lock className="w-4 h-4" />}
                  disabled={loading}
                />
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2 cursor-pointer group">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      {...register('terms')}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-600 mt-0.5"
                      disabled={loading}
                    />
                  </div>
                  <div className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                    I agree to the <Link href="/terms" className="text-primary-600 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>.
                  </div>
                </label>
                {errors.terms && <p className="text-xs text-danger-600 mt-1">{errors.terms.message}</p>}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full mt-6 h-11"
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create Account'}
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
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </Button>
              </div>
            </div>
          </CardBody>
          <CardFooter className="justify-center border-t border-gray-100 bg-gray-50/50 rounded-b-card">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/login" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
