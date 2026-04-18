import { useState, useEffect } from 'react';
import { Activity, MessageSquare, History, User, Menu, X, ChevronDown, Database, FlaskConical, BookOpen, Bell, LogOut } from 'lucide-react';
import type { PageName } from './Sidebar';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface Props {
  activePage: PageName;
  onNavigate: (page: PageName) => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
  conversationCount: number;
  activeTitle: string;
  disease?: string;
  user?: SupabaseUser | null;
  onSignOut?: () => void;
}

const NAV_ITEMS: { id: PageName; icon: typeof MessageSquare; label: string; desc: string }[] = [
  { id: 'chat', icon: MessageSquare, label: 'Research', desc: 'AI chat interface' },
  { id: 'history', icon: History, label: 'History', desc: 'Past sessions' },
  { id: 'profile', icon: User, label: 'Profile', desc: 'Your settings' },
];

const SOURCES = [
  { icon: Database, label: 'PubMed', color: 'text-cyan-500' },
  { icon: BookOpen, label: 'OpenAlex', color: 'text-teal-500' },
  { icon: FlaskConical, label: 'ClinicalTrials', color: 'text-emerald-500' },
];

export default function Navbar({ activePage, onNavigate, onToggleSidebar, sidebarOpen, conversationCount, activeTitle, disease, user, onSignOut }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);

  useEffect(() => {
    const el = document.getElementById('main-scroll');
    const onScroll = () => setScrolled((el?.scrollTop ?? 0) > 10);
    el?.addEventListener('scroll', onScroll);
    return () => el?.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [activePage]);

  const handleNav = (page: PageName) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`flex-shrink-0 z-30 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-md shadow-slate-200/60'
          : 'bg-white/80 backdrop-blur-sm'
      } border-b border-slate-200/80`}
    >
      <div className="flex items-center h-16 px-4 lg:px-6 gap-4">

        <div className="flex items-center gap-3 flex-shrink-0">
          {activePage === 'chat' && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          )}
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => handleNav('chat')}>
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 via-cyan-600 to-teal-700 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-500/50 transition-shadow">
                <Activity className="w-4.5 h-4.5 text-white" style={{ width: '18px', height: '18px' }} />
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-slate-800 text-sm leading-none block">MedResearch AI</span>
              <span className="text-[10px] text-slate-400 leading-none">Intelligent Research</span>
            </div>
          </div>
        </div>

        <nav className="hidden md:flex items-center bg-slate-100/80 rounded-2xl p-1 gap-0.5 mx-auto">
          {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => handleNav(id)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activePage === id
                  ? 'bg-white text-slate-800 shadow-sm shadow-slate-200'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-white/60'
              }`}
            >
              <Icon className={`w-4 h-4 transition-colors ${activePage === id ? 'text-cyan-600' : ''}`} />
              <span>{label}</span>
              {id === 'history' && conversationCount > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none transition-colors ${
                  activePage === id ? 'bg-cyan-100 text-cyan-700' : 'bg-slate-200 text-slate-600'
                }`}>
                  {conversationCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 flex-shrink-0">
          <div className="hidden lg:flex items-center">
            <div className="relative">
              <button
                onClick={() => setSourcesOpen(!sourcesOpen)}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl transition-all"
              >
                <span className="flex gap-1">
                  {SOURCES.map(({ icon: Icon, color }) => (
                    <Icon key={color} className={`w-3 h-3 ${color}`} />
                  ))}
                </span>
                <span className="font-medium">3 Sources</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${sourcesOpen ? 'rotate-180' : ''}`} />
              </button>
              {sourcesOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setSourcesOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/60 z-20 overflow-hidden">
                    <div className="p-2">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide px-2 py-1">Data Sources</p>
                      {SOURCES.map(({ icon: Icon, label, color }) => (
                        <div key={label} className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-slate-50 transition-colors">
                          <div className={`w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100`}>
                            <Icon className={`w-3.5 h-3.5 ${color}`} />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-slate-700">{label}</p>
                            <p className="text-[10px] text-slate-400">Live API</p>
                          </div>
                          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        </div>
                      ))}
                    </div>
                    <div className="px-3 py-2 bg-slate-50 border-t border-slate-100">
                      <p className="text-[10px] text-slate-400">Open-source LLM · No OpenAI</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <button className="hidden sm:flex w-8 h-8 items-center justify-center rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors relative">
            <Bell className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleNav('profile')}
            className={`flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all ${
              activePage === 'profile'
                ? 'bg-cyan-50 border border-cyan-200'
                : 'hover:bg-slate-100 border border-transparent'
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center shadow-sm">
              <User className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="hidden sm:block text-xs font-medium text-slate-600 max-w-[80px] truncate">
              {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Profile'}
            </span>
          </button>

          {onSignOut && (
            <button
              onClick={onSignOut}
              title="Sign out"
              className="hidden sm:flex w-8 h-8 items-center justify-center rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 border border-transparent hover:border-red-200 transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/98 px-4 py-3 space-y-1">
          {NAV_ITEMS.map(({ id, icon: Icon, label, desc }) => (
            <button
              key={id}
              onClick={() => handleNav(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
                activePage === id
                  ? 'bg-cyan-50 border border-cyan-200 text-cyan-700'
                  : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                activePage === id ? 'bg-cyan-100' : 'bg-slate-100'
              }`}>
                <Icon className={`w-4 h-4 ${activePage === id ? 'text-cyan-600' : 'text-slate-500'}`} />
              </div>
              <div>
                <p className="text-sm font-semibold">{label}</p>
                <p className="text-xs text-slate-400">{desc}</p>
              </div>
              {id === 'history' && conversationCount > 0 && (
                <span className="ml-auto text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                  {conversationCount}
                </span>
              )}
            </button>
          ))}

          <div className="pt-2 pb-1 border-t border-slate-100">
            <div className="flex items-center justify-between px-3 py-2">
              <p className="text-xs text-slate-500 font-medium">Live Data Sources</p>
              <div className="flex gap-1.5">
                {SOURCES.map(({ icon: Icon, color }) => (
                  <Icon key={color} className={`w-3.5 h-3.5 ${color}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activePage === 'chat' && activeTitle && activeTitle !== 'New Research Session' && (
        <div className="hidden lg:flex items-center gap-2 px-6 py-2 border-t border-slate-100 bg-slate-50/50">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" />
          <span className="text-xs text-slate-500 truncate max-w-xs">{activeTitle}</span>
          {disease && (
            <span className="text-xs px-2 py-0.5 bg-cyan-100 text-cyan-700 rounded-full font-medium flex-shrink-0">
              {disease}
            </span>
          )}
        </div>
      )}
    </header>
  );
}
