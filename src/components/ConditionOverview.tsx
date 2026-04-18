import { Lightbulb, TrendingUp, CircleCheck as CheckCircle2, FlaskConical } from 'lucide-react';
import type { LLMResponse } from '../types';

interface Props {
  aiResponse: LLMResponse;
  disease: string;
}

export default function ConditionOverview({ aiResponse, disease }: Props) {
  return (
    <div className="space-y-3">
      <div className="bg-gradient-to-br from-cyan-50 to-sky-50 rounded-xl border border-cyan-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-semibold text-slate-800 text-sm">Condition Overview</h3>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">{aiResponse.condition_overview}</p>
      </div>

      {aiResponse.research_insights?.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-semibold text-slate-800 text-sm">Research Insights</h3>
            <span className="text-xs text-slate-400 ml-1">Based on studies in {disease} patients</span>
          </div>
          <ul className="space-y-2">
            {aiResponse.research_insights.map((insight, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-slate-700">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {aiResponse.key_findings?.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-semibold text-slate-800 text-sm">Key Findings</h3>
          </div>
          <ul className="space-y-1.5">
            {aiResponse.key_findings.map((finding, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-700">
                <span className="text-amber-500 mt-0.5 flex-shrink-0">▸</span>
                <span className="leading-relaxed">{finding}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {aiResponse.clinical_trials_summary && (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center flex-shrink-0">
              <FlaskConical className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-semibold text-slate-800 text-sm">Clinical Trials Summary</h3>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">{aiResponse.clinical_trials_summary}</p>
        </div>
      )}

      {aiResponse.recommendations && (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Research Context</p>
          <p className="text-sm text-slate-700 leading-relaxed italic">{aiResponse.recommendations}</p>
          <p className="mt-2 text-xs text-slate-400">
            * For research purposes only. Consult a licensed medical professional for clinical decisions.
          </p>
        </div>
      )}
    </div>
  );
}
