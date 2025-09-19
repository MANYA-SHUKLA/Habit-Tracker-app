'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';
import toast from 'react-hot-toast';

interface User {
  _id: string;
  username: string;
  email: string;
}

interface Activity {
  _id: string;
  name: string;
  user: User;
  streak: number;
  completedToday: boolean;
  updatedAt: string;
}

interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
}

export default function Friends() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [activityLoading, setActivityLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    setActivityLoading(true);
    try {
      const response = await api.get('/users/activity');
      setActivities(response.data.data.activities);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError.response?.data?.error || 'Failed to fetch activities');
    } finally {
      setActivityLoading(false);
    }
  };

  const searchUsers = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await api.get(`/users/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchResults(response.data.data.users);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError.response?.data?.error || 'Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  const followUser = async (userId: string) => {
    try {
      await api.post(`/users/${userId}/follow`);
      toast.success('User followed successfully!');
      setSearchResults(searchResults.filter((user) => user._id !== userId));
      fetchActivities();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError.response?.data?.error || 'Failed to follow user');
    }
  };

  const unfollowUser = async (userId: string) => {
    try {
      await api.post(`/users/${userId}/unfollow`);
      toast.success('User unfollowed successfully!');
      fetchActivities();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError.response?.data?.error || 'Failed to unfollow user');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString();
  };

  // Background image url provided by user
  const backgroundImageUrl =
    'https://www.techexplorist.com/wp-content/uploads/2024/07/group-friends-standing-hilltop-rejoicing-raising-their-hands-air-with-beautiful-sunset-background.jpg.webp';

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Background Image */}
      <div
        className="fixed inset-0 -z-20 bg-cover bg-center brightness-75"
        style={{ backgroundImage: `url(${backgroundImageUrl})` }}
        aria-hidden="true"
      />

      {/* Overlay gradient for better text contrast */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-t from-black via-transparent to-black opacity-80" />

      <main className="relative max-w-5xl mx-auto bg-black bg-opacity-70 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-800 p-8 sm:p-12 mt-20 mb-20 transition-transform hover:scale-[1.03] duration-700 ease-in-out animate-fadeInUp">
        <h1 className="text-4极 sm:text-5xl font-extrabold mb-12 drop-shadow-lg tracking-tight">
          Friends Activity
        </h1>

        {/* Search Users */}
        <section className="bg-gray-900 bg-opacity-80 rounded-3xl shadow-lg p-6 sm:p-10 mb-16 border border-gray-700">
          <h2 className="text-3xl sm:text-4xl font-semibold mb-6 sm:mb-8 tracking-wide drop-shadow-md">
            Find Friends
          </h2>
          <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by username or email"
              className="flex-1 px-6 py-4 rounded-full bg-gray-800 bg-opacity-90 border border-gray-600 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:border-indigo-400 shadow-md placeholder-gray-400 font-semibold text-lg text-white transition-shadow duration-300"
              onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
              aria-label="Search users by username or email"
            />
            <button
              onClick={searchUsers}
              disabled={loading}
              className="bg-indigo-600 bg-opacity-90 hover:bg-indigo-700 px-6 py-4 rounded-full shadow-lg text-white font-semibold text-lg flex items-center justify-center transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Search users"
            >
              {loading ? (
                <svg
                  className="animate-spin h-8 w-8 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
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
                    d="M4 12a8 8 0 018-8v8极4z"
                  />
                </svg>
              ) : (
                'Search'
              )}
            </button>
          </div>

          {searchResults.length > 0 && (
            <div className="mt-8 sm:mt-10 animate-fadeInUp">
              <h3 className="text-2xl sm:text-3xl font-bold mb-6 tracking-wide drop-shadow-md">
                Search Results
              </h3>
              <div className="space-y-6">
                {searchResults.map((user) => (
                  <div
                    key={user._id}
                    className="flex flex-col sm:flex-row items-center justify-between p-6 bg-gray-800 rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="mb-4 sm:mb-0 sm:flex-1">
                      <p className="font-extrabold text-white text-xl sm:text-2xl">{user.username}</p>
                      <p className="text-gray-300 text-base sm:text-lg break-words">{user.email}</p>
                    </div>
                    <button
                      onClick={() => followUser(user._id)}
                      className="bg-indigo-700 hover:bg-indigo-900 text-white px-5 py-3 rounded-full font-semibold shadow-lg transition-colors duration-300 whitespace-nowrap"
                      aria-label={`Follow ${user.username}`}
                    >
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Friends Activity Feed */}
        <section className="bg-gray-900 bg-opacity-80 rounded-3xl shadow-lg p-6 sm:p-10 border border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-10 gap-4">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-wide drop-shadow-md animate-fadeInUp">
              Recent Activity
            </h2>
            <button
              onClick={fetchActivities}
              className="text-indigo-400 hover:text-indigo-300 text-base sm:text-lg font-semibold flex items-center transition-colors duration-300 whitespace-nowrap"
              aria-label="Refresh activities"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>

          {activityLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-sp极 rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-12 sm:py-16 text-gray-400 font-semibold animate-fadeInUp">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 sm:h-20 sm:w-20 mx-auto mb-6"
                fill="none"
                viewBox="0 0 24 极4"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 极 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 极 2 2 0 014 0z"
                />
              </svg>
              <p className="text-2xl sm:text-3xl">No activity from your friends yet.</p>
              <p className="mt-4 text-lg sm:text-xl">Follow some friends to see their progress here!</p>
            </div>
          ) : (
            <div className="space-y-6 sm:space-y-8 animate-fadeInUp">
              {activities.map((activity) => (
                <div
                  key={activity._id}
                  className="flex flex-col sm:flex-row items-start sm:items-center p-6 bg-gray-800 rounded-3xl hover:bg-gray-700 transition-colors duration-300 shadow-lg"
                >
                  <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 bg-indigo-700 rounded-full flex items-center justify-center mr-0 sm:mr-6 mb-4 sm:mb-0 shadow-inner">
                    <span className="text-white font-extrabold text-xl sm:text-2xl select-none">
                      {activity.user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-extrabold text-white text-xl sm:text-2xl leading-snug">
                      <span className="text-indigo-400">{activity.user.username}</span>{' '}
                      {activity.completedToday ? 'completed' : 'updated'}{' '}
                      <span className="font-semibold">{activity.name}</span>
                    </p>
                    <div className="flex flex-wrap items-center mt-3 sm:mt-4 text-gray-300 text-base sm:text-lg gap-4">
                      <div className="极lex items-center text-yellow-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>{activity.streak} day streak</span>
                      </div>
                      <span className="text-gray-400">{formatDate(activity.updated极)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => unfollowUser(activity.user._id)}
                    className="text-gray-400 hover:text-red-500 text-lg transition-colors duration-300 p-2 ml-auto sm:ml-6"
                    title="Unfollow"
                    aria-label={`Unfollow ${activity.user.username}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <style jsx global>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translate3d(0, 30px, 0);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
}