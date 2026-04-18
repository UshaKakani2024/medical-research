import { useState, useEffect, useRef } from 'react';
import { User, Save, Activity, BookOpen, FlaskConical, MessageSquare, Stethoscope, MapPin, Mail, Building, Award, ChevronRight, Camera, ImagePlus } from 'lucide-react';
import type { Conversation } from '../types';

interface ProfileData {
  name: string;
  email: string;
  specialty: string;
  institution: string;
  location: string;
  defaultDisease: string;
  bio: string;
  avatarUrl: string;
  coverUrl: string;
}

interface Props {
  conversations: Conversation[];
  onNavigateToChat: () => void;
}

const PROFILE_HERO = 'https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg?auto=compress&cs=tinysrgb&w=1200';
const AVATAR_IMAGE = 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=200';

const SPECIALTIES = [
  'General Medicine', 'Cardiology', 'Oncology', 'Neurology', 'Pediatrics',
  'Radiology', 'Surgery', 'Psychiatry', 'Endocrinology', 'Immunology',
  'Infectious Disease', 'Pulmonology', 'Nephrology', 'Gastroenterology',
  'Rheumatology', 'Dermatology', 'Medical Research', 'Pharmacology', 'Other',
];

const STORAGE_KEY = 'medresearch_profile';

function loadProfile(): ProfileData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as ProfileData;
  } catch { /**/ }
  return { name: '', email: '', specialty: '', institution: '', location: '', defaultDisease: '', bio: '', avatarUrl: '', coverUrl: '' };
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ProfilePage({ conversations, onNavigateToChat }: Props) {
  const [profile, setProfile] = useState<ProfileData>(loadProfile);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'stats'>('profile');
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (saved) {
      const t = setTimeout(() => setSaved(false), 2500);
      return () => clearTimeout(t);
    }
  }, [saved]);

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setSaved(true);
  };

  const set = (field: keyof ProfileData, value: string) =>
    setProfile((p) => ({ ...p, [field]: value }));

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await readFileAsDataURL(file);
    setProfile((p) => ({ ...p, avatarUrl: url }));
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await readFileAsDataURL(file);
    setProfile((p) => ({ ...p, coverUrl: url }));
  };

  const uniqueDiseases = [...new Set(conversations.map((c) => c.disease).filter(Boolean))];
  const totalSessions = conversations.length;
  const recentSessions = conversations.filter((c) => {
    const d = new Date(c.updatedAt);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return d > weekAgo;
  }).length;

  const statsCards = [
    { icon: MessageSquare, value: totalSessions, label: 'Research Sessions', color: 'text-cyan-600 bg-cyan-50 border-cyan-100' },
    { icon: BookOpen, value: uniqueDiseases.length, label: 'Diseases Researched', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { icon: FlaskConical, value: recentSessions, label: 'Sessions This Week', color: 'text-teal-600 bg-teal-50 border-teal-100' },
    { icon: Activity, value: totalSessions > 0 ? 'Active' : 'New', label: 'Researcher Status', color: 'text-amber-600 bg-amber-50 border-amber-100' },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden page-enter">
      <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
      <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />

      <div className="relative h-44 overflow-hidden flex-shrink-0 bg-gradient-to-br from-slate-800 to-teal-900">
        <img
          src={profile.coverUrl || PROFILE_HERO}
          alt="Cover"
          className="w-full h-full object-cover object-center opacity-60"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 to-slate-900/80" />
        <button
          onClick={() => coverInputRef.current?.click()}
          className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded-lg border border-white/20 transition-all"
        >
          <ImagePlus className="w-3.5 h-3.5" />
          Change Cover
        </button>
        <div className="absolute bottom-0 left-0 right-0 px-6 lg:px-8 pb-4 flex items-end gap-4">
          <div className="relative group">
            <div className="w-16 h-16 rounded-2xl border-2 border-white shadow-lg overflow-hidden bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <img
                    src={AVATAR_IMAGE}
                    alt="Profile"
                    className="w-full h-full object-cover object-top"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <User className="w-7 h-7 text-white absolute" />
                </>
              )}
              <button
                onClick={() => avatarInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"
              >
                <Camera className="w-5 h-5 text-white" />
              </button>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-white" />
          </div>
          <div className="mb-1">
            <h1 className="text-lg font-bold text-white leading-tight">
              {profile.name || 'Your Profile'}
            </h1>
            <p className="text-white/70 text-xs">
              {profile.specialty || 'Medical Researcher'}{profile.institution ? ` · ${profile.institution}` : ''}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 bg-white border-b border-slate-200 px-4 lg:px-8">
        <div className="max-w-3xl mx-auto flex gap-1">
          {(['profile', 'stats'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium capitalize transition-all border-b-2 -mb-px ${
                activeTab === tab
                  ? 'border-cyan-500 text-cyan-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab === 'profile' ? 'Edit Profile' : 'Research Stats'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-3xl mx-auto">
          {activeTab === 'profile' && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <h2 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-cyan-500" /> Personal Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => set('name', e.target.value)}
                        placeholder="Dr. Jane Smith"
                        className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-slate-50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => set('email', e.target.value)}
                        placeholder="jane@hospital.org"
                        className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-slate-50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Medical Specialty</label>
                    <div className="relative">
                      <Stethoscope className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <select
                        value={profile.specialty}
                        onChange={(e) => set('specialty', e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-slate-50 appearance-none"
                      >
                        <option value="">Select specialty</option>
                        {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Institution / Hospital</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={profile.institution}
                        onChange={(e) => set('institution', e.target.value)}
                        placeholder="Mayo Clinic"
                        className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-slate-50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={profile.location}
                        onChange={(e) => set('location', e.target.value)}
                        placeholder="New York, USA"
                        className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-slate-50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Default Research Disease</label>
                    <div className="relative">
                      <Activity className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={profile.defaultDisease}
                        onChange={(e) => set('defaultDisease', e.target.value)}
                        placeholder="e.g. Parkinson's disease"
                        className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-slate-50"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Professional Bio</label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => set('bio', e.target.value)}
                    placeholder="Brief description of your research focus and expertise..."
                    rows={3}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-slate-50 resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white text-sm font-medium rounded-xl shadow-sm transition-all active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  {saved ? 'Saved!' : 'Save Profile'}
                </button>
                {saved && (
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" /> Profile saved successfully
                  </span>
                )}
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                {statsCards.map(({ icon: Icon, value, label, color }) => (
                  <div key={label} className={`rounded-2xl border p-4 ${color}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4" />
                      <span className="text-xs font-medium opacity-70">{label}</span>
                    </div>
                    <p className="text-2xl font-bold">{value}</p>
                  </div>
                ))}
              </div>

              {uniqueDiseases.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-5">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-cyan-500" />
                    Diseases Researched
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {uniqueDiseases.map((d) => (
                      <span key={d} className="text-xs px-3 py-1.5 bg-cyan-50 text-cyan-700 border border-cyan-200 rounded-full font-medium">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {conversations.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-5">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-cyan-500" />
                    Recent Sessions
                  </h3>
                  <div className="space-y-2">
                    {conversations.slice(0, 5).map((conv) => (
                      <button
                        key={conv.id}
                        onClick={() => onNavigateToChat()}
                        className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-left group"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-700 truncate">{conv.title}</p>
                          {conv.disease && (
                            <span className="text-xs text-cyan-600">{conv.disease}</span>
                          )}
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 flex-shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {conversations.length === 0 && (
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 text-center">
                  <Activity className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm font-medium">No research sessions yet</p>
                  <p className="text-slate-400 text-xs mt-1 mb-4">Start your first session to see stats here</p>
                  <button
                    onClick={onNavigateToChat}
                    className="text-xs font-medium text-cyan-600 hover:text-cyan-700 flex items-center gap-1 mx-auto"
                  >
                    Start researching <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
