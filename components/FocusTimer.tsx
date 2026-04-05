
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Settings, Coffee, Brain, Laptop } from 'lucide-react';
import { useData } from '../context/DataContext';

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

export const FocusTimer: React.FC = () => {
  const { updateUserPoints } = useData();
  const [mode, setMode] = useState<TimerMode>('focus');
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [showSettings, setShowSettings] = useState(false);
  
  // Settings
  const [durations, setDurations] = useState({
    focus: 25,
    shortBreak: 5,
    longBreak: 15
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const maxTime = durations[mode] * 60;
  const progress = ((maxTime - timeLeft) / maxTime) * 100;

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (isActive) {
        setIsActive(false);
        // Mukofotlash
        if (mode === 'focus') {
          updateUserPoints(50); // 50 XP focus tugagani uchun
          try {
              new Notification("Diqqat!", { body: "Fokus vaqti tugadi. Tanaffus qiling!" });
          } catch(e) { console.log("Notification error", e); }
        } else {
          try {
              new Notification("Tanaffus tugadi", { body: "Ishga qaytish vaqti keldi!" });
          } catch(e) { console.log("Notification error", e); }
        }
      }
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, mode, updateUserPoints]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(durations[newMode] * 60);
  };

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(durations[mode] * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const circleRadius = 120;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] relative">
      <div className="absolute top-0 right-0">
        <button 
          onClick={() => setShowSettings(true)}
          className="p-3 text-gray-500 hover:text-primary transition-colors"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>

      {/* Mode Switcher */}
      <div className="bg-white dark:bg-card p-1.5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 flex gap-1 mb-12">
        {[
          { id: 'focus', label: 'Fokus', icon: Brain },
          { id: 'shortBreak', label: 'Qisqa Tanaffus', icon: Coffee },
          { id: 'longBreak', label: 'Uzoq Tanaffus', icon: Laptop },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => switchMode(m.id as TimerMode)}
            className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all duration-300
              ${mode === m.id 
                ? 'bg-primary text-white shadow-lg' 
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <m.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{m.label}</span>
          </button>
        ))}
      </div>

      {/* Timer Circle */}
      <div className="relative w-80 h-80 flex items-center justify-center">
        {/* Background Circle */}
        <svg className="absolute inset-0 w-full h-full rotate-[-90deg]">
          <circle
            cx="160"
            cy="160"
            r={circleRadius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-gray-100 dark:text-gray-800"
          />
          {/* Progress Circle */}
          <motion.circle
            cx="160"
            cy="160"
            r={circleRadius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset }}
            strokeLinecap="round"
            className={`transition-colors duration-500 ${
              mode === 'focus' ? 'text-primary' : mode === 'shortBreak' ? 'text-emerald-500' : 'text-blue-500'
            }`}
          />
        </svg>

        <div className="text-center z-10">
          <motion.div 
            key={timeLeft}
            initial={{ scale: 0.9, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-7xl font-bold text-gray-900 dark:text-white font-mono tracking-tighter"
          >
            {formatTime(timeLeft)}
          </motion.div>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium uppercase tracking-widest text-sm">
            {isActive ? "Jarayon ketmoqda..." : "Tayyormisiz?"}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6 mt-12">
        <button
          onClick={toggleTimer}
          className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl transition-transform hover:scale-105 active:scale-95
            ${isActive ? 'bg-orange-500' : 'bg-primary'}`}
        >
          {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
        </button>
        
        <button
          onClick={resetTimer}
          className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center justify-center transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
              onClick={() => setShowSettings(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-card w-full max-w-sm rounded-3xl p-6 shadow-2xl relative z-10"
            >
              <h3 className="text-xl font-bold dark:text-white mb-6">Taymer Sozlamalari</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-2">Fokus Vaqti (daqiqa)</label>
                  <input 
                    type="number" 
                    value={durations.focus} 
                    onChange={(e) => setDurations({...durations, focus: Number(e.target.value)})}
                    className="w-full bg-gray-50 dark:bg-gray-800 rounded-xl p-3 dark:text-white border-none outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-2">Qisqa Tanaffus (daqiqa)</label>
                  <input 
                    type="number" 
                    value={durations.shortBreak} 
                    onChange={(e) => setDurations({...durations, shortBreak: Number(e.target.value)})}
                    className="w-full bg-gray-50 dark:bg-gray-800 rounded-xl p-3 dark:text-white border-none outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-2">Uzoq Tanaffus (daqiqa)</label>
                  <input 
                    type="number" 
                    value={durations.longBreak} 
                    onChange={(e) => setDurations({...durations, longBreak: Number(e.target.value)})}
                    className="w-full bg-gray-50 dark:bg-gray-800 rounded-xl p-3 dark:text-white border-none outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <button 
                onClick={() => {
                   setShowSettings(false);
                   switchMode(mode); // Reset timer with new settings
                }} 
                className="w-full bg-primary text-white py-3 rounded-xl font-bold mt-6 hover:bg-indigo-600 transition-colors"
              >
                Saqlash
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
