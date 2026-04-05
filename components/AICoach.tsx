
import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { generateHabitPlan, getMotivationalQuote, chatWithAI } from '../services/geminiService';
import { Sparkles, Loader2, Plus, MessageSquare, Target, Send, User, Bot, AlertTriangle } from 'lucide-react';
import { Category, Frequency } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = 'chat' | 'plan' | 'quote';

export const AICoach: React.FC = () => {
  const { user, addHabit } = useData();
  const [activeTab, setActiveTab] = useState<Tab>('chat');

  // Quote State
  const [quote, setQuote] = useState<string>("");
  const [loadingQuote, setLoadingQuote] = useState(false);

  // Plan State
  const [goal, setGoal] = useState("");
  const [generatedhabits, setGeneratedhabits] = useState<any[]>([]);
  const [loadingPlan, setLoadingPlan] = useState(false);

  // Chat State
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: `Salom ${user?.username || ''}! Men sizning shaxsiy rivojlanish yordamchingizman.` }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeTab]);

  const handleGetQuote = async () => {
    setLoadingQuote(true);
    try {
      const context = `Ism: ${user.username}, Daraja: ${user.level}`;
      const newQuote = await getMotivationalQuote(context);
      setQuote(newQuote);
    } catch {
      setQuote("Harakatda - barakat. Bugun albatta maqsadingizga erishasiz!");
    } finally {
      setLoadingQuote(false);
    }
  };

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) return;
    setLoadingPlan(true);
    try {
      const habits = await generateHabitPlan(goal);
      if (habits.length === 0) throw new Error("No plan");
      setGeneratedhabits(habits);
    } catch {
      // Fallback plan for offline/error
      setGeneratedhabits([
        { title: "Kuniga 15 daqiqa shug'ullanish", category: "Salomatlik", frequency: "Har kuni" },
        { title: "Kitob o'qish", category: "Shaxsiy", frequency: "Har kuni" },
        { title: "Reja tuzish", category: "Ish", frequency: "Haftalik" }
      ]);
    } finally {
      setLoadingPlan(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userMsg = inputMsg;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputMsg('');
    setLoadingChat(true);

    try {
      const history = messages.map(m => `${m.role === 'user' ? 'Foydalanuvchi' : 'AI'}: ${m.text}`);
      const aiResponse = await chatWithAI(userMsg, history);
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: "Hozircha server bilan bog'lana olmadim, lekin to'xtamang! Olg'a!" }]);
    } finally {
      setLoadingChat(false);
    }
  };

  const acceptHabit = (habit: any) => {
    addHabit({
      title: habit.title,
      category: habit.category as Category || Category.PERSONAL,
      frequency: habit.frequency as Frequency || Frequency.DAILY
    });
    setGeneratedhabits(prev => prev.filter(h => h.title !== habit.title));
  };

  return (
    <div className="bg-white dark:bg-card rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col h-[500px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Sparkles className="w-5 h-5 text-yellow-300" />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">Gemini AI</h2>
            <p className="text-xs text-indigo-100 opacity-80">Personal Coach</p>
          </div>
        </div>

        <div className="flex bg-black/20 rounded-lg p-1 backdrop-blur-sm">
          {[
            { id: 'chat', icon: MessageSquare },
            { id: 'plan', icon: Target },
            { id: 'quote', icon: Sparkles }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`p-2 rounded-md transition-all ${activeTab === item.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-indigo-100 hover:bg-white/10'}`}
            >
              <item.icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative bg-gray-50 dark:bg-[#0f172a]/50">
        <AnimatePresence mode='wait'>

          {/* CHAT TAB */}
          {activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full flex flex-col"
            >
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600' : 'bg-gray-200 dark:bg-gray-700'}`}>
                      {msg.role === 'ai' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                    </div>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white dark:bg-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-tl-none'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {loadingChat && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-700">
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-card border-t border-gray-100 dark:border-gray-800 flex gap-2">
                <input
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  placeholder="Savol bering..."
                  className="flex-1 bg-gray-100 dark:bg-gray-800 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white"
                />
                <button type="submit" disabled={loadingChat} className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50">
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </motion.div>
          )}

          {/* PLAN TAB */}
          {activeTab === 'plan' && (
            <motion.div
              key="plan"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full flex flex-col p-6 overflow-y-auto"
            >
              <div className="text-center mb-6">
                <Target className="w-12 h-12 text-indigo-500 mx-auto mb-3 bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-xl" />
                <h3 className="font-bold text-gray-900 dark:text-white">AI Reja Tuzuvchi</h3>
                <p className="text-sm text-gray-500">Maqsadingizni yozing, men sizga reja tuzib beraman.</p>
              </div>

              <form onSubmit={handleGeneratePlan} className="mb-6 relative">
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="Masalan: 1 oyda 5kg ozish"
                  className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 pl-4 pr-12 text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white shadow-sm"
                />
                <button
                  type="submit"
                  disabled={loadingPlan}
                  className="absolute right-2 top-1.5 bottom-1.5 bg-indigo-600 text-white px-3 rounded-lg text-xs font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center"
                >
                  {loadingPlan ? <Loader2 className="animate-spin w-4 h-4" /> : 'Tuzish'}
                </button>
              </form>

              <div className="space-y-3">
                {generatedhabits.map((h, idx) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={idx}
                    className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"
                  >
                    <div>
                      <p className="font-medium text-sm dark:text-gray-200">{h.title}</p>
                      <p className="text-xs text-gray-500">{h.category} • {h.frequency}</p>
                    </div>
                    <button
                      onClick={() => acceptHabit(h)}
                      className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* QUOTE TAB */}
          {activeTab === 'quote' && (
            <motion.div
              key="quote"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-orange-500/30">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <blockquote className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-6 italic leading-relaxed">
                "{quote || 'Har bir katta yutuq kichik qadamdan boshlanadi.'}"
              </blockquote>
              <button
                onClick={handleGetQuote}
                disabled={loadingQuote}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-70"
              >
                {loadingQuote ? <Loader2 className="animate-spin w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                Yangi Motivatsiya
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};
