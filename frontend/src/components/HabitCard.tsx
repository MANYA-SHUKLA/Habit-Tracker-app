'use client';

import React, { useState } from 'react';
import { Habit } from '@/types';
import api from '@/utils/api';
import toast from 'react-hot-toast';

interface HabitCardProps {
  habit: Habit;
  onDelete: () => void;
  onComplete: () => void;
  onEdit: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onDelete,
  onComplete,
  onEdit,
}) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      await api.post(`/habits/${habit._id}/complete`);
      toast.success('Habit marked as complete!');
      onComplete();
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as any).response?.data?.error === 'string'
      ) {
        toast.error((error as any).response.data.error);
      } else {
        toast.error('Failed to complete habit');
      }
    } finally {
      setIsCompleting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this habit?')) return;

    setIsDeleting(true);
    try {
      await api.delete(`/habits/${habit._id}`);
      onDelete();
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as any).response?.data?.error === 'string'
      ) {
        toast.error((error as any).response.data.error);
      } else {
        toast.error('Failed to delete habit');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // Check if habit is completed based on frequency
  const isCompleted = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (habit.frequency === 'daily') {
      // Check if completed today
      return habit.completions.some((completion) => {
        const compDate = new Date(completion.date);
        compDate.setHours(0, 0, 0, 0);
        return compDate.getTime() === today.getTime() && completion.completed;
      });
    } else {
      // Check if completed this week (weekly habit)
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() + (6 - today.getDay())); // Saturday
      endOfWeek.setHours(23, 59, 59, 999);

      return habit.completions.some((completion) => {
        const compDate = new Date(completion.date);
        return (
          compDate >= startOfWeek &&
          compDate <= endOfWeek &&
          completion.completed
        );
      });
    }
  };

  const getCompletionText = () => {
    if (isCompleted()) {
      return habit.frequency === 'daily'
        ? 'Completed Today'
        : 'Completed This Week';
    }
    return habit.frequency === 'daily'
      ? 'Mark as Complete'
      : 'Complete for Week';
  };

  const getButtonClass = () => {
    if (isCompleted()) {
      return 'bg-green-200 text-green-800 cursor-not-allowed';
    }
    return 'bg-indigo-600 hover:bg-indigo-700 text-white';
  };

  // Enhanced streak visualization - show fire emojis based on streak length
  const renderStreakVisualization = () => {
    if (habit.streak === 0) return null;

    const fires = [];
    const fireCount = Math.min(Math.floor(habit.streak / 7) + 1, 5); // Max 5 fires

    for (let i = 0; i < fireCount; i++) {
      fires.push(
        <span key={i} className="text-xl" role="img" aria-label="fire">
          🔥
        </span>
      );
    }

    return (
      <div className="flex items-center mt-2">
        <span className="text-sm font-semibold text-gray-700 mr-2">Streak:</span>
        <div className="flex items-center">
          <span className="text-sm font-bold text-amber-600 mr-1">
            {habit.streak}
          </span>
          <span className="text-xs text-gray-500">days</span>
        </div>
        <div className="ml-2 flex">{fires}</div>
      </div>
    );
  };

  // Background image URL for card subtle decorative background
  const cardBackgroundUrl =
    'https://images.unsplash.com/photo-1506765515384-028b60a970df?auto=format&fit=crop&w=600&q=80';

  return (
    <div
      className="relative rounded-xl overflow-hidden shadow-md border border-gray-200 hover:shadow-xl transition-shadow duration-300 cursor-pointer bg-white max-w-full sm:max-w-md mx-auto"
      style={{
        backgroundImage: `url(${cardBackgroundUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      aria-label={`Habit card for ${habit.name}`}
    >
      {/* Overlay to enhance readability */}
      <div className="absolute inset-0 bg-white bg-opacity-90 backdrop-blur-sm"></div>

      <div className="relative p-4 sm:p-6 flex flex-col h-full">
        <div className="flex flex-wrap justify-between items-start mb-4 gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 drop-shadow-sm truncate">
              {habit.name}
            </h3>
            {habit.category && (
              <span className="inline-block bg-indigo-200 text-indigo-800 text-xs px-2 py-1 rounded-full font-semibold select-none shadow-sm whitespace-nowrap">
                {habit.category}
              </span>
            )}
          </div>
          <div className="flex space-x-2 flex-shrink-0">
            <button
              onClick={onEdit}
              className="text-blue-600 hover:text-blue-800 transition-colors duration-300 p-1 flex-shrink-0"
              aria-label="Edit habit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-600 hover:text-red-800 transition-colors duration-300 p-1 disabled:opacity-50 flex-shrink-0"
              aria-label="Delete habit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        {habit.description && (
          <p className="text-gray-700 mb-4 text-sm leading-relaxed break-words">
            {habit.description}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
          <div className="flex items-center whitespace-nowrap">
            <span
              className={`inline-block w-3 h-3 rounded-full mr-2 ${
                habit.frequency === 'daily' ? 'bg-green-500' : 'bg-blue-500'
              }`}
            ></span>
            <span className="text-sm sm:text-base text-gray-600 capitalize whitespace-nowrap">
              {habit.frequency}
            </span>
          </div>
          <div className="flex items-center whitespace-nowrap">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-yellow-500 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm sm:text-base font-semibold text-gray-800">
              {habit.streak}
            </span>
          </div>
        </div>

        {/* Enhanced streak visualization */}
        {renderStreakVisualization()}

        {/* Completion progress bar */}
        <div
          className="w-full max-w-full bg-gray-200 rounded-full h-2 mb-4 mt-2"
          aria-label={`${Math.min(
            100,
            (habit.streak / 30) * 100
          )}% progress to 30-day milestone`}
        >
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (habit.streak / 30) * 100)}%` }}
          ></div>
        </div>

        <button
          onClick={handleComplete}
          disabled={isCompleted() || isCompleting}
          className={`w-full py-2 px-4 rounded-lg font-medium text-sm sm:text-base transition-colors duration-300 ${getButtonClass()} ${
            isCompleting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isCompleting ? 'Marking...' : getCompletionText()}
        </button>
      </div>
    </div>
  );
};

export default HabitCard;
