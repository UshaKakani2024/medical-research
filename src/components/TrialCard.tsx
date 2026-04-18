import { useState } from 'react';
import { ExternalLink, ChevronDown, ChevronUp, MapPin, Activity, Phone } from 'lucide-react';
import type { ClinicalTrial } from '../types';

interface Props {
  trial: ClinicalTrial;
}

const STATUS_STYLES: Record<string, string> = {
  RECRUITING: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  ACTIVE_NOT_RECRUITING: 'bg-amber-100 text-amber-700 border-amber-200',
  COMPLETED: 'bg-slate-100 text-slate-600 border-slate-200',
  NOT_YET_RECRUITING: 'bg-sky-100 text-sky-700 border-sky-200',
  TERMINATED: 'bg-red-100 text-red-600 border-red-200',
};

export default function TrialCard({ trial }: Props) {
  const [expanded, setExpanded] = useState(false);
  const statusStyle = STATUS_STYLES[trial.status] ?? 'bg-slate-100 text-slate-500 border-slate-200';
  const statusLabel = trial.status.replace(/_/g, ' ');

  return (
    <div className="bg-white rounded-xl border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2 mb-2">
              {trial.title}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-semibold border ${statusStyle}`}>
                <Activity className="w-3 h-3" />
                {statusLabel}
              </span>
              {trial.phase && trial.phase !== 'N/A' && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 font-medium">
                  {trial.phase}
                </span>
              )}
              {trial.location && (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate max-w-[140px]">{trial.location.split(';')[0]}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {trial.id && (
          <p className="text-xs text-slate-400 font-mono mb-2">{trial.id}</p>
        )}

        {trial.eligibility && (
          <div>
            <p className={`text-xs text-slate-600 leading-relaxed ${expanded ? '' : 'line-clamp-3'}`}>
              <span className="font-medium text-slate-700">Eligibility: </span>
              {trial.eligibility}
            </p>
            {trial.eligibility.length > 180 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-1 text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center gap-0.5 transition-colors"
              >
                {expanded
                  ? <><ChevronUp className="w-3 h-3" /> Show less</>
                  : <><ChevronDown className="w-3 h-3" /> Full criteria</>
                }
              </button>
            )}
          </div>
        )}

        {trial.contactInfo && trial.contactInfo.replace(/\|/g, '').trim() && (
          <div className="mt-3 p-2 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 flex items-start gap-1">
              <Phone className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span>{trial.contactInfo}</span>
            </p>
          </div>
        )}
      </div>
      <div className="px-4 pb-3 pt-2 border-t border-slate-50 flex justify-end">
        <a
          href={trial.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-600 hover:text-teal-700 hover:underline transition-colors"
        >
          View Trial <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
