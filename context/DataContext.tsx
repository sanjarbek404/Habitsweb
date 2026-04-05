
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Habit, Task, Message } from '../types';

const API_URL = '/api';

interface DataContextType {
  user: User | null;
  isAuthenticated: boolean;
  habits: Habit[];
  tasks: Task[];
  loading: boolean;
  isMockMode: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => void;
  completeOnboarding: () => void;
  addHabit: (habit: any) => void;
  toggleHabit: (id: string, date: string) => void;
  addTask: (task: any) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  deleteHabit: (id: string) => void;
  updateUserPoints: (points: number) => void;
  checkBadges: () => void;
  fetchMessages: () => Promise<Message[]>;
  sendMessage: (text: string) => Promise<Message>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [habits, sethabits] = useState<Habit[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const isMockMode = false;

  const authHeader = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchInitialData = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/data`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          logout();
          return;
        }
        return;
      }

      const data = await res.json();
      setUser(data.user);
      sethabits(data.habits || []);
      setTasks(data.tasks || []);
      setIsAuthenticated(true);
    } catch (e) {
      // console.error("Data load error:", e);
      // Agar server ishlamayotgan bo'lsa yoki boshqa xato bo'lsa, token noto'g'ri degani emas.
      // Lekin foydalanuvchi tizimga kirolmagan hisoblanadi.
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchInitialData(token);
    } else {
      setLoading(false);
    }
  }, []);

  const handleAuthResponse = async (res: Response) => {
    let data;
    try { data = await res.json(); } catch (e) { throw new Error(`Server Error: ${res.status}`); }
    if (!res.ok) throw new Error(data.message || "Xatolik yuz berdi");
    return data;
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      const data = await handleAuthResponse(res);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      sethabits([]); setTasks([]);
      fetchInitialData(data.token);
      return true;
    } catch (e: any) {
      if (e.message.includes("Failed to fetch")) throw new Error("Server bilan aloqa yo'q.");
      throw e;
    }
  };

  const register = async (username: string, email: string, pass: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password: pass })
      });
      const data = await handleAuthResponse(res);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      sethabits([]); setTasks([]);
      return true;
    } catch (e: any) {
      if (e.message.includes("Failed to fetch")) throw new Error("Server bilan aloqa yo'q.");
      throw e;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    sethabits([]);
    setTasks([]);
    localStorage.removeItem('token');
  };

  const updateUserProfile = async (data: Partial<User>) => {
    if (!user) return;
    setUser(prev => prev ? { ...prev, ...data } : null);
    try {
      await fetch(`${API_URL}/users/profile`, {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify(data)
      });
    } catch (e) { console.error(e); }
  };

  const completeOnboarding = () => updateUserProfile({ hasSeenOnboarding: true });

  const addHabit = async (habitData: any) => {
    if (!user) return;
    try {
      const res = await fetch(`${API_URL}/habits`, {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify(habitData)
      });
      if (res.ok) {
        const newHabit = await res.json();
        sethabits(prev => [...prev, newHabit]);
        checkBadges();
      }
    } catch (e) { console.error(e); }
  };

  const toggleHabit = async (id: string, date: string) => {
    let pointsAwarded = 0;
    const updatedhabits = habits.map(h => {
      if (h.id !== id) return h;
      const isCompleted = h.completedDates.includes(date);
      let newDates = isCompleted ? h.completedDates.filter(d => d !== date) : [...h.completedDates, date];
      let streak = h.streak;
      if (!isCompleted) { streak += 1; pointsAwarded = 10; }
      else { streak = Math.max(0, streak - 1); pointsAwarded = -10; }
      return { ...h, completedDates: newDates, streak };
    });
    sethabits(updatedhabits);

    try {
      const habit = updatedhabits.find(h => h.id === id);
      if (habit) {
        await fetch(`${API_URL}/habits/${id}`, {
          method: 'PUT',
          headers: authHeader(),
          body: JSON.stringify({ completedDates: habit.completedDates, streak: habit.streak })
        });
      }
    } catch (e) { console.error(e); }

    if (pointsAwarded !== 0) updateUserPoints(pointsAwarded);
  };

  const deleteHabit = async (id: string) => {
    sethabits(prev => prev.filter(h => h.id !== id));
    try { await fetch(`${API_URL}/habits/${id}`, { method: 'DELETE', headers: authHeader() }); }
    catch (e) { console.error(e); }
  };

  const addTask = async (taskData: any) => {
    if (!user) return;
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify(taskData)
      });
      if (res.ok) {
        const newTask = await res.json();
        setTasks(prev => [newTask, ...prev]);
      }
    } catch (e) { console.error(e); }
  };

  const toggleTask = async (id: string) => {
    let pointsAwarded = 0;
    const updatedTasks = tasks.map(t => {
      if (t.id !== id) return t;
      const newStatus = !t.completed;
      if (newStatus) pointsAwarded = 20;
      return { ...t, completed: newStatus };
    });
    setTasks(updatedTasks);
    try {
      await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify({ completed: !tasks.find(t => t.id === id)?.completed })
      });
    } catch (e) { console.error(e); }
    if (pointsAwarded > 0) updateUserPoints(pointsAwarded);
  };

  const deleteTask = async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    try { await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE', headers: authHeader() }); }
    catch (e) { console.error(e); }
  };

  const updateUserPoints = (amount: number) => {
    if (!user) return;
    const newPoints = Math.max(0, user.points + amount);
    const newLevel = Math.floor(newPoints / 100) + 1;
    updateUserProfile({ points: newPoints, level: newLevel });
    checkBadges();
  };

  const checkBadges = () => {
    if (!user) return;
    const newBadges = [...user.badges];
    let changed = false;

    if (!newBadges.includes('first_step') && habits.length > 0) {
      newBadges.push('first_step'); changed = true;
    }
    const maxStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);
    if (!newBadges.includes('week_warrior') && maxStreak >= 7) {
      newBadges.push('week_warrior'); changed = true;
    }
    if (!newBadges.includes('points_master') && user.points >= 500) {
      newBadges.push('points_master'); changed = true;
    }

    if (changed) {
      updateUserProfile({ badges: newBadges });
      // Optional: Show notification
    }
  };

  const fetchMessages = async (): Promise<Message[]> => {
    try {
      const res = await fetch(`${API_URL}/chat?limit=50`, { headers: authHeader() });
      if (res.ok) return await res.json();
      return [];
    } catch (e) { return []; }
  };

  const sendMessage = async (text: string): Promise<Message> => {
    const res = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: authHeader(),
      body: JSON.stringify({ text })
    });
    if (!res.ok) throw new Error("Xabar yuborilmadi");
    return await res.json();
  };

  return (
    <DataContext.Provider value={{
      user, isAuthenticated, habits, tasks, loading, isMockMode,
      login, register, logout, updateUserProfile, completeOnboarding,
      addHabit, toggleHabit, addTask, toggleTask, deleteTask, deleteHabit, updateUserPoints, checkBadges,
      fetchMessages, sendMessage
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within DataProvider");
  return context;
};
