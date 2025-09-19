'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when clicking outside
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Background image URL for subtle professional backdrop
  const backgroundImageUrl =
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80';

  return (
    <div
      className="min-h-screen bg-cover bg-center relative text-black font-sans"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      aria-label="Page background with elegant professional image"
    >
      {/* Semi-transparent overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-100 to-indigo-300 opacity-90 pointer-events-none" />

      {/* Container to stack nav and main content properly */}
      <div className="relative z-10 flex flex-col min-h-screen backdrop-blur-sm">
        {/* Navbar */}
        <nav className="sticky top-0 bg-white bg-opacity-90 shadow-lg py-3 px-4 sm:py-4 sm:px-6 lg:px-8 flex justify-between items-center rounded-b-xl border border-gray-300 z-50">
          <Link
            href="/"
            className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-indigo-700 hover:text-indigo-900 transition-colors duration-300 tracking-wide"
            onClick={closeMenu}
          >
            HabitTracker
          </Link>

          {/* Mobile menu button - Always visible on mobile */}
          <div className="flex items-center space-x-4">
            {/* Show user info on mobile when logged in */}
            {user && (
              <span className="md:hidden text-gray-800 font-semibold text-sm">
                Hi, {user.username}
              </span>
            )}
            
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6 xl:space-x-8">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-800 hover:text-indigo-600 font-semibold transition-colors duration-300 tracking-wide text-sm lg:text-base"
                >
                  Dashboard
                </Link>
                <Link
                  href="/friends"
                  className="text-gray-800 hover:text-indigo-600 font-semibold transition-colors duration-300 tracking-wide text-sm lg:text-base"
                >
                  Friends
                </Link>
                <div className="flex items-center space-x-4 lg:space-x-6">
                  <span className="text-gray-800 font-semibold tracking-wide text-sm lg:text-base">
                    Hello, {user.username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg font-semibold shadow-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 text-sm lg:text-base"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex space-x-4 lg:space-x-6">
                <Link
                  href="/login"
                  className="text-gray-800 hover:text-indigo-600 font-semibold transition-colors duration-300 tracking-wide text-sm lg:text-base"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg font-semibold shadow-md transition-colors duration-300 tracking-wide text-sm lg:text-base"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile menu overlay */}
        {isMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={closeMenu}
              aria-hidden="true"
            />
            
            {/* Mobile menu panel */}
            <div className="fixed top-16 right-0 w-64 h-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden">
              <div className="p-6 space-y-6">
                {user ? (
                  <>
                    <div className="border-b border-gray-200 pb-4">
                      <p className="text-lg font-semibold text-gray-800">Hello, {user.username}</p>
                      <p className="text-sm text-gray-600">Welcome back!</p>
                    </div>
                    
                    <Link 
                      href="/dashboard" 
                      className="block text-gray-800 hover:text-indigo-600 font-semibold transition-colors py-3 text-lg border-b border-gray-100"
                      onClick={closeMenu}
                    >
                      📊 Dashboard
                    </Link>
                    <Link 
                      href="/friends" 
                      className="block text-gray-800 hover:text-indigo-600 font-semibold transition-colors py-3 text-lg border-b border-gray-100"
                      onClick={closeMenu}
                    >
                      👥 Friends
                    </Link>
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        closeMenu();
                      }}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg font-semibold shadow-md transition-colors duration-300 mt-8 text-lg"
                    >
                      🚪 Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/login" 
                      className="block text-gray-800 hover:text-indigo-600 font-semibold transition-colors py-3 text-lg border-b border-gray-100"
                      onClick={closeMenu}
                    >
                      🔐 Login
                    </Link>
                    <Link 
                      href="/register" 
                      className="block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg font-semibold shadow-md transition-colors text-center text-lg mt-4"
                      onClick={closeMenu}
                    >
                      🎯 Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </>
        )}

        {/* Main content */}
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white bg-opacity-90 border-t border-gray-300 py-6 mt-auto rounded-t-xl shadow-inner">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center text-gray-600 text-sm tracking-wide space-y-3 md:space-y-0">
            <p className="text-black font-semibold select-none text-center md:text-left">
              Made with <span className="text-red-500">♥</span> by MANYA SHUKLA
            </p>
            <nav className="flex flex-wrap justify-center md:justify-end space-x-4 md:space-x-6">
              <Link href="/privacy" className="hover:text-indigo-700 transition-colors text-xs sm:text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-indigo-700 transition-colors text-xs sm:text-sm">
                Terms of Service
              </Link>
              <Link href="/contact" className="hover:text-indigo-700 transition-colors text-xs sm:text-sm">
                Contact
              </Link>
            </nav>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;