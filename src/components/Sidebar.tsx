import { useState } from 'react';
import { MessageSquarePlus, Trash2, Activity, Clock, X, History, User, MessageSquare, Search } from 'lucide-react';
import type { Conversation } from '../types';

export type PageName = 'chat' | 'history' | 'profile';

interface Props {
  conversations: Conversation[];
  activeId: string | null;
  activePage: PageName;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onNavigate: (page: PageName) => void;
  isOpen: boolean;
  onToggle: () => void;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function Sidebar({
  conversations, activeId, activePage, onSelect, onNew, onDelete, onNavigate, isOpen, onToggle,
}: Props) {
  const [search, setSearch] = useState('');

  const filtered = search.trim()
    ? conversations.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.disease.toLowerCase().includes(search.toLowerCase())
      )
    : conversations;

  if (activePage !== 'chat') return null;

  return (
    <>
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/40 z-30 backdrop-blur-sm" onClick={onToggle} />
      )}

      <aside
        className={`fixed lg:relative top-0 left-0 h-full z-40 w-72 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ background: 'linear-gradient(180deg, #0f172a 0%, #0f1d2f 100%)' }}
      >
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-2.5 mb-4 pt-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-700 flex items-center justify-center shadow-lg shadow-cyan-900/50">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-sm leading-tight">Sessions</h2>
              <p className="text-slate-500 text-xs">{conversations.length} total</p>
            </div>
            <button
              onClick={onToggle}
              className="lg:hidden ml-auto w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-slate-400 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => { onNew(); if (isOpen) onToggle(); }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-200 shadow-lg shadow-cyan-900/40 hover:shadow-cyan-900/60 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #06b6d4, #0d9488)' }}
          >
            <MessageSquarePlus className="w-4 h-4" />
            New Session
          </button>

          <div className="relative mt-3">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sessions..."
              className="w-full pl-8 pr-3 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5 scrollbar-thin">
          {filtered.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                <MessageSquarePlus className="w-5 h-5 text-slate-600" />
              </div>
              <p className="text-slate-500 text-xs font-medium">
                {search ? 'No sessions found' : 'No sessions yet'}
              </p>
              <p className="text-slate-600 text-xs mt-1">
                {search ? 'Try a different search' : 'Start researching above'}
              </p>
            </div>
          ) : (
            filtered.map((conv) => (
              <button
                key={conv.id}
                onClick={() => { onSelect(conv.id); if (isOpen) onToggle(); }}
                className={`w-full text-left px-3 py-2.5 rounded-xl group transition-all duration-150 ${
                  activeId === conv.id
                    ? 'bg-white/10 border border-white/15 shadow-sm'
                    : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center mt-0.5 transition-colors ${
                    activeId === conv.id ? 'bg-cyan-500/20' : 'bg-white/5 group-hover:bg-white/10'
                  }`}>
                    <MessageSquare className={`w-3 h-3 ${activeId === conv.id ? 'text-cyan-400' : 'text-slate-500'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium truncate leading-tight transition-colors ${
                      activeId === conv.id ? 'text-white' : 'text-slate-300 group-hover:text-white'
                    }`}>
                      {conv.title}
                    </p>
                    {conv.disease && (
                      <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 bg-cyan-500/15 text-cyan-400 rounded-md leading-none">
                        {conv.disease}
                      </span>
                    )}
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="w-2.5 h-2.5 text-slate-600" />
                      <span className="text-[10px] text-slate-600">{timeAgo(conv.updatedAt)}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }}
                    className="opacity-0 group-hover:opacity-100 flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-md hover:bg-red-500/20 text-slate-600 hover:text-red-400 transition-all mt-0.5"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="p-3 border-t border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-slate-500">All sources live</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { onNavigate('history'); if (isOpen) onToggle(); }}
                className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/10 text-slate-500 hover:text-slate-300 transition-colors"
                title="History"
              >
                <History className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => { onNavigate('profile'); if (isOpen) onToggle(); }}
                className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/10 text-slate-500 hover:text-slate-300 transition-colors"
                title="Profile"
              >
                <User className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
