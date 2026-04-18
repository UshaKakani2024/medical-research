import { useState, useMemo } from 'react';
import { Search, MessageSquare, Trash2, ChevronRight, Clock, Activity, Filter, BookOpen, FlaskConical, Calendar } from 'lucide-react';
import type { Conversation } from '../types';

interface Props {
  conversations: Conversation[];
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
}

const HISTORY_HERO = 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1200';

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatFullDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short', month: 'long', day: 'numeric', year: 'numeric',
  });
}

type SortOption = 'recent' | 'oldest' | 'disease';

export default function HistoryPage({ conversations, onOpen, onDelete }: Props) {
  const [search, setSearch] = useState('');
  const [filterDisease, setFilterDisease] = useState('');
  const [sort, setSort] = useState<SortOption>('recent');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const diseases = useMemo(() => {
    const set = new Set(conversations.map((c) => c.disease).filter(Boolean));
    return Array.from(set).sort();
  }, [conversations]);

  const filtered = useMemo(() => {
    let result = [...conversations];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) => c.title.toLowerCase().includes(q) || c.disease.toLowerCase().includes(q)
      );
    }
    if (filterDisease) {
      result = result.filter((c) => c.disease === filterDisease);
    }
    if (sort === 'recent') result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    if (sort === 'oldest') result.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
    if (sort === 'disease') result.sort((a, b) => a.disease.localeCompare(b.disease));
    return result;
  }, [conversations, search, filterDisease, sort]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  const groupedByDate = useMemo(() => {
    const groups: Record<string, Conversation[]> = {};
    filtered.forEach((conv) => {
      const d = new Date(conv.updatedAt);
      const now = new Date();
      let key: string;
      const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 0) key = 'Today';
      else if (diffDays === 1) key = 'Yesterday';
      else if (diffDays < 7) key = 'This Week';
      else if (diffDays < 30) key = 'This Month';
      else key = 'Older';
      if (!groups[key]) groups[key] = [];
      groups[key].push(conv);
    });
    return groups;
  }, [filtered]);

  const groupOrder = ['Today', 'Yesterday', 'This Week', 'This Month', 'Older'];

  return (
    <div className="flex flex-col h-full overflow-hidden page-enter">
      <div className="relative h-36 overflow-hidden flex-shrink-0 bg-gradient-to-br from-slate-800 to-slate-900">
        <img
          src={HISTORY_HERO}
          alt="Research history"
          className="w-full h-full object-cover object-center opacity-50"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-900/40" />
        <div className="absolute inset-0 flex flex-col justify-center px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Research History</h1>
              <p className="text-white/70 text-xs">{conversations.length} session{conversations.length !== 1 ? 's' : ''} total</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 bg-white border-b border-slate-200 px-4 lg:px-6 py-3">
        <div className="flex flex-col sm:flex-row gap-2 max-w-4xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search sessions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-slate-50"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Filter className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterDisease}
                onChange={(e) => setFilterDisease(e.target.value)}
                className="pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-slate-50 appearance-none"
              >
                <option value="">All Diseases</option>
                {diseases.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-slate-50"
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="disease">By Disease</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">No sessions found</p>
              <p className="text-slate-400 text-sm mt-1">
                {search || filterDisease ? 'Try adjusting your search or filter' : 'Start a new research session to see it here'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {groupOrder.map((group) => {
                const items = groupedByDate[group];
                if (!items?.length) return null;
                return (
                  <div key={group}>
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{group}</span>
                      <div className="flex-1 h-px bg-slate-100" />
                      <span className="text-xs text-slate-400">{items.length}</span>
                    </div>
                    <div className="grid gap-2">
                      {items.map((conv) => (
                        <div
                          key={conv.id}
                          className="bg-white border border-slate-200 rounded-xl hover:border-cyan-200 hover:shadow-sm transition-all group overflow-hidden"
                        >
                          <div className="flex items-start gap-3 p-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-50 to-teal-50 border border-cyan-100 flex items-center justify-center mt-0.5">
                              <Activity className="w-5 h-5 text-cyan-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-slate-800 truncate">{conv.title}</p>
                                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                                    {conv.disease && (
                                      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-cyan-100 text-cyan-700 rounded-full font-medium">
                                        <BookOpen className="w-3 h-3" />
                                        {conv.disease}
                                      </span>
                                    )}
                                    {conv.patientName && (
                                      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                                        {conv.patientName}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                  <span className="text-xs text-slate-400 hidden sm:inline">{formatDate(conv.updatedAt)}</span>
                                  <button
                                    onClick={() => handleDelete(conv.id)}
                                    disabled={deletingId === conv.id}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-3 text-xs text-slate-400">
                                  <span className="flex items-center gap-1">
                                    <FlaskConical className="w-3 h-3" />
                                    {formatFullDate(conv.createdAt)}
                                  </span>
                                </div>
                                <button
                                  onClick={() => onOpen(conv.id)}
                                  className="flex items-center gap-1 text-xs font-medium text-cyan-600 hover:text-cyan-700 transition-colors"
                                >
                                  Open <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
