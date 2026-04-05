
import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Globe, MapPin, Code, Coffee, Heart } from 'lucide-react';

export const CreatorProfile: React.FC = () => {
  // --- SOZLAMALAR ---
  // Rasm "public" papkasida "creator.jpg" nomi bilan bo'lishi kerak
  const PROFILE_IMAGE = "/creator.jpg";

  // 2. Bog'lanish havolasini shu yerga yozing (masalan: Telegram, Email yoki Portfolio)
  const CONTACT_LINK = "https://t.me/syphervoid";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto py-10"
    >
      <div className="bg-white dark:bg-card rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800">
        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>

        <div className="px-8 pb-8 relative">
          {/* Avatar */}
          <div className="absolute -top-16 left-8 p-1.5 bg-white dark:bg-card rounded-full">
            <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden border-4 border-white dark:border-card shadow-lg">
              <img src={PROFILE_IMAGE} alt="Creator" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-4 mb-12 sm:mb-4">
            <a href="https://github.com/OtabekovsProject" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300">
              <Github className="w-5 h-5" />
            </a>
            <a href="www.linkedin.com/in/sanjarbek-otabekov-6b27a8394" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors text-blue-600 dark:text-blue-400">
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href={CONTACT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2"
            >
              <Mail className="w-4 h-4" /> Bog'lanish
            </a>
          </div>

          {/* Content */}
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Sanjarbek
              <span className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs rounded-full font-medium shadow-md">Creator</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium mt-1 flex items-center gap-2">
              <Code className="w-4 h-4" /> Full Stack Developer
            </p>

            <div className="flex items-center gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-6">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-gray-400" /> Toshkent, O'zbekiston</span>
              <span className="flex items-center gap-1"><Globe className="w-4 h-4 text-gray-400" /> habits.uz</span>
            </div>

            <div className="mt-8 grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Men haqimda</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Salom! Men Sanjarbek, veb dasturlash va UI/UX dizaynga qiziqaman.
                  Ushbu loyiha ("habits.uz") insonlarga o'z maqsadlariga erishishda yordam berish va zamonaviy texnologiyalar
                  (React,  Gamification) kuchini ko'rsatish maqsadida yaratildi.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Texnologiyalar</h3>
                <div className="flex flex-wrap gap-2">
                  {['React', 'TypeScript', 'Node.js', 'MongoDB', 'Tailwind',  'Framer Motion'].map(tag => (
                    <span key={tag} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-medium">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border border-yellow-100 dark:border-yellow-900/20 flex items-start gap-3">
                  <Coffee className="w-5 h-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Loyihani qo'llab-quvvatlash uchun bir finjon kofe olib berishingiz mumkin! :)
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 text-center text-sm text-gray-400 flex items-center justify-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> in Uzbekistan
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
