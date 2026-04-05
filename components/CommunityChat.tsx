
import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';
import { Message } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User as UserIcon, Loader2, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';

export const CommunityChat: React.FC = () => {
  const { user, fetchMessages, sendMessage } = useData();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    const msgs = await fetchMessages();
    // Faqat yangi xabarlar bo'lsa yangilash (oddiy tekshiruv)
    setMessages(prev => {
        if (prev.length === 0 && msgs.length > 0) return msgs;
        if (msgs.length > 0 && msgs[msgs.length - 1].id !== prev[prev.length - 1]?.id) return msgs;
        return prev.length === 0 ? msgs : prev; // Dastlabki yuklash
    });
    setLoading(false);
  };

  useEffect(() => {
    loadMessages();
    // Real-time simulatsiyasi: har 3 soniyada xabarlarni yangilash
    intervalRef.current = window.setInterval(loadMessages, 3000);
    return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    setSending(true);
    try {
        const newMessage = await sendMessage(inputText);
        setMessages(prev => [...prev, newMessage]);
        setInputText('');
    } catch (e) {
        console.error(e);
    } finally {
        setSending(false);
    }
  };

  // Agar rasm bo'lmasa, ism bosh harflaridan chiroyli rasm yasash
  const getAvatarUrl = (msg: Message) => {
    if (msg.userAvatar && msg.userAvatar.length > 10) return msg.userAvatar;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.username)}&background=random&color=fff&size=128&bold=true`;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white dark:bg-card rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden relative">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-card/80 backdrop-blur-md sticky top-0 z-10 flex justify-between items-center">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
             <MessageCircle className="w-5 h-5" />
           </div>
           <div>
             <h2 className="font-bold text-lg dark:text-white">Maqsadlar Chati</h2>
             <p className="text-xs text-green-500 flex items-center gap-1">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
               Online hamjamiyat
             </p>
           </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-[#0f172a]/50">
        {loading && messages.length === 0 ? (
           <div className="flex justify-center items-center h-full">
             <Loader2 className="w-8 h-8 animate-spin text-primary" />
           </div>
        ) : (
           messages.map((msg, index) => {
             const isMe = msg.userId === user?.id;
             const isConsecutive = index > 0 && messages[index - 1].userId === msg.userId;
             const avatarUrl = getAvatarUrl(msg);

             return (
               <motion.div 
                 key={msg.id}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'} ${isConsecutive ? 'mt-1' : 'mt-4'}`}
               >
                 {!isConsecutive ? (
                    <div className="flex-shrink-0 self-end mb-1">
                      <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden border-2 border-white dark:border-gray-600 shadow-sm hover:scale-110 transition-transform cursor-pointer" title={msg.username}>
                         <img 
                           src={avatarUrl} 
                           alt={msg.username} 
                           className="w-full h-full object-cover" 
                           onError={(e) => {
                             // Fallback agar rasm yuklanmasa
                             (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.username)}&background=ccc&color=fff`;
                           }}
                         />
                      </div>
                    </div>
                 ) : (
                    <div className="w-9 flex-shrink-0" />
                 )}

                 <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                   {!isConsecutive && !isMe && (
                     <span className="text-[11px] font-bold text-gray-500 ml-1 mb-1 flex items-center gap-1.5">
                        {msg.username} 
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${msg.userLevel >= 10 ? 'bg-yellow-100 text-yellow-700' : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'}`}>
                            Lvl {msg.userLevel}
                        </span>
                     </span>
                   )}
                   <div 
                     className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm relative group
                       ${isMe 
                         ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-br-none' 
                         : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-bl-none'}`}
                   >
                     {msg.text}
                     <span className={`text-[9px] absolute bottom-1 ${isMe ? 'right-2 text-indigo-200' : 'right-2 text-gray-400'} opacity-0 group-hover:opacity-100 transition-opacity`}>
                       {format(new Date(msg.createdAt), 'HH:mm')}
                     </span>
                   </div>
                 </div>
               </motion.div>
             );
           })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-card border-t border-gray-100 dark:border-gray-800">
        <form onSubmit={handleSend} className="flex items-center gap-3">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Xabar yozing..."
            className="flex-1 bg-gray-100 dark:bg-gray-800/50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary dark:text-white transition-all outline-none"
          />
          <button 
            type="submit" 
            disabled={!inputText.trim() || sending}
            className="p-3 bg-primary hover:bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:shadow-none transition-all"
          >
            {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
};
