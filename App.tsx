
import React, { useState } from 'react';
import { DataProvider, useData } from './context/DataContext';
import { Layout, ViewType } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { LandingPage } from './components/LandingPage';
import { Auth } from './components/Auth';
import { ProfileSettings } from './components/ProfileSettings';
import { TasksPage } from './components/TasksPage';
import { HabitsPage } from './components/HabitsPage';
import { LeaderboardPage } from './components/LeaderboardPage';
import { FocusTimer } from './components/FocusTimer';
import { CreatorProfile } from './components/CreatorProfile';
import { CommunityChat } from './components/CommunityChat';
import { GlobalLoader } from './components/GlobalLoader';
import { AnimatePresence } from 'framer-motion';

const AppContent: React.FC = () => {
  const { isAuthenticated, loading } = useData();
  const [showAuth, setShowAuth] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  return (
    <>
      <AnimatePresence>
        {loading && <GlobalLoader />}
      </AnimatePresence>

      {!loading && (
        <>
          {isAuthenticated ? (
            <Layout currentView={currentView} onChangeView={setCurrentView}>
              {currentView === 'dashboard' && <Dashboard />}
              {currentView === 'tasks' && <TasksPage />}
              {currentView === 'habits' && <HabitsPage />}
              {currentView === 'leaderboard' && <LeaderboardPage />}
              {currentView === 'settings' && <ProfileSettings />}
              {currentView === 'timer' && <FocusTimer />}
              {currentView === 'creator' && <CreatorProfile />}
              {currentView === 'chat' && <CommunityChat />}
            </Layout>
          ) : (
            showAuth ? (
              <Auth
                onSuccess={() => setShowAuth(false)}
                initialView={authView}
              />
            ) : (
              <LandingPage
                onGetStarted={() => {
                  setAuthView('register');
                  setShowAuth(true);
                }}
              />
            )
          )}
        </>
      )}
    </>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
};

export default App;
