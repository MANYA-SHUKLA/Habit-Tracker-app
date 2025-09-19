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

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', data);
      const {
        token,
        data: { user },
      } = response.data;

      login(token, user);
      toast.success('Login successful!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const backgroundImageUrl =
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1534&q=80';

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-3 sm:px-4 py-8 sm:py-12"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      aria-label="Elegant professional background image"
    >
      <div className="max-w-md w-full space-y-6 sm:space-y-8 bg-white bg-opacity-90 backdrop-blur-lg p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-gray-100 transition-transform hover:scale-[1.02] sm:hover:scale-[1.03] duration-500 ease-in-out mx-2">
        <div>
          <h2 className="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-extrabold text-black tracking-wide drop-shadow-md animate-fadeInUp">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm font-semibold text-gray-700">
            Or{' '}
            <Link
              href="/register"
              className="font-semibold text-indigo-600 hover:text-indigo-900 hover:underline transition-colors duration-300"
            >
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="rounded-md shadow-sm -space-y-px">
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
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby="email-error"
                className={`appearance-none rounded-t-md relative block w-full px-3 sm:px-4 py-2 sm:py-3 border ${
                  errors.email ? 'border-red-600' : 'border-gray-300'
                } placeholder-gray-400 text-black font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-600 focus:z-10 text-sm sm:text-base transition-shadow duration-300 shadow-sm hover:shadow-lg`}
              />
              {errors.email && (
                <p
                  id="email-error"
                  className="mt-1 text-sm text-red-700 font-semibold tracking-wide"
                  role="alert"
                >
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
                autoComplete="current-password"
                placeholder="Password"
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby="password-error"
                className={`appearance-none rounded-b-md relative block w-full px-3 sm:px-4 py-2 sm:py-3 border ${
                  errors.password ? 'border-red-600' : 'border-gray-300'
                } placeholder-gray-400 text-black font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-600 focus:z-10 text-sm sm:text-base transition-shadow duration-300 shadow-sm hover:shadow-lg`}
              />
              {errors.password && (
                <p
                  id="password-error"
                  className="mt-1 text-sm text-red-700 font-semibold tracking-wide"
                  role="alert"
                >
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 sm:py-3 px-4 sm:px-6 border border-transparent text-sm sm:text-base font-bold rounded-lg text-white bg-gradient-to-r from-indigo-600 to-indigo-900 hover:from-indigo-700 hover:to-indigo-950 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <svg
                  className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white"
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
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : null}
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>

      {/* Additional global animation styles */}
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