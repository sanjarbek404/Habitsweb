
import React, { useState } from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Target,
  Trophy,
  Settings,
  Menu,
  X,
  Moon,
  Sun,
  LogOut,
  User as UserIcon,
  Timer,
  Info,
  MessageCircle
} from 'lucide-react';
import { useData } from '../context/DataContext';

export type ViewType = 'dashboard' | 'tasks' | 'habits' | 'leaderboard' | 'timer' | 'settings' | 'creator' | 'chat';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewType;
  onChangeView: (view: ViewType) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onChangeView }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { user, logout } = useData();

  const toggleDark = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const navItems: { id: ViewType; icon: React.ReactNode; label: string }[] = [
    { id: 'dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
    { id: 'tasks', icon: <CheckSquare className="w-5 h-5" />, label: 'Vazifalar' },
    { id: 'habits', icon: <Target className="w-5 h-5" />, label: 'Odatlar' },
    { id: 'chat', icon: <MessageCircle className="w-5 h-5" />, label: 'Maqsadlar Chati' },
    { id: 'timer', icon: <Timer className="w-5 h-5" />, label: 'Fokus Taymer' },
    { id: 'leaderboard', icon: <Trophy className="w-5 h-5" />, label: 'Leaderboard' },
    { id: 'creator', icon: <Info className="w-5 h-5" />, label: 'Muallif' },
  ];

  if (!user) return <>{children}</>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark flex transition-colors duration-200 font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 z-30 h-screen w-72 bg-white dark:bg-card border-r border-gray-100 dark:border-gray-800 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col shadow-2xl lg:shadow-none`}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onChangeView('dashboard')}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/30">
              <CheckSquare className="text-white w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              habits.uz
            </h1>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500 hover:bg-gray-100 rounded-lg p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User Card Mini */}
        <div className="px-6 mb-6">
          <div className="p-4 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-2xl border border-primary/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-primary text-white flex items-center justify-center font-bold text-lg border-2 border-white dark:border-gray-700 shadow-md">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user.username?.[0]
              )}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{user.username}</p>
              <p className="text-xs text-primary font-medium truncate">Level {user.level}</p>
            </div>
          </div>
        </div>

        <nav className="px-4 space-y-1.5 flex-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onChangeView(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/25 translate-x-1'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'}`}
              >
                {item.icon}
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
          <button
            onClick={() => {
              onChangeView('settings');
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
               ${currentView === 'settings'
                ? 'bg-gray-100 dark:bg-gray-800 text-primary'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
          >
            <Settings className="w-5 h-5" /> Sozlamalar
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
          >
            <LogOut className="w-5 h-5" /> Chiqish
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-auto bg-gray-50/50 dark:bg-[#0f172a]">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-dark/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-semibold dark:text-white capitalize hidden sm:block">
              {currentView === 'timer' ? 'Fokus Taymer' : currentView === 'creator' ? 'Muallif' : currentView === 'chat' ? 'Maqsadlar Chati' : currentView}
            </h2>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <button
              onClick={toggleDark}
              className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors border border-gray-200 dark:border-gray-700"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-gray-900 dark:text-white">{user.username}</div>
                <div className="text-xs text-gray-500">{user.jobTitle || 'Foydalanuvchi'}</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden cursor-pointer hover:ring-2 ring-primary transition-all" onClick={() => onChangeView('settings')}>
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Me" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <UserIcon className="w-5 h-5" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
