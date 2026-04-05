import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Circle, Trash2, Calendar, Plus, Filter, SortAsc } from 'lucide-react';
import { Priority, Category, Task } from '../types';

export const TasksPage: React.FC = () => {
  const { tasks, addTask, toggleTask, deleteTask } = useData();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [showAdd, setShowAdd] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const filteredTasks = tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask({
      title: newTaskTitle,
      completed: false,
      priority: Priority.MEDIUM,
      dueDate: new Date().toISOString(),
      category: Category.WORK
    });
    setNewTaskTitle('');
    setShowAdd(false);
  };

  const getPriorityBadge = (p: Priority) => {
    const colors = {
      [Priority.HIGH]: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
      [Priority.MEDIUM]: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
      [Priority.LOW]: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    };
    return <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${colors[p]}`}>{p}</span>;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold dark:text-white">Vazifalar</h2>
          <p className="text-gray-500 dark:text-gray-400">Ishlaringizni rejalashtiring va bajaring</p>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="bg-primary hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all"
        >
          <Plus className="w-5 h-5" /> Yangi Vazifa
        </button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.form 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleAddTask}
            className="mb-6 overflow-hidden"
          >
            <div className="flex gap-2">
              <input 
                autoFocus
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Vazifa nomi..."
                className="flex-1 bg-white dark:bg-card border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary dark:text-white"
              />
              <button type="submit" className="bg-secondary text-white px-6 rounded-xl font-medium">Saqlash</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'active', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors
              ${filter === f 
                ? 'bg-white dark:bg-card text-primary shadow-sm border border-gray-200 dark:border-gray-700' 
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            {f === 'all' ? 'Barchasi' : f === 'active' ? 'Faol' : 'Bajarilgan'}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`group bg-white dark:bg-card p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between hover:border-primary/30 transition-all ${task.completed ? 'opacity-60' : ''}`}
          >
            <div className="flex items-center gap-4">
              <button onClick={() => toggleTask(task.id)} className="text-gray-400 hover:text-primary transition-colors">
                {task.completed ? <CheckCircle className="w-6 h-6 text-secondary" /> : <Circle className="w-6 h-6" />}
              </button>
              <div>
                <h4 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : 'dark:text-white'}`}>
                  {task.title}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  {getPriorityBadge(task.priority)}
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> bugun
                  </span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => deleteTask(task.id)}
              className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </motion.div>
        ))}
        {filteredTasks.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            Hozircha vazifalar yo'q
          </div>
        )}
      </div>
    </div>
  );
};
