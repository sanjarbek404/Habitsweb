import React from 'react';
import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Flame, Trash2, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export const HabitList: React.FC = () => {
  const { habits, toggleHabit, deleteHabit } = useData();
  const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="bg-white dark:bg-card rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Kunlik Odatlar
        </h2>
        <span className="text-xs font-medium bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full text-gray-500">
          {habits.filter(h => h.completedDates.includes(today)).length}/{habits.length}
        </span>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {habits.map((habit) => {
            const isCompleted = habit.completedDates.includes(today);
            return (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className={`group p-4 rounded-2xl border flex items-center justify-between transition-all duration-300
                  ${isCompleted
                    ? 'bg-gradient-to-r from-emerald-50/50 to-transparent border-emerald-200 dark:border-emerald-900/30 dark:from-emerald-900/10'
                    : 'bg-white hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-800 border-transparent hover:border-gray-200 dark:hover:border-gray-700'}`}
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleHabit(habit.id, today)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
                      ${isCompleted
                        ? 'bg-secondary text-white shadow-lg shadow-secondary/30 scale-105'
                        : 'bg-gray-100 text-gray-300 hover:text-gray-400 dark:bg-gray-700 dark:text-gray-500'}`}
                  >
                    <Check className="w-5 h-5" strokeWidth={3} />
                  </button>

                  <div>
                    <h4 className={`font-semibold text-lg transition-colors ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-gray-100'}`}>
                      {habit.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 px-2 py-0.5 rounded-md">
                        {habit.category}
                      </span>
                      <span className={`text-xs font-medium flex items-center gap-1 ${habit.streak > 0 ? 'text-orange-500' : 'text-gray-400'}`}>
                        <Flame className="w-3 h-3 fill-current" />
                        {habit.streak} streak
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => deleteHabit(habit.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {habits.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center text-gray-400 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl">
            <p className="mb-2">Hali odatlar yo'q</p>
            <p className="text-sm opacity-60">"Odat" tugmasini bosib birinchisini yarating</p>
          </div>
        )}
      </div>
    </div>
  );
};
