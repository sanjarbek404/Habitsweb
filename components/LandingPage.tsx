
import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, Zap, Shield, ArrowRight, Activity, Star, Smartphone,
  Layout, Brain, Repeat, Award, Users, Globe, ChevronDown, Trophy,
  Menu, X, Moon, Sun, Quote, Play, Heart, Code
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

// --- CONFIG ---
// Profil rasmi: public/creator.jpg fayliga murojaat qiladi
const PROFILE_IMAGE = "/creator.jpg";
const CONTACT_LINK = "https://t.me/sizning_username";

// --- 3D Hero Card Component ---
const HeroCard = () => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const rotateX = useTransform(y, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-10, 10]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative w-full max-w-[550px] aspect-video bg-gradient-to-br from-[#1e1b4b] to-[#4c1d95] dark:from-indigo-900/90 dark:to-purple-900/90 rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl mx-auto hidden md:block"
    >
      <div style={{ transform: "translateZ(40px)" }} className="absolute inset-4 bg-white/5 rounded-2xl border border-white/5 p-6 flex flex-col justify-between">
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white shadow-lg">S</div>
            <div>
              <div className="text-sm font-bold text-white">Sanjarbek</div>
              <div className="text-xs text-gray-300">Level 5 • 2450 XP</div>
            </div>
          </div>
          <div className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30 flex items-center gap-1 animate-pulse">
            <Zap size={12} /> 14 Kun Streak
          </div>
        </div>
        <div className="space-y-3 py-2">
          {[{ t: "Ertalabki yugurish", c: "Salomatlik", s: 5 }, { t: "30 daqiqa kitob", c: "Shaxsiy", s: 12 }, { t: "Kod yozish", c: "Ish", s: 45 }].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + (i * 0.1) }}
              className="flex items-center gap-3 bg-black/20 p-2.5 rounded-xl border border-white/5 hover:bg-white/5 transition-colors"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${i === 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                <CheckCircle size={16} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">{item.t}</div>
                <div className="text-[10px] text-gray-400">{item.c}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// --- Accordion Component ---
const AccordionItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 dark:border-white/10 last:border-none">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full py-4 flex items-center justify-between text-left hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
        <span className="font-semibold text-gray-900 dark:text-white text-lg">{question}</span>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <motion.div initial={false} animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }} className="overflow-hidden">
        <p className="pb-4 text-gray-600 dark:text-gray-400 leading-relaxed">{answer}</p>
      </motion.div>
    </div>
  );
};

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const navLinks = [
    { id: 'how-it-works', label: 'Qanday ishlaydi?' },
    { id: 'features', label: 'Imkoniyatlar' },
    { id: 'faq', label: 'FAQ' },
    { id: 'creator', label: 'Muallif' },
  ];

  return (
    <div className={`min-h-screen font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-500 ${isDark ? 'bg-[#0f172a] text-white' : 'bg-gray-50 text-gray-900'}`}>

      {/* Background Gradients & Particles */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse dark:bg-indigo-600/20 bg-indigo-300/30"></div>
        <div className="absolute bottom-[-10%] right-[20%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] dark:bg-purple-600/10 bg-purple-300/30"></div>
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/5 rounded-full w-2 h-2"
            initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
            animate={{ y: [0, -20, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          />
        ))}
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${isScrolled ? 'bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border-gray-200 dark:border-white/5 shadow-lg h-16' : 'bg-transparent border-transparent h-20'}`}>
        <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <CheckCircle className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">habits.uz</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-white transition-colors"
              >
                {link.label}
              </button>
            ))}

            <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={onGetStarted}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-sm font-bold transition-all hover:scale-105 shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)]"
            >
              Kirish
            </button>
          </div>

          <div className="flex items-center gap-4 md:hidden">
            <button onClick={() => setIsDark(!isDark)} className="p-2">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={() => setMobileMenuOpen(true)} className="p-2">
              <Menu className="w-7 h-7" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-[60] bg-white dark:bg-[#0f172a] p-6 flex flex-col"
          >
            <div className="flex justify-between items-center mb-10">
              <span className="text-2xl font-bold">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10">
                <X className="w-7 h-7" />
              </button>
            </div>
            <div className="flex flex-col gap-6 text-lg font-medium">
              {navLinks.map(link => (
                <button key={link.id} onClick={() => scrollToSection(link.id)} className="text-left py-2 border-b border-gray-100 dark:border-gray-800">
                  {link.label}
                </button>
              ))}
              <button onClick={() => { setMobileMenuOpen(false); onGetStarted(); }} className="mt-4 bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg">
                Boshlash
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 lg:pt-48 lg:pb-32 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-white/5 border border-indigo-100 dark:border-white/10 text-indigo-600 dark:text-indigo-300 text-xs font-semibold mb-8 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            v2.1 Yangilanish: Chat AI
          </div>

          <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] mb-6 tracking-tight">
            Odatlaringizni <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x">
              raqamlashtiring
            </span>
          </h1>

          <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Maqsadingiz sari intiling. Sun'iy intellekt yordamida reja tuzing, do'stlar bilan bellashing va har kuni rivojlaning.
          </p>

          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2 transform hover:-translate-y-1 transition-all"
            >
              Bepul Boshlash <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={() => scrollToSection('how-it-works')} className="px-8 py-4 bg-transparent border border-gray-300 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2">
              <Play className="w-4 h-4" /> Video
            </button>
          </div>

          <div className="mt-10 flex items-center justify-center lg:justify-start gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white dark:border-[#0f172a] overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
                </div>
              ))}
            </div>
            <p>10+ faol foydalanuvchilar</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotateY: 30 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="relative perspective-1000"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/20 rounded-full blur-[80px] -z-10"></div>
          <HeroCard />
        </motion.div>
      </section>

      {/* Stats Section with Reveal */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="py-12 border-y border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-black/20 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: "1k+", label: "Foydalanuvchilar" },
            { num: "10+", label: "Bajarilgan Odatlar" },
            { num: "92%", label: "Muvaffaqiyat" },
         
          ].map((stat, i) => (
            <div key={i} className="space-y-1 group hover:scale-105 transition-transform duration-300 cursor-default">
              <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 group-hover:from-purple-500 group-hover:to-pink-500 transition-all">{stat.num}</div>
              <div className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* How it Works with Stagger */}
      <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-indigo-500 font-bold tracking-wider uppercase text-sm">Jarayon</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4 text-gray-900 dark:text-white">Qanday ishlaydi?</h2>
          <p className="text-gray-500 dark:text-gray-400">Bizning metodikamiz "Atomic habits" kitobiga asoslangan. Kichik o'zgarishlar, katta natijalar.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-200 dark:via-indigo-500/30 to-transparent"></div>

          {[
            { step: "01", title: "Maqsad Qo'ying", desc: "Shaxsiy yoki sun'iy intellekt yordamida rivojlanish rejasini tuzing.", icon: Layout, color: "bg-blue-500" },
            { step: "02", title: "Bajarib Boring", desc: "Har kuni kichik vazifalarni bajaring va 'Streak' zanjirini buzmang.", icon: Activity, color: "bg-indigo-500" },
            { step: "03", title: "Mukofot Oling", desc: "Yutuqlarga erishing, darajangizni oshiring va do'stlar bilan bellashing.", icon: Trophy, color: "bg-purple-500" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              whileHover={{ y: -10 }}
              className="relative bg-white dark:bg-[#1e293b]/50 p-8 rounded-3xl border border-gray-100 dark:border-white/10 shadow-xl dark:shadow-none text-center group"
            >
              <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/20 text-white relative z-10 group-hover:scale-110 transition-transform`}>
                <item.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{item.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Creator Section (Embedded) */}
      <section id="creator" className="py-24 bg-white dark:bg-[#0f172a] border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold">
                <Code className="w-4 h-4" /> Creator
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Loyiha Muallifi</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                "habits.uz" - bu mening shaxsiy rivojlanishim va zamonaviy texnologiyalarga bo'lgan qiziqishim mahsuli. Maqsadim - insonlarga o'z salohiyatlarini kashf etishda yordam berish.
              </p>
              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-4">
                  <img src={PROFILE_IMAGE} className="w-16 h-16 rounded-full border-4 border-white dark:border-[#0f172a] object-cover" alt="Sanjarbek" />
                </div>
                <div>
                  <div className="font-bold text-lg dark:text-white">Sanjarbek</div>
                  <div className="text-sm text-gray-500">Full Stack Developer</div>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 relative">
              <Quote className="absolute top-6 right-6 text-gray-200 dark:text-gray-700 w-12 h-12" />
              <p className="text-xl font-medium text-gray-800 dark:text-gray-200 italic mb-6">
                "Eng yaxshi investitsiya - bu o'zingizga kiritilgan investitsiyadir."
              </p>
              <a href={CONTACT_LINK} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-2 hover:gap-3 transition-all cursor-pointer">
                Men bilan bog'lanish <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-gray-50 dark:bg-black/20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Ko'p so'raladigan savollar</h2>
          </div>
          <div className="space-y-2">
            <AccordionItem question="habits.uz bepulmi?" answer="Ha, asosiy funksiyalar mutlaqo bepul." />
            <AccordionItem question="Internet bo'lmasa ishlaydimi?" answer="Ha, PWA texnologiyasi orqali oflayn rejimda ham ishlashingiz mumkin." />
            <AccordionItem question="AI qanday ishlaydi?" answer="Biz Gemini AI texnologiyasidan foydalanamiz. U sizning maqsadingizni tahlil qilib, shunga mos reja tuzib beradi." />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">Bugun o'zgarish vaqti keldi!</h2>
          <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto relative z-10">
            Minglab insonlar qatoriga qo'shiling va o'z hayotingizni yaxshi tomonga o'zgartiring.
          </p>
          <button
            onClick={onGetStarted}
            className="bg-white text-indigo-700 hover:bg-gray-100 px-10 py-4 rounded-full font-bold text-lg shadow-xl transition-all hover:scale-105 relative z-10"
          >
            Hoziroq Boshlash
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-200 dark:border-white/5 bg-white dark:bg-[#0f172a]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="text-indigo-600 dark:text-indigo-400 w-6 h-6" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">habits.uz</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm">
              Sizning shaxsiy rivojlanish hamkoringiz.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-gray-900 dark:text-white">Platforma</h4>
            <ul className="space-y-2 text-gray-500 dark:text-gray-400 text-sm">
              <li><button onClick={() => scrollToSection('features')} className="hover:text-indigo-500">Imkoniyatlar</button></li>
              <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-indigo-500">Jarayon</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-gray-900 dark:text-white">Yordam</h4>
            <ul className="space-y-2 text-gray-500 dark:text-gray-400 text-sm">
              <li><button onClick={() => scrollToSection('faq')} className="hover:text-indigo-500">FAQ</button></li>
              <li><a href="#" className="hover:text-indigo-500">Bog'lanish</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-gray-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>&copy; 2024 habits.uz. Made with <Heart className="inline w-3 h-3 text-red-500" /> by Sanjarbek.</p>
          <div className="flex gap-4">
            <Globe className="w-5 h-5 cursor-pointer hover:text-indigo-500" />
          </div>
        </div>
      </footer>
    </div>
  );
};
