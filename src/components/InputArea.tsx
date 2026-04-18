import { useState, useRef, type KeyboardEvent } from 'react';
import { Send, SlidersHorizontal, X, User, Activity, MapPin, RotateCcw } from 'lucide-react';
import type { QueryInput } from '../types';

interface Props {
  onSubmit: (input: QueryInput) => void;
  onRegenerate: () => void;
  isLoading: boolean;
  hasMessages: boolean;
}

export default function InputArea({ onSubmit, onRegenerate, isLoading, hasMessages }: Props) {
  const [query, setQuery] = useState('');
  const [showStructured, setShowStructured] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [disease, setDisease] = useState('');
  const [location, setLocation] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery || isLoading) return;
    if (!disease.trim()) {
      alert('Please enter a disease or condition using the fields panel (sliders icon).');
      return;
    }
    onSubmit({
      patientName: patientName.trim() || undefined,
      disease: disease.trim(),
      query: trimmedQuery,
      location: location.trim() || undefined,
    });
    setQuery('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTextareaChange = (v: string) => {
    setQuery(v);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  };

  return (
    <div className="border-t border-slate-200 bg-white/90 backdrop-blur-sm p-4">
      {showStructured && (
        <div className="mb-3 bg-slate-50 rounded-xl border border-slate-200 p-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="relative">
            <User className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Patient Name (optional)"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-white"
            />
          </div>
          <div className="relative">
            <Activity className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Disease / Condition *"
              value={disease}
              onChange={(e) => setDisease(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-white"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Location (optional)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-white"
            />
          </div>
        </div>
      )}

      <div className="flex gap-2 items-end">
        <button
          onClick={() => setShowStructured(!showStructured)}
          className={`flex-shrink-0 p-2.5 rounded-xl border transition-all ${
            showStructured
              ? 'bg-cyan-50 border-cyan-300 text-cyan-600'
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
          }`}
          title="Toggle patient details"
        >
          {showStructured ? <X className="w-4 h-4" /> : <SlidersHorizontal className="w-4 h-4" />}
        </button>

        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            rows={1}
            value={query}
            onChange={(e) => handleTextareaChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              disease
                ? `Ask about ${disease}... (Enter to send)`
                : 'Open the fields panel (⊟) then enter a disease and your question...'
            }
            disabled={isLoading}
            className="w-full resize-none px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-transparent bg-white disabled:opacity-60 transition-all"
            style={{ minHeight: '46px', maxHeight: '160px' }}
          />
        </div>

        {hasMessages && (
          <button
            onClick={onRegenerate}
            disabled={isLoading}
            title="Regenerate last answer"
            className="flex-shrink-0 p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 disabled:opacity-40 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={handleSubmit}
          disabled={isLoading || !query.trim()}
          className="flex-shrink-0 p-2.5 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 text-white hover:from-cyan-600 hover:to-teal-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {!showStructured && (
        <p className="mt-1.5 text-xs text-slate-400 text-center">
          Click the sliders icon to add patient details and disease for personalized research
        </p>
      )}
    </div>
  );
}
