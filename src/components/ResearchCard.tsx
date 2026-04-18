import { useState } from 'react';
import { ExternalLink, ChevronDown, ChevronUp, BookOpen, Calendar, Users } from 'lucide-react';
import type { Publication } from '../types';

interface Props {
  publication: Publication;
  index: number;
}

export default function ResearchCard({ publication, index }: Props) {
  const [expanded, setExpanded] = useState(false);
  const currentYear = new Date().getFullYear();

  const yearBadge =
    publication.year >= currentYear - 2
      ? 'bg-emerald-100 text-emerald-700'
      : publication.year >= currentYear - 5
      ? 'bg-cyan-100 text-cyan-700'
      : 'bg-slate-100 text-slate-600';

  return (
    <div className="bg-white rounded-xl border border-slate-200 hover:border-cyan-300 hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-cyan-50 border border-cyan-200 flex items-center justify-center text-xs font-bold text-cyan-600">
            {index + 1}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-slate-800 leading-snug mb-2 line-clamp-2">
              {publication.title}
            </h4>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {publication.year > 0 && (
                <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${yearBadge}`}>
                  <Calendar className="w-3 h-3" />
                  {publication.year}
                </span>
              )}
              {publication.source && (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  <BookOpen className="w-3 h-3" />
                  <span className="truncate max-w-[100px]">{publication.source}</span>
                </span>
              )}
              {publication.authors.length > 0 && (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  <Users className="w-3 h-3" />
                  {publication.authors[0]}{publication.authors.length > 1 ? ` +${publication.authors.length - 1}` : ''}
                </span>
              )}
            </div>
            {publication.abstract && (
              <>
                <p className={`text-xs text-slate-600 leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
                  {publication.abstract}
                </p>
                {publication.abstract.length > 120 && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="mt-1 text-xs text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-0.5 transition-colors"
                  >
                    {expanded
                      ? <><ChevronUp className="w-3 h-3" /> Show less</>
                      : <><ChevronDown className="w-3 h-3" /> Read abstract</>
                    }
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="px-4 pb-3 pt-2 border-t border-slate-50 flex justify-end">
        <a
          href={publication.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-600 hover:text-cyan-700 hover:underline transition-colors"
        >
          View Source <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
