import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar, { type PageName } from './components/Sidebar';
import ChatArea from './components/ChatArea';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import { useChat } from './hooks/useChat';
import { supabase } from './lib/supabase';
import type { User } from '@supabase/supabase-js';

const PAGE_BG = 'https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=1600';

type AppScreen = 'landing' | 'auth' | 'app';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState<PageName>('chat');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setUser(data.session.user);
        setScreen('app');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user && screen === 'app') {
        setScreen('landing');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const {
    conversations,
    activeConversationId,
    messages,
    isLoading,
    error,
    loadConversation,
    startNewChat,
    sendQuery,
    regenerateLastAnswer,
    removeConversation,
  } = useChat();

  const activeConv = conversations.find((c) => c.id === activeConversationId);

  const handleOpenFromHistory = (id: string) => {
    loadConversation(id);
    setActivePage('chat');
  };

  const handleNavigate = (page: PageName) => {
    setActivePage(page);
    if (page !== 'chat') setSidebarOpen(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setScreen('landing');
  };

  if (screen === 'landing') {
    return (
      <div
        className="min-h-screen w-full relative"
        style={{
          backgroundImage: `url(${PAGE_BG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-slate-900/60 pointer-events-none" />
        <div className="relative z-10">
          <LandingPage onGetStarted={() => setScreen('auth')} />
        </div>
      </div>
    );
  }

  if (screen === 'auth') {
    return (
      <div
        className="min-h-screen w-full relative"
        style={{
          backgroundImage: `url(${PAGE_BG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <AuthPage
          onAuth={() => setScreen('app')}
          onBack={() => setScreen('landing')}
        />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-screen overflow-hidden relative"
      style={{
        backgroundImage: `url(${PAGE_BG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-slate-900/50 pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full">
        <Navbar
          activePage={activePage}
          onNavigate={handleNavigate}
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
          sidebarOpen={sidebarOpen}
          conversationCount={conversations.length}
          activeTitle={activeConv ? activeConv.title : 'New Research Session'}
          disease={activeConv?.disease}
          user={user}
          onSignOut={handleSignOut}
        />

        <div className="flex flex-1 min-h-0 overflow-hidden">
          <Sidebar
            conversations={conversations}
            activeId={activeConversationId}
            activePage={activePage}
            onSelect={loadConversation}
            onNew={startNewChat}
            onDelete={removeConversation}
            onNavigate={handleNavigate}
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen((v) => !v)}
          />

          <main className="flex-1 min-w-0 overflow-hidden bg-white/80 backdrop-blur-md">
            {activePage === 'chat' && (
              <ChatArea
                messages={messages}
                isLoading={isLoading}
                error={error}
                onSubmit={sendQuery}
                onRegenerate={regenerateLastAnswer}
              />
            )}
            {activePage === 'history' && (
              <HistoryPage
                conversations={conversations}
                onOpen={handleOpenFromHistory}
                onDelete={removeConversation}
              />
            )}
            {activePage === 'profile' && (
              <ProfilePage
                conversations={conversations}
                onNavigateToChat={() => setActivePage('chat')}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
