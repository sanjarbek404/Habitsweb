import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { LevelCard, BadgesList } from './Gamification';
import { HabitList } from './HabitList';
import { TaskList } from './TaskList';
import { AICoach } from './AICoach';
import { OnboardingGuide } from './OnboardingGuide';
import { Plus, X, BarChart3, TrendingUp, Calendar } from 'lucide-react';
import { Category, Priority, Frequency } from '../types';
import { motion, AnimatePresence, Variants } from 'framer-motion';

export const Dashboard: React.FC = () => {
  const { user, addHabit, addTask, habits } = useData();
  const [showModal, setShowModal] = useState<'habit' | 'task' | null>(null);

  // Animation Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  // Weekly Progress Simulation
  const weeklyProgress = [40, 70, 50, 90, 60, 80, 45];
  const weekDays = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];

  // --- MODALS (AddHabitModal & AddTaskModal - Simplified for brevity, same logic) ---
  const AddHabitModal = () => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<Category>(Category.PERSONAL);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!title.trim()) return;
      addHabit({ title, category, frequency: Frequency.DAILY });
      setShowModal(null);
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(null)}></div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-card w-full max-w-md rounded-2xl p-6 shadow-2xl relative z-10 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold dark:text-white">Yangi Odat</h3>
            <button onClick={() => setShowModal(null)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"><X className="w-5 h-5 text-gray-500" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input autoFocus className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary dark:text-white" placeholder="Odat nomi..." value={title} onChange={e => setTitle(e.target.value)} />
            <div className="flex gap-2 flex-wrap">
              {Object.values(Category).map((cat) => (
                <button key={cat} type="button" onClick={() => setCategory(cat)} className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${category === cat ? 'bg-primary text-white border-primary' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'}`}>{cat}</button>
              ))}
            </div>
            <button type="submit" className="w-full bg-primary hover:bg-indigo-600 text-white py-3 rounded-xl font-medium">Qo'shish</button>
          </form>
        </motion.div>
      </div>
    );
  };

  const AddTaskModal = () => {
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!title.trim()) return;
      addTask({ title, category: Category.WORK, priority, dueDate: new Date().toISOString() });
      setShowModal(null);
    };
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(null)}></div>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-card w-full max-w-md rounded-2xl p-6 shadow-2xl relative z-10 border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold dark:text-white">Yangi Vazifa</h3>
            <button onClick={() => setShowModal(null)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"><X className="w-5 h-5 text-gray-500" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input autoFocus className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl p-3 outline-none focus:ring-2 focus:ring-secondary dark:text-white" placeholder="Vazifa nomi..." value={title} onChange={e => setTitle(e.target.value)} />
            <div className="flex gap-2">
              {[Priority.LOW, Priority.MEDIUM, Priority.HIGH].map((p) => (
                <button key={p} type="button" onClick={() => setPriority(p)} className={`flex-1 py-2 rounded-lg text-sm border transition-all ${priority === p ? 'bg-secondary text-white border-secondary' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'}`}>{p}</button>
              ))}
            </div>
            <button type="submit" className="w-full bg-secondary hover:bg-emerald-600 text-white py-3 rounded-xl font-medium">Qo'shish</button>
          </form>
        </motion.div>
      </div>
    );
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 5) return "Tun xayrli bo'lsin";
    if (hour < 12) return "Xayrli tong";
    if (hour < 18) return "Xayrli kun";
    return "Xayrli kech";
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8 pb-10">
      <OnboardingGuide />
      <AnimatePresence>
        {showModal === 'habit' && <AddHabitModal />}
        {showModal === 'task' && <AddTaskModal />}
      </AnimatePresence>

      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-end gap-6 bg-white dark:bg-card p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">{user?.username}</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            Bugungi unumdorlik: <span className="font-bold text-gray-900 dark:text-white">Yuqori</span>
          </p>
        </div>
        <div className="flex gap-3 relative z-10">
          <button onClick={() => setShowModal('habit')} className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90 px-5 py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95">
            <Plus className="w-5 h-5" /> Odat
          </button>
          <button onClick={() => setShowModal('task')} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-5 py-3 rounded-xl font-bold transition-all active:scale-95">
            <Plus className="w-5 h-5" /> Vazifa
          </button>
        </div>
      </motion.div>

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={itemVariants}>
          <LevelCard />
        </motion.div>

        {/* Weekly Stats Widget */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-card p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" /> Haftalik Faollik
            </h3>
            <span className="text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-full font-medium">+12%</span>
          </div>
          <div className="flex justify-between items-end h-32 gap-2">
            {weeklyProgress.map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-2 w-full">
                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-t-lg relative h-full overflow-hidden">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className={`absolute bottom-0 w-full rounded-t-lg ${i === 3 ? 'bg-primary' : 'bg-primary/40'}`}
                  />
                </div>
                <span className="text-[10px] text-gray-400 font-medium">{weekDays[i]}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Date Widget */}
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden flex flex-col justify-center items-center text-center">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <Calendar className="w-10 h-10 mb-3 opacity-90" />
          <h3 className="text-3xl font-bold">{new Date().getDate()}</h3>
          <p className="text-emerald-100 text-lg uppercase tracking-widest font-medium">
            {new Date().toLocaleString('default', { month: 'long' })}
          </p>
          <p className="text-emerald-50/70 text-sm mt-2">Bugungi kun uchun 5 ta reja bor</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (habits + Chat) */}
        <div className="lg:col-span-8 space-y-8">
          <motion.div variants={itemVariants}>
            <HabitList />
          </motion.div>
          <motion.div variants={itemVariants}>
            <AICoach />
          </motion.div>
        </div>

        {/* Right Column (Tasks + Badges) */}
        <div className="lg:col-span-4 space-y-8">
          <motion.div variants={itemVariants}>
            <TaskList />
          </motion.div>
          <motion.div variants={itemVariants}>
            <BadgesList />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};