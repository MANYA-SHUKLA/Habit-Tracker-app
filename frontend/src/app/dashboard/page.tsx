'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Habit } from '@/types';
import api from '@/utils/api';
import toast from 'react-hot-toast';
import HabitForm from '@/components/HabitForm';
import HabitCard from '@/components/HabitCard';

interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
}

export default function Dashboard() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await api.get('/habits');
      setHabits(response.data.data.habits);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError.response?.data?.error || 'Failed to fetch habits');
    } finally {
      setLoading(false);
    }
  };

  const handleHabitCreated = () => {
    setShowForm(false);
    setEditingHabit(null);
    fetchHabits();
    toast.success('Habit created successfully!');
  };

  const handleHabitUpdated = () => {
    setShowForm(false);
    setEditingHabit(null);
    fetchHabits();
    toast.success('Habit updated successfully!');
  };

  const handleHabitDeleted = () => {
    fetchHabits();
    toast.success('Habit deleted successfully!');
  };

  const handleHabitCompleted = () => {
    fetchHabits();
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 py-8 sm:py-12">
      {/* Background Image with Fallback Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-100 to-indigo-200 z-0"></div>

      <div className="max-w-7xl mx-auto relative z-10 bg-white bg-opacity-90 backdrop-blur-md rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-10 gap-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-wide truncate">
            Your Habits
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-极 hover:bg-indigo-700 text-white px-4 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-300 font-semibold tracking-wide focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 w-full sm:w-auto justify-center whitespace-nowrap"
            aria-label="Add new habit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6 mr-2 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add New Habit
          </button>
        </div>

        {habits.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white rounded-xl shadow-md border border-gray-200 px-4 sm:px-6 max-w-lg mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 sm:h-20 sm:w-20 mx-auto text-gray-400 mb-4 sm:mb-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 tracking-wide">
              No habits yet
            </h3>
            <p className="text-gray-600 mb-6 font-medium">
              Get started by creating your first habit!
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold shadow-md hover:shadow-lg transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 whitespace-nowrap"
              aria-label="Create your first habit"
            >
              Create Your First Habit
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {habits.map((habit) => (
              <HabitCard
                key={habit._id}
                habit={habit}
                onDelete={handleHabitDeleted}
                onComplete={handleHabitCompleted}
                onEdit={() => handleEditHabit(habit)}
              />
            ))}
          </div>
        )}

        {/* HabitForm Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 sm:p-6">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg overflow-auto max-h-[90vh]">
              <HabitForm
                onClose={() => {
                  setShowForm(false);
                  setEditingHabit(null);
                }}
                onSuccess={editingHabit ? handleHabitUpdated : handleHabitCreated}
                habit={editingHabit || undefined}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}