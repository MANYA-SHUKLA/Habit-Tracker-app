export interface User {
  _id: string;
  username: string;
  email: string;
  following?: string[];
  followers?: string[];
}

export interface Habit {
  _id: string;
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly';
  category?: string;
  user: User;
  completions: Completion[];
  streak: number;
  createdAt: string;
  updatedAt: string;
}

export interface Completion {
  date: string;
  completed: boolean;
  _id?: string;
}

export interface AuthResponse {
  status: string;
  token: string;
  data: {
    user: User;
  };
}