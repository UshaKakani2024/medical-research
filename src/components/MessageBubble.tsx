import { useState } from 'react';
import { User, Bot, BookOpen, FlaskConical, ChevronDown, ChevronUp } from 'lucide-react';
import TypingIndicator from './TypingIndicator';
import ConditionOverview from './ConditionOverview';
import ResearchCard from './ResearchCard';
import TrialCard from './TrialCard';
import type { Message } from '../types';

interface Props {
  message: Message;
}

export default function MessageBubble({ message }: Props) {
  const [showPublications, setShowPublications] = useState(false);
  const [showTrials, setShowTrials] = useState(false);

  if (message.isLoading) {
    return (
      <div className="flex gap-3 items-start">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-sm">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div className="bg-white rounded-2xl rounded-tl-none border border-slate-200 shadow-sm min-w-[160px]">
          <TypingIndicator />
        </div>
      </div>
    );
  }

  if (message.role === 'user') {
    return (
      <div className="flex gap-3 items-start justify-end">
        <div className="max-w-[75%]">
          {message.queryData && (message.queryData.disease || message.queryData.patientName || message.queryData.location) && (
            <div className="mb-1.5 flex flex-wrap gap-1 justify-end">
              {message.queryData.disease && (
                <span className="text-xs px-2 py-0.5 bg-cyan-100 text-cyan-700 rounded-full font-medium">
                  {message.queryData.disease}
                </span>
              )}
              {message.queryData.patientName && (
                <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                  {message.queryData.patientName}
                </span>
              )}
              {message.queryData.location && (
                <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                  {message.queryData.location}
                </span>
              )}
            </div>
          )}
          <div className="bg-gradient-to-br from-cyan-600 to-teal-700 text-white rounded-2xl rounded-tr-none px-4 py-3 shadow-sm">
            <p className="text-sm leading-relaxed">{message.content}</p>
          </div>
          <p className="text-xs text-slate-400 mt-1 text-right">
            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-slate-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 items-start">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0 max-w-[90%]">
        {message.aiResponse ? (
          <ConditionOverview
            aiResponse={message.aiResponse}
            disease={message.queryData?.disease ?? 'the condition'}
          />
        ) : (
          <div className="bg-white rounded-2xl rounded-tl-none border border-slate-200 shadow-sm px-4 py-3">
            <p className="text-sm text-slate-700 leading-relaxed">{message.content}</p>
          </div>
        )}

        {message.publications && message.publications.length > 0 && (
          <div className="mt-3">
            <button
              onClick={() => setShowPublications(!showPublications)}
              className="flex items-center gap-2 text-xs font-semibold text-cyan-700 hover:text-cyan-800 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 px-3 py-1.5 rounded-lg transition-all w-full justify-between"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5" />
                {message.publications.length} Research Publications
              </span>
              {showPublications ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {showPublications && (
              <div className="mt-2 grid gap-2">
                {message.publications.map((pub, i) => (
                  <ResearchCard key={pub.id} publication={pub} index={i} />
                ))}
              </div>
            )}
          </div>
        )}

        {message.trials && message.trials.length > 0 && (
          <div className="mt-2">
            <button
              onClick={() => setShowTrials(!showTrials)}
              className="flex items-center gap-2 text-xs font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3 py-1.5 rounded-lg transition-all w-full justify-between"
            >
              <span className="flex items-center gap-2">
                <FlaskConical className="w-3.5 h-3.5" />
                {message.trials.length} Clinical Trials
              </span>
              {showTrials ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {showTrials && (
              <div className="mt-2 grid gap-2">
                {message.trials.map((trial) => (
                  <TrialCard key={trial.id} trial={trial} />
                ))}
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-slate-400 mt-2">
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}
