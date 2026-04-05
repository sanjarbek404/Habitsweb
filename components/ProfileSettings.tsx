import React, { useState, useRef } from 'react';
import { useData } from '../context/DataContext';
import { motion } from 'framer-motion';
import { Camera, Save, User, Mail, Briefcase, FileText, Loader2 } from 'lucide-react';

export const ProfileSettings: React.FC = () => {
  const { user, updateUserProfile } = useData();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    jobTitle: user?.jobTitle || '',
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Base64 stringni saqlaymiz
        updateUserProfile({ avatarUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulyatsiya (API request)
    setTimeout(() => {
      updateUserProfile(formData);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-card rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800"
      >
        <h2 className="text-2xl font-bold dark:text-white mb-6">Profil Sozlamalari</h2>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4 w-full md:w-auto">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-xl bg-gray-100 dark:bg-gray-800">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400">
                    {user?.username?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleImageUpload}
            />
            <p className="text-xs text-gray-500 text-center max-w-[150px]">
              Rasm o'zgartirish uchun ustiga bosing (Max: 2MB)
            </p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="flex-1 w-full space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <User className="w-4 h-4" /> Foydalanuvchi nomi
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email Manzil
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" /> Kasbingiz
                </label>
                <input
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                  placeholder="Masalan: Dasturchi"
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <FileText className="w-4 h-4" /> O'zingiz haqingizda (Bio)
              </label>
              <textarea
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                placeholder="Qisqacha ma'lumot..."
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white resize-none"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-primary hover:bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                Saqlash
              </button>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Account Stats Preview */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-xl text-white shadow-lg">
          <div className="text-white/80 text-sm mb-1">Umumiy Ballar</div>
          <div className="text-3xl font-bold">{user?.points} XP</div>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-xl text-white shadow-lg">
          <div className="text-white/80 text-sm mb-1">Joriy Streak</div>
          <div className="text-3xl font-bold">{user?.streak} Kun</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-xl text-white shadow-lg">
          <div className="text-white/80 text-sm mb-1">Daraja</div>
          <div className="text-3xl font-bold">{user?.level} - Level</div>
        </div>
      </motion.div>
    </div>
  );
};
