import { Activity, Microscope, BookOpen, FlaskConical, Sparkles, ArrowRight, Shield, Zap, Globe } from 'lucide-react';

interface Props {
  onGetStarted: () => void;
}

const HERO_IMAGE = 'https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=1600';
const CTA_IMAGE = 'https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg?auto=compress&cs=tinysrgb&w=1600';

const FEATURES = [
  {
    icon: Microscope,
    title: 'PubMed Research',
    desc: 'Access peer-reviewed articles from the world\'s largest biomedical literature database.',
    color: 'from-cyan-500 to-teal-600',
  },
  {
    icon: BookOpen,
    title: 'OpenAlex Papers',
    desc: 'Explore open-access scholarly works, citations, and research connections.',
    color: 'from-teal-500 to-emerald-600',
  },
  {
    icon: FlaskConical,
    title: 'Clinical Trials',
    desc: 'Browse active and completed trials from ClinicalTrials.gov in real time.',
    color: 'from-emerald-500 to-cyan-600',
  },
  {
    icon: Sparkles,
    title: 'AI Analysis',
    desc: 'Advanced LLM reasoning synthesizes complex medical literature into clear insights.',
    color: 'from-sky-500 to-cyan-600',
  },
];

const TRUST = [
  { icon: Shield, label: 'HIPAA Compliant', desc: 'Enterprise-grade security and privacy' },
  { icon: Zap, label: 'Real-time Data', desc: 'Live sync with all major medical databases' },
  { icon: Globe, label: 'Global Coverage', desc: 'Research from institutions worldwide' },
];

export default function LandingPage({ onGetStarted }: Props) {
  return (
    <div className="min-h-screen overflow-y-auto" style={{ background: 'rgba(0,0,0,0)' }}>
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={HERO_IMAGE}
            alt="Medical research laboratory"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-teal-900/70" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live data from PubMed · OpenAlex · ClinicalTrials.gov
          </div>

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center shadow-2xl mx-auto mb-6">
            <Activity className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Medical Research
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
              Powered by AI
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/75 max-w-2xl mx-auto mb-10 leading-relaxed">
            Instantly search and synthesize peer-reviewed literature, clinical trials, and scholarly papers with AI-driven analysis built for medical professionals.
          </p>

          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white font-semibold rounded-2xl shadow-xl hover:shadow-cyan-500/30 transition-all duration-200 hover:scale-105 active:scale-95 text-base"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <section className="relative py-24 px-6">
        <div className="absolute inset-0 bg-white/95 backdrop-blur-md" />
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Everything you need for
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-600"> medical research</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              One unified platform to search, analyze, and synthesize from the world's largest medical databases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="group flex gap-5 p-6 bg-white rounded-2xl border border-slate-200 hover:border-cyan-200 hover:shadow-lg transition-all duration-200"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-16 px-6">
        <div className="absolute inset-0 bg-slate-50/95 backdrop-blur-md" />
        <div className="relative max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TRUST.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-50 to-teal-100 border border-cyan-200 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="text-sm font-semibold text-slate-800 mb-1">{label}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 px-6">
        <div className="absolute inset-0">
          <img
            src={CTA_IMAGE}
            alt="Medical professional"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-teal-900/90 via-slate-900/85 to-slate-900/90" />
        </div>
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to accelerate your research?
          </h2>
          <p className="text-white/70 text-lg mb-10">
            Join thousands of medical professionals using AI to unlock insights from the world's largest medical databases.
          </p>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-cyan-500/30 transition-all duration-200 hover:scale-105 active:scale-95 text-base"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}
