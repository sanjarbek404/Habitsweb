
export enum Priority {
  LOW = 'Past',
  MEDIUM = 'O\'rta',
  HIGH = 'Yuqori'
}

export enum Category {
  WORK = 'Ish',
  STUDY = 'O\'qish',
  FITNESS = 'Salomatlik',
  PERSONAL = 'Shaxsiy'
}

export enum Frequency {
  DAILY = 'Har kuni',
  WEEKLY = 'Haftalik'
}

export interface User {
  id: string;
  _id?: string; // MongoDB ID
  username: string;
  email: string;
  bio?: string;
  jobTitle?: string;
  points: number;
  level: number;
  streak: number;
  badges: string[];
  avatarUrl?: string;
  token?: string;
  hasSeenOnboarding: boolean;
}

export interface Habit {
  id: string;
  _id?: string; // MongoDB ID
  title: string;
  category: Category;
  frequency: Frequency;
  completedDates: string[]; // ISO date strings
  streak: number;
  createdAt: string;
}

export interface Task {
  id: string;
  _id?: string; // MongoDB ID
  title: string;
  completed: boolean;
  priority: Priority;
  dueDate: string;
  category: Category;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (user: User, habits: Habit[], tasks: Task[]) => boolean;
}

export interface Message {
  id: string;
  text: string;
  userId: string;
  username: string;
  userAvatar?: string;
  userLevel: number;
  createdAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}
