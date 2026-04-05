import React, { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';
import { motion } from 'framer-motion';
import { Trophy, Medal, User as UserIcon, Crown, Loader2 } from 'lucide-react';

interface LeaderboardUser {
    id: string;
    username: string;
    points: number;
    level: number;
    avatarUrl?: string;
    isMe?: boolean;
}

export const LeaderboardPage: React.FC = () => {
  const { user, isMockMode } = useData();
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
        try {
            if (isMockMode) {
                // MOCK DATA
                // Simulyatsiya qilish uchun LocalStorage yoki static data
                const mockUsers = [
                    { id: '1', username: 'Azizbek', points: 2450, level: 24, avatarUrl: '' },
                    { id: '2', username: 'Malika', points: 2100, level: 21, avatarUrl: '' },
                    { id: user.id, username: user.username, points: user.points, level: user.level, avatarUrl: user.avatarUrl },
                    { id: '4', username: 'Dildora', points: 1200, level: 12, avatarUrl: '' }
                ];
                // Remove duplicates if user is in mock list
                const unique = Array.from(new Set(mockUsers.map(a => a.id)))
                    .map(id => {
                        return mockUsers.find(a => a.id === id)
                    });
                
                setUsers(unique.sort((a, b) => (b?.points || 0) - (a?.points || 0)) as LeaderboardUser[]);
            } else {
                // REAL API
                const res = await fetch('http://localhost:5000/api/leaderboard');
                if (res.ok) {
                    const data = await res.json();
                    setUsers(data);
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    
    fetchLeaderboard();
  }, [user, isMockMode]);

  const getRankIcon = (index: number) => {
    switch(index) {
      case 0: return <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500" />;
      case 1: return <Medal className="w-6 h-6 text-gray-400 fill-gray-400" />;
      case 2: return <Medal className="w-6 h-6 text-orange-400 fill-orange-400" />;
      default: return <span className="font-bold text-gray-400 w-6 text-center">{index + 1}</span>;
    }
  };

  if (loading) {
      return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold dark:text-white mb-2">Reyting Jadvali</h2>
        <p className="text-gray-500">Eng faol foydalanuvchilar bilan bellashing</p>
      </div>

      <div className="bg-white dark:bg-card rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-sm font-medium text-gray-500">
          <div className="col-span-2 text-center">O'rin</div>
          <div className="col-span-6">Foydalanuvchi</div>
          <div className="col-span-2 text-center">Level</div>
          <div className="col-span-2 text-right">XP</div>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {users.map((u, index) => {
            const isMe = u.id === user.id;
            return (
            <motion.div 
              key={u.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors
                ${isMe ? 'bg-primary/5 dark:bg-primary/10 border-l-4 border-primary' : ''}`}
            >
              <div className="col-span-2 flex justify-center">
                {getRankIcon(index)}
              </div>
              <div className="col-span-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center border border-gray-200 dark:border-gray-600">
                   {u.avatarUrl ? <img src={u.avatarUrl} className="w-full h-full object-cover" /> : <UserIcon className="w-5 h-5 text-gray-500" />}
                </div>
                <div className="min-w-0">
                  <p className={`font-bold truncate ${isMe ? 'text-primary' : 'dark:text-white'}`}>
                    {u.username} {isMe && '(Siz)'}
                  </p>
                </div>
              </div>
              <div className="col-span-2 text-center">
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-bold text-gray-600 dark:text-gray-300">
                  LVL {u.level}
                </span>
              </div>
              <div className="col-span-2 text-right font-bold text-primary">
                {u.points}
              </div>
            </motion.div>
          )})}
        </div>
      </div>
    </div>
  );
};
