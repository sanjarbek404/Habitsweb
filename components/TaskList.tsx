import React from 'react';
import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Circle, CheckCircle, Trash2, Calendar } from 'lucide-react';
import { Priority } from '../types';

export const TaskList: React.FC = () => {
  const { tasks, toggleTask, deleteTask } = useData();

  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case Priority.HIGH: return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      case Priority.MEDIUM: return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case Priority.LOW: return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
      default: return 'text-gray-500';
    }
  };

  // Sort: Incomplete first, then by priority
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });

  return (
    <div className="bg-white dark:bg-card rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 h-full">
      <h2 className="text-xl font-bold dark:text-white mb-6">Bugungi Vazifalar</h2>
      
      <div className="space-y-3">
        <AnimatePresence>
          {sortedTasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="group flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <button onClick={() => toggleTask(task.id)} className="text-gray-400 hover:text-primary transition-colors">
                  {task.completed ? 
                    <CheckCircle className="w-5 h-5 text-secondary" /> : 
                    <Circle className="w-5 h-5" />
                  }
                </button>
                <div className={`${task.completed ? 'opacity-50 line-through' : ''}`}>
                  <p className="font-medium text-sm text-gray-800 dark:text-gray-200">{task.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className="flex items-center text-[10px] text-gray-400">
                      <Calendar className="w-3 h-3 mr-1" />
                      14:00
                    </span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {tasks.length === 0 && (
          <div className="text-center py-6 text-gray-400 text-sm">
            Vazifalar yo'q. Dam oling!
          </div>
        )}
      </div>
    </div>
  );
};
