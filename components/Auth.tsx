
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

interface AuthProps {
  onSuccess: () => void;
  initialView?: 'login' | 'register';
}

export const Auth: React.FC<AuthProps> = ({ onSuccess, initialView = 'login' }) => {
  const [view, setView] = useState<'login' | 'register'>(initialView);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  
  const { login, register } = useData();
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLocalLoading(true);
    
    try {
      if (view === 'login') {
        await login(email, password);
      } else {
        if (!username || !email || !password) {
          throw new Error("Barcha maydonlarni to'ldiring");
        }
        await register(username, email, password);
      }
      onSuccess();
    } catch (err: any) {
      // Konsolga to'liq xatoni chiqarmaymiz
      console.error("Auth Failed:", err.message);
      
      let msg = err.message || "Xatolik yuz berdi.";
      
      // Email band bo'lsa aniq xabar
      if (msg.includes("email allaqachon ro'yxatdan o'tgan") || msg.includes("already registered")) {
        msg = "Bu email allaqachon mavjud. Iltimos, tizimga kiring.";
      }
      
      setError(msg);
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 relative overflow-hidden">
      {/* Dynamic BG */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-8 z-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            {view === 'login' ? 'Xush kelibsiz!' : 'Profil yaratish'}
          </h2>
          <p className="text-gray-400 text-sm">
            {view === 'login' 
              ? 'Davom etish uchun tizimga kiring' 
              : 'Odatlaringizni bugundan boshlang'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {view === 'register' && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Ismingiz"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-12 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              placeholder="Email manzilingiz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-12 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              placeholder="Parol"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-12 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
              required
            />
          </div>

          {error && (
            <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                 <span className="text-red-200 text-sm font-medium">{error}</span>
                 {error.includes("allaqachon mavjud") && view === 'register' && (
                     <button 
                       type="button" 
                       onClick={() => { setView('login'); setError(''); }}
                       className="text-xs text-white underline text-left hover:text-indigo-300"
                     >
                       Tizimga kirish
                     </button>
                 )}
              </div>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={localLoading}
            className="w-full bg-white hover:bg-gray-100 text-gray-900 font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {localLoading ? <Loader2 className="animate-spin w-5 h-5" /> : (
              <>
                {view === 'login' ? 'Kirish' : 'Ro\'yxatdan o\'tish'}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            {view === 'login' ? 'Hisobingiz yo\'qmi?' : 'Allaqachon hisobingiz bormi?'}
            <button 
              onClick={() => {
                setView(view === 'login' ? 'register' : 'login');
                setError('');
              }}
              className="ml-2 text-white hover:text-indigo-300 font-semibold underline decoration-transparent hover:decoration-indigo-300 transition-all"
            >
              {view === 'login' ? 'Ro\'yxatdan o\'tish' : 'Kirish'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
