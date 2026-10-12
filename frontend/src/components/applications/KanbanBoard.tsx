import React, { useState } from 'react';
import { Application, ApplicationStage } from '../../types';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  User,
  Briefcase,
  Calendar,
} from 'lucide-react';
import { StageChangeModal } from './StageChangeModal';

interface KanbanBoardProps {
  applications: Application[];
  onApplicationUpdated: (updated: Application) => void;
}

const STAGES: { key: ApplicationStage; label: string; color: string }[] = [
  { key: 'APPLIED', label: 'Applied', color: 'border-blue-400 bg-blue-50/40 text-blue-800' },
  { key: 'SCREENING', label: 'Screening', color: 'border-indigo-400 bg-indigo-50/40 text-indigo-800' },
  { key: 'SHORTLISTED', label: 'Shortlisted', color: 'border-purple-400 bg-purple-50/40 text-purple-800' },
  { key: 'INTERVIEW', label: 'Interview', color: 'border-cyan-400 bg-cyan-50/40 text-cyan-800' },
  { key: 'OFFER', label: 'Offer', color: 'border-amber-400 bg-amber-50/40 text-amber-800' },
  { key: 'HIRED', label: 'Hired', color: 'border-emerald-400 bg-emerald-50/40 text-emerald-800' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  applications,
  onApplicationUpdated,
}) => {
  const [selectedAppForStage, setSelectedAppForStage] = useState<Application | null>(null);

  const getScoreBadge = (score?: number) => {
    if (score === undefined || score === null) return null;
    const bg =
      score >= 80
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
        : score >= 60
        ? 'bg-brand-50 text-brand-700 border-brand-200'
        : score >= 40
        ? 'bg-amber-50 text-amber-700 border-amber-200'
        : 'bg-rose-50 text-rose-700 border-rose-200';

    return (
      <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${bg}`}>
        <Sparkles className="w-2.5 h-2.5 mr-1" />
        {score}% match
      </span>
    );
  };

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-[1200px]">
        {STAGES.map((col) => {
          const colApps = applications.filter((a) => a.stage === col.key);

          return (
            <div
              key={col.key}
              className="flex-1 min-w-[280px] bg-slate-100/70 rounded-2xl p-3 border border-slate-200 flex flex-col"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 px-1 mb-2 border-b border-slate-200">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    {col.label}
                  </span>
                  <span className="w-5 h-5 rounded-full bg-white text-slate-700 border border-slate-200 text-xs font-bold flex items-center justify-center">
                    {colApps.length}
                  </span>
                </div>
              </div>

              {/* Cards list */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[70vh] pr-0.5">
                {colApps.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl bg-white/50">
                    No candidates
                  </div>
                ) : (
                  colApps.map((app) => (
                    <div
                      key={app.id}
                      className="bg-white rounded-xl p-4 border border-slate-200 shadow-subtle hover:shadow-card transition-all space-y-3 text-left group"
                    >
                      <div className="flex items-start justify-between">
                        <Link
                          to={`/applications/${app.id}`}
                          className="font-semibold text-sm text-slate-900 hover:text-brand-600 transition-colors line-clamp-1"
                        >
                          {app.candidateName}
                        </Link>
                        {getScoreBadge(app.matchScore)}
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-500">
                        <div className="flex items-center space-x-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{app.jobTitle}</span>
                        </div>
                        {app.candidateTitle && (
                          <div className="flex items-center space-x-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{app.candidateTitle} ({app.candidateExperience}y exp)</span>
                          </div>
                        )}
                        {app.interviewDate && (
                          <div className="flex items-center space-x-1.5 text-cyan-700 bg-cyan-50 p-1.5 rounded-lg border border-cyan-100">
                            <Calendar className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate text-[11px] font-medium">
                              {new Date(app.interviewDate).toLocaleString([], {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Card actions */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <Link
                          to={`/applications/${app.id}`}
                          className="text-[11px] font-medium text-slate-600 hover:text-brand-600"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => setSelectedAppForStage(app)}
                          className="inline-flex items-center text-[11px] font-semibold text-brand-600 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 px-2 py-1 rounded-lg transition-colors"
                        >
                          <span>Move</span>
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedAppForStage && (
        <StageChangeModal
          isOpen={!!selectedAppForStage}
          onClose={() => setSelectedAppForStage(null)}
          application={selectedAppForStage}
          onUpdated={(updated) => {
            onApplicationUpdated(updated);
            setSelectedAppForStage(null);
          }}
        />
      )}
    </div>
  );
};
