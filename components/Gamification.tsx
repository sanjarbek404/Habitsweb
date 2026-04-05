
import React from 'react';
import { useData } from '../context/DataContext';
import { Trophy, Star, Award, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export const LevelCard: React.FC = () => {
  const { user } = useData();
  const progress = Math.min(100, (user.points % 100)); // Fix overflow

  return (
    <div className="bg-gradient-to-r from-primary to-indigo-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold opacity-90">Joriy Daraja</h3>
          <div className="text-4xl font-bold mt-1 flex items-center gap-2">
            {user.level}
            <span className="text-sm font-normal bg-white/20 px-2 py-0.5 rounded-full">
              {user.points} XP
            </span>
          </div>
        </div>
        <div className="p-2 bg-white/20 rounded-lg">
          <Trophy className="w-6 h-6 text-yellow-300" />
        </div>
      </div>

      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div className="text-xs font-semibold inline-block uppercase opacity-80">
            Keyingi daraja
          </div>
          <div className="text-xs font-semibold inline-block">
            {progress}%
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-white/20">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1 }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-400" 
          />
        </div>
      </div>
    </div>
  );
};

export const BadgesList: React.FC = () => {
  const { user } = useData();
  
  const allBadges = [
    { id: 'first_step', name: 'Birinchi Qadam', description: 'Birinchi odatni yaratish', icon: <Star className="w-5 h-5" />, color: 'bg-blue-100 text-blue-600' },
    { id: 'week_warrior', name: 'Hafta Qahramoni', description: '7 kunlik streak', icon: <Zap className="w-5 h-5" />, color: 'bg-yellow-100 text-yellow-600' },
    { id: 'points_master', name: 'Ballar Ustasi', description: '500 ball to\'plash', icon: <Award className="w-5 h-5" />, color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <div className="bg-white dark:bg-card rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
      <h3 className="text-lg font-bold mb-4 dark:text-white">Yutuqlarim</h3>
      <div className="grid grid-cols-1 gap-3">
        {allBadges.map((badge) => {
          const isUnlocked = user.badges.includes(badge.id);
          return (
            <div key={badge.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${isUnlocked ? 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700' : 'bg-gray-50 dark:bg-gray-800/50 border-transparent opacity-60'}`}>
              <div className={`p-2.5 rounded-full ${isUnlocked ? badge.color : 'bg-gray-200 text-gray-400'}`}>
                {badge.icon}
              </div>
              <div>
                <h4 className={`text-sm font-bold ${isUnlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>{badge.name}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{badge.description}</p>
              </div>
              {isUnlocked && <Check className="ml-auto w-4 h-4 text-emerald-500" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

import { Check } from 'lucide-react';
