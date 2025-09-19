'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  const backgroundImageUrl =
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1470&q=80';

  const featureImages = [
    'https://static.vecteezy.com/system/resources/previews/013/055/209/non_2x/project-tracking-goal-tracker-task-completion-or-checklist-to-remind-project-progress-concept-businessman-project-manager-holding-big-pencil-to-check-completed-tasks-in-project-management-timeline-free-vector.jpg',
    'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=500&q=80',
    'https://static.vecteezy.com/system/resources/previews/013/055/209/non_2x/project-tracking-goal-tracker-task-completion-or-checklist-to-remind-project-progress-concept-businessman-project-manager-holding-big-pencil-to-check-completed-tasks-in-project-management-timeline-free-vector.jpg',
  ];

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center relative"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      aria-label="Hero background with professional abstract gradient and subtle texture"
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 opacity-90 pointer-events-none" />

      <div className="relative z-10 flex flex-col flex-grow">
        {/* Hero Section */}
        <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 text-center text-white flex-grow flex flex-col justify-center">
          <div className="max-w-4xl mx-auto animate-fadeInUp">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 drop-shadow-lg leading-tight">
              Build Better Habits, Together
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl mb-8 sm:mb-12 max-w-3xl mx-auto drop-shadow-md font-semibold tracking-wide px-2">
              Track your daily habits, stay accountable with friends, and achieve your goals with our
              intuitive habit tracking platform.
            </p>
            {user ? (
              <Link
                href="/dashboard"
                className="bg-white text-indigo-700 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-full font-bold text-lg sm:text-xl hover:bg-gray-100 transition transform hover:scale-105 shadow-xl inline-block"
              >
                Go to Dashboard
              </Link>
            ) : (
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6">
                <Link
                  href="/register"
                  className="bg-white text-indigo-700 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-full font-bold text-lg sm:text-xl hover:bg-gray-100 transition transform hover:scale-105 shadow-xl text-center"
                >
                  Get Started
                </Link>
                <Link
                  href="/login"
                  className="border-2 border-white text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-full font-bold text-lg sm:text-xl hover:bg-white hover:text-indigo-700 transition transform hover:scale-105 text-center"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 sm:py-20 lg:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 animate-fadeInUp">
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12 sm:mb-16 lg:mb-20 tracking-tight">
              Why Choose HabitTracker?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
              {/* Feature 1 */}
              <div className="text-center p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2 bg-gradient-to-b from-white to-blue-50 group cursor-pointer">
                <img
                  src={featureImages[3]}
                  alt="Track progress new illustration"
                  className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mx-auto mb-4 sm:mb-6 rounded-full object-cover shadow-xl transition-transform duration-500 group-hover:scale-105"
                />
                <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-900 transition-colors group-hover:text-indigo-600">
                  Track Your Progress
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  Easily create and manage your daily or weekly habits with our intuitive interface.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="text-center p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2 bg-gradient-to-b from-white to-purple-50 group cursor-pointer">
                <img
                  src={featureImages[1]}
                  alt="Social accountability illustration"
                  className="w-20 h-20 sm:w-24 sm:h-24 lg:w-24 lg:h-24 mx-auto mb-4 sm:mb-6 rounded-full object-cover shadow-lg transition-transform duration-500 group-hover:scale-105"
                />
                <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-900 transition-colors group-hover:text-purple-600">
                  Social Accountability
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  Follow friends, share progress, and stay motivated together with our social features.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="text-center p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2 bg-gradient-to-b from-white to-teal-50 group cursor-pointer">
                <img
                  src={featureImages[2]}
                  alt="Visualize success illustration"
                  className="w-20 h-20 sm:w-24 sm:h-24 lg:w-24 lg:h-24 mx-auto mb-4 sm:mb-6 rounded-full object-cover shadow-lg transition-transform duration-500 group-hover:scale-105"
                />
                <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-900 transition-colors group-hover:text-teal-600">
                  Visualize Success
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  See your streaks and progress with beautiful charts and statistics to keep you motivated.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 drop-shadow-lg">Ready to build better habits?</h2>
            <p className="text-lg sm:text-xl mb-8 sm:mb-12 max-w-3xl mx-auto drop-shadow-md">
              Join thousands of users who are achieving their goals with HabitTracker.
            </p>
            {!user && (
              <Link
                href="/register"
                className="bg-white text-indigo-700 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-full font-bold text-lg sm:text-xl hover:bg-gray-100 transition transform hover:scale-105 shadow-xl inline-block"
              >
                Sign Up Free
              </Link>
            )}
          </div>
        </section>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translate3d(0, 20px, 0);
          }
          100% {
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