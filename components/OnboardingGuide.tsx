import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import { ArrowRight, CheckCircle, Brain, Zap, Target, X } from 'lucide-react';

export const OnboardingGuide: React.FC = () => {
  const { user, completeOnboarding } = useData();
  const [step, setStep] = useState(0);

  if (user?.hasSeenOnboarding) return null;

  const steps = [
    {
      title: "habits.uz ga xush kelibsiz!",
      desc: "Bu platforma sizga yangi, foydali odatlarni shakllantirish va hayotingizni tartibga solishda yordam beradi. Keling, qanday ishlashini ko'rib chiqamiz.",
      icon: <Target className="w-16 h-16 text-indigo-500" />,
      color: "bg-indigo-50 dark:bg-indigo-900/20"
    },
    {
      title: "Odatlar Halqasi (Trigger Loop)",
      desc: "Har qanday odat 3 qismdan iborat: Belgi (Trigger), Harakat (Action) va Mukofot (Reward). Bizning ilova aynan shu prinsip asosida qurilgan.",
      icon: <Brain className="w-16 h-16 text-purple-500" />,
      color: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      title: "Kichik Qadamlar",
      desc: "Katta maqsadlarga birdaniga erishib bo'lmaydi. Odatlaringizni 'kuniga 10 daqiqa kitob o'qish' kabi kichik va oson bajariladigan qilib belgilang.",
      icon: <CheckCircle className="w-16 h-16 text-emerald-500" />,
      color: "bg-emerald-50 dark:bg-emerald-900/20"
    },
    {
      title: "Gamifikatsiya & Streak",
      desc: "Odatlarni uzluksiz bajaring va 'Streak' (ketma-ketlik)ni saqlang. Har bir yutuq uchun ballar olasiz va yangi darajalarga ko'tarilasiz!",
      icon: <Zap className="w-16 h-16 text-yellow-500" />,
      color: "bg-yellow-50 dark:bg-yellow-900/20"
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      completeOnboarding();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <motion.div
        key={step}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -20 }}
        className="relative bg-white dark:bg-[#1e293b] w-full max-w-lg rounded-3xl p-8 shadow-2xl border border-white/20 z-10 overflow-hidden"
      >
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

        <button
          onClick={completeOnboarding}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className={`w-32 h-32 rounded-full flex items-center justify-center ${steps[step].color} mb-2`}
          >
            {steps[step].icon}
          </motion.div>

          <div>
            <h2 className="text-2xl font-bold dark:text-white mb-3">{steps[step].title}</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {steps[step].desc}
            </p>
          </div>

          <div className="flex items-center gap-1 mt-4">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-primary' : 'w-2 bg-gray-200 dark:bg-gray-700'}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-full bg-primary hover:bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/30 mt-4 group"
          >
            {step === steps.length - 1 ? "Boshlash!" : "Keyingisi"}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
