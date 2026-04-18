import { useEffect, useRef } from 'react';
import { Activity, Microscope, BookOpen, FlaskConical, Sparkles } from 'lucide-react';
import MessageBubble from './MessageBubble';
import InputArea from './InputArea';
import type { Message, QueryInput } from '../types';

interface Props {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  onSubmit: (input: QueryInput) => void;
  onRegenerate: () => void;
}

function WelcomeScreen() {
  const features = [
    {
      icon: Microscope,
      label: 'PubMed Research',
      desc: 'Peer-reviewed medical literature from 35M+ articles',
      img: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=600',
      accent: 'text-cyan-600',
    },
    {
      icon: BookOpen,
      label: 'OpenAlex Papers',
      desc: 'Open access scholarly works and citations',
      img: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=600',
      accent: 'text-teal-600',
    },
    {
      icon: FlaskConical,
      label: 'Clinical Trials',
      desc: 'Active & completed trials from ClinicalTrials.gov',
      img: 'https://images.pexels.com/photos/3786157/pexels-photo-3786157.jpeg?auto=compress&cs=tinysrgb&w=600',
      accent: 'text-emerald-600',
    },
    {
      icon: Sparkles,
      label: 'AI Analysis',
      desc: 'Open-source LLM reasoning with Mistral-7B',
      img: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600',
      accent: 'text-sky-600',
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-slate-800 via-teal-900 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-white/10" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center shadow-xl mb-3">
            <Activity className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1 drop-shadow-lg">Medical Research Assistant</h2>
          <p className="text-white/80 text-sm max-w-sm drop-shadow">
            Research-backed insights from PubMed, OpenAlex &amp; ClinicalTrials.gov
          </p>
        </div>
      </div>

      <div className="p-6 max-w-2xl mx-auto">
        <div className="grid grid-cols-2 gap-3 mb-6">
          {features.map(({ icon: Icon, label, desc, img, accent }) => (
            <div key={label} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-cyan-200 hover:shadow-md transition-all group">
              <div className="relative h-28 overflow-hidden bg-slate-100">
                <img
                  src={img}
                  alt={label}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-2 left-2 w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center">
                  <Icon className={`w-3.5 h-3.5 ${accent}`} />
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-slate-700">{label}</p>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { value: '35M+', label: 'PubMed Articles' },
            { value: '250M+', label: 'OpenAlex Works' },
            { value: '400K+', label: 'Clinical Trials' },
          ].map(({ value, label }) => (
            <div key={label} className="bg-gradient-to-br from-cyan-50 to-teal-50 border border-cyan-100 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-cyan-700">{value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-xs text-amber-800 leading-relaxed">
            <span className="font-semibold block mb-1">Getting started:</span>
            Click the <strong>sliders icon</strong> in the input bar below, enter a <strong>disease or condition</strong>, then type your research question and press Enter.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ChatArea({ messages, isLoading, error, onSubmit, onRegenerate }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full page-enter">
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <WelcomeScreen />
        ) : (
          <div className="p-4 lg:p-6 space-y-6 max-w-3xl mx-auto w-full">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                <p className="font-semibold mb-1">Error</p>
                <p>{error}</p>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto w-full">
        <InputArea
          onSubmit={onSubmit}
          onRegenerate={onRegenerate}
          isLoading={isLoading}
          hasMessages={messages.length > 0}
        />
      </div>
    </div>
  );
}
