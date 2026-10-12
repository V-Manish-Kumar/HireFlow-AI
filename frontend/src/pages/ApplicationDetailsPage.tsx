import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { applicationService } from '../services/applicationService';
import { aiService } from '../services/aiService';
import { Application, ApplicationHistoryItem, MatchResult } from '../types';
import {
  ArrowLeft,
  User,
  Briefcase,
  Calendar,
  Clock,
  Sparkles,
  ChevronRight,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { MatchResultCard } from '../components/applications/MatchResultCard';
import { StageChangeModal } from '../components/applications/StageChangeModal';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const ApplicationDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const appId = Number(id);

  const [application, setApplication] = useState<Application | null>(null);
  const [history, setHistory] = useState<ApplicationHistoryItem[]>([]);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [app, hist, match] = await Promise.all([
        applicationService.getApplicationById(appId),
        applicationService.getApplicationHistory(appId),
        aiService.getMatchResults(appId).catch(() => null),
      ]);
      setApplication(app);
      setHistory(hist);
      setMatchResult(match);
    } catch (err) {
      console.error('Failed to load application details', err);
    } finally {
      setLoading(false);
    }
  }, [appId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-slate-200 rounded w-1/4 animate-pulse"></div>
        <LoadingSkeleton type="profile" rows={4} />
      </div>
    );
  }

  if (!application) {
    return <div className="text-center py-12 text-slate-500">Application not found.</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Top back link */}
      <div>
        <Link
          to="/pipeline"
          className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Back to Hiring Pipeline
        </Link>

        {/* Application Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center space-x-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center shrink-0 shadow-md">
              {application.candidateName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {application.candidateName}
                </h1>
                <StatusBadge status={application.stage} />
              </div>
              <p className="text-sm text-slate-600">
                Applied for <span className="font-semibold text-slate-900">{application.jobTitle}</span> (
                {application.jobDepartment})
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2">
                <span>{application.candidateEmail}</span>
                <span>•</span>
                <span>{application.candidateExperience} years experience</span>
                <span>•</span>
                <span>Submitted {new Date(application.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to={`/candidates/${application.candidateId}`}
              className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Candidate Profile
            </Link>
            <button
              onClick={() => setIsStageModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              Update Stage
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: AI Matching Report & Stage History Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: AI Matching Analysis Card */}
        <div className="lg:col-span-2 space-y-6">
          <MatchResultCard
            applicationId={appId}
            initialMatch={matchResult}
            onMatchUpdated={(updated) => setMatchResult(updated)}
          />

          {application.notes && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center">
                <MessageSquare className="w-4 h-4 mr-1.5 text-slate-400" />
                Recruiter Application Notes
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{application.notes}</p>
            </div>
          )}
        </div>

        {/* Right Col: Timestamped Stage History Timeline */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 flex flex-col">
          <div>
            <h3 className="text-base font-bold text-slate-900">Stage Transition History</h3>
            <p className="text-xs text-slate-500 mt-0.5">Audited stage movement and recruiter comments</p>
          </div>

          <div className="relative pl-6 space-y-6 flex-1 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {history.map((item, idx) => (
              <div key={item.id} className="relative group text-left">
                {/* Timeline node dot */}
                <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-brand-600 ring-4 ring-white" />

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <StatusBadge status={item.toStage} size="sm" />
                    {item.fromStage && (
                      <span className="text-[10px] text-slate-400">from {item.fromStage}</span>
                    )}
                  </div>
                  {item.comments && (
                    <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-1">
                      {item.comments}
                    </p>
                  )}
                  <div className="text-[11px] text-slate-400 flex items-center pt-0.5">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(item.createdAt).toLocaleString()} by {item.changedByName || 'Recruiter'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stage Change Modal */}
      {isStageModalOpen && (
        <StageChangeModal
          isOpen={isStageModalOpen}
          onClose={() => setIsStageModalOpen(false)}
          application={application}
          onUpdated={(updated) => {
            setApplication(updated);
            loadData();
          }}
        />
      )}
    </div>
  );
};
