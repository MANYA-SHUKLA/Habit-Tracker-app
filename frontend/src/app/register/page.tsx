'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
}

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      // Remove confirmPassword from the data sent to the server
      const { confirmPassword: _, ...userData } = data;
      const response = await api.post('/auth/register', userData);
      const { token, data: { user } } = response.data;
      login(token, user);
      toast.success('Registration successful!');
      router.push('/dashboard');
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if (apiError.response?.data?.error) {
        toast.error(apiError.response.data.error);
      } else {
        toast.error('Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const backgroundImageUrl = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80';

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4 py-12 sm:py-16"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      aria-label="Background with elegant abstract texture"
    >
      <div className="max-w-md w-full space-y-8 bg-white bg-opacity-90 backdrop-blur-lg p-8 sm:p-10 rounded-2xl shadow-2xl border border-gray-100 transition-transform hover:scale-[1.03] duration-500 ease-in-out">
        <div>
          <h2 className="mt-6 text-center text-3xl sm:text-4xl font-extrabold text-black tracking-wide drop-shadow-md animate-fadeInUp leading-tight">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm sm:text-base font-semibold text-gray-700">
            Or{' '}
            <Link
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-900 hover:underline transition-colors duration-300"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                {...register('username')}
                id="username"
                type="text"
                autoComplete="username"
                placeholder="Username"
                className={`appearance-none rounded-t-md relative block w-full px-4 py-3 border ${
                  errors.username ? 'border-red-600' : 'border-gray-300'
                } placeholder-gray-400 text-black font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-600 focus:z-10 sm:text-sm transition-shadow duration-300 shadow-sm hover:shadow-lg`}
                aria-invalid={errors.username ? 'true' : 'false'}
                aria-describedby="username-error"
              />
              {errors.username && (
                <p id="username-error" className="mt-1 text-sm text-red-700 font-semibold tracking-wide">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                {...register('email')}
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Email address"
                className={`appearance-none relative block w-full px-4 py-3 border ${
                  errors.email ? 'border-red-600' : 'border-gray-300'
                } placeholder-gray-400 text-black font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-600 focus:z-10 sm:text-sm transition-shadow duration-300 shadow-sm hover:shadow-lg`}
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby="email-error"
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-700 font-semibold tracking-wide">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                {...register('password')}
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="Password"
                className={`appearance-none relative block w-full px-4 py-3 border ${
                  errors.password ? 'border-red-600' : 'border-gray-300'
                } placeholder-gray-400 text-black font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-600 focus:z-10 sm:text-sm transition-shadow duration-300 shadow-sm hover:shadow-lg`}
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby="password-error"
              />
              {errors.password && (
                <p id="password-error" className="mt-1 text-sm text-red-700 font-semibold tracking-wide">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <input
                {...register('confirmPassword')}
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Confirm Password"
                className={`appearance-none rounded-b-md relative block w-full px-4 py-3 border ${
                  errors.confirmPassword ? 'border-red-600' : 'border-gray-300'
                } placeholder-gray-400 text-black font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-600 focus:z-10 sm:text-sm transition-shadow duration-300 shadow-sm hover:shadow-lg`}
                aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                aria-describedby="confirmPassword-error"
              />
              {errors.confirmPassword && (
                <p id="confirmPassword-error" className="mt-1 text-sm text-red-700 font-semibold tracking-wide">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-6 border border-transparent text-sm sm:text-base font-bold rounded-lg text-white bg-gradient-to-r from-indigo-600 to-indigo-900 hover:from-indigo-700 hover:to-indigo-950 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
              ) : null}
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate3d(0, 20px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease forwards;
        }
      `}</style>
    </div>
  );
}