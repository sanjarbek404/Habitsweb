import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Check, Plus, Trash2, Calendar } from 'lucide-react';
import { Category, Frequency } from '../types';
import { format } from 'date-fns';

export const HabitsPage: React.FC = () => {
  const { habits, addHabit, toggleHabit, deleteHabit } = useData();
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const today = format(new Date(), 'yyyy-MM-dd');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addHabit({
      title: newTitle,
      category: Category.PERSONAL,
      frequency: Frequency.DAILY
    });
    setNewTitle('');
    setShowAdd(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold dark:text-white">Odatlar</h2>
          <p className="text-gray-500 dark:text-gray-400">Yaxshi odatlarni shakllantiring</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="bg-primary hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all"
        >
          <Plus className="w-5 h-5" /> Yangi Odat
        </button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleAdd}
            className="mb-6 overflow-hidden"
          >
            <div className="flex gap-2">
              <input
                autoFocus
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Odat nomi (masalan: Yugurish)..."
                className="flex-1 bg-white dark:bg-card border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary dark:text-white"
              />
              <button type="submit" className="bg-secondary text-white px-6 rounded-xl font-medium">Saqlash</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {habits.map((habit) => {
          const isCompleted = habit.completedDates.includes(today);
          return (
            <motion.div
              key={habit.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`group p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden
                  ${isCompleted
                  ? 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/30'
                  : 'bg-white dark:bg-card border-gray-100 dark:border-gray-800 hover:border-primary/50'}`}
            >
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded mb-2 inline-block">
                    {habit.category}
                  </span>
                  <h3 className={`text-xl font-bold ${isCompleted ? 'text-emerald-700 dark:text-emerald-400' : 'dark:text-white'}`}>
                    {habit.title}
                  </h3>
                </div>
                <button
                  onClick={() => toggleHabit(habit.id, today)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-sm
                      ${isCompleted
                      ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                      : 'bg-gray-100 text-gray-300 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-600 dark:hover:text-gray-400'}`}
                >
                  <Check className="w-6 h-6" strokeWidth={3} />
                </button>
              </div>

              <div className="flex items-center gap-4 relative z-10">
                <div className={`flex items-center gap-1.5 font-bold ${habit.streak > 0 ? 'text-orange-500' : 'text-gray-400'}`}>
                  <Flame className={`w-5 h-5 ${habit.streak > 0 ? 'fill-orange-500 animate-pulse' : ''}`} />
                  {habit.streak} kun streak
                </div>
                <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-700"></div>
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> {habit.frequency}
                </div>
              </div>

              <button
                onClick={() => deleteHabit(habit.id)}
                className="absolute bottom-4 right-4 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all z-10"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </motion.div>
          );
        })}
      </div>

      {habits.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          Hozircha odatlar yo'q. Yangisini qo'shing!
        </div>
      )}
    </div>
  );
};
