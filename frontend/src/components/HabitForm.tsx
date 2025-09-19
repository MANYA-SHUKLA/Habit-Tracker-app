'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import api from '@/utils/api';

const habitSchema = z.object({
  name: z.string().min(1, 'Habit name is required'),
  description: z.string().optional(),
  frequency: z.enum(['daily', 'weekly']),
  category: z.string().optional(),
});

type HabitForm = z.infer<typeof habitSchema>;

interface HabitWithId extends HabitForm {
  _id: string;
}

interface HabitFormProps {
  onClose: () => void;
  onSuccess: () => void;
  habit?: HabitWithId; // Include _id here for edit mode
}

const HabitForm: React.FC<HabitFormProps> = ({ onClose, onSuccess, habit }) => {
  const isEdit = Boolean(habit);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<HabitForm>({
    resolver: zodResolver(habitSchema),
    defaultValues: habit || {
      frequency: 'daily',
    },
  });

  const onSubmit = async (data: HabitForm) => {
    try {
      if (isEdit && habit?._id) {
        await api.put(`/habits/${habit._id}`, data);
        toast.success('Habit updated successfully!');
      } else {
        await api.post('/habits', data);
        toast.success('Habit created successfully!');
      }
      onSuccess();
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as any).response?.data?.error === 'string'
      ) {
        toast.error((error as any).response.data.error);
      } else {
        toast.error('Failed to save habit');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="relative bg-white rounded-xl shadow-2xl max-w-full w-full mx-2 sm:mx-4 md:max-w-md lg:max-w-lg p-4 sm:p-6 md:p-8 animate-slide-in transform-gpu">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
            {isEdit ? 'Edit Habit' : 'Create New Habit'}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-gray-400 hover:text-gray-700 transition-colors duration-300 p-1 sm:p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-1">
              Habit Name <span className="text-red-600">*</span>
            </label>
            <input
              id="name"
              {...register('name')}
              type="text"
              placeholder="e.g., Morning Meditation"
              className={`w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow duration-300 placeholder-gray-400 font-semibold text-gray-900 text-sm sm:text-base ${
                errors.name ? 'border-red-600 focus:ring-red-600' : 'border-gray-300'
              } shadow-sm`}
              aria-invalid={errors.name ? 'true' : 'false'}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <p id="name-error" className="mt-1 text-sm text-red-600 font-semibold">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-800 mb-1">
              Description
            </label>
            <textarea
              id="description"
              {...register('description')}
              rows={3}
              placeholder="Describe your habit..."
              className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 font-semibold text-gray-900 text-sm sm:text-base transition-shadow duration-300 shadow-sm"
            />
          </div>

          <div>
            <label htmlFor="frequency" className="block text-sm font-semibold text-gray-800 mb-1">
              Frequency <span className="text-red-600">*</span>
            </label>
            <select
              id="frequency"
              {...register('frequency')}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-gray-900 text-sm sm:text-base transition-shadow duration-300 shadow-sm"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-gray-800 mb-1">
              Category
            </label>
            <input
              id="category"
              {...register('category')}
              type="text"
              placeholder="e.g., Health, Productivity"
              className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 font-semibold text-gray-900 text-sm sm:text-base transition-shadow duration-300 shadow-sm"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end space-y-reverse space-y-3 sm:space-y-0 sm:space-x-3 pt-4 sm:pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 sm:px-6 sm:py-3 font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 sm:px-6 sm:py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-300 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {isSubmitting ? (isEdit ? 'Updating...' : 'Creating...') : isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default HabitForm;
