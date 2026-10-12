import React, { useState } from 'react';
import { MatchResult } from '../../types';
import { aiService } from '../../services/aiService';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RefreshCw,
  Info,
  Award,
} from 'lucide-react';

interface MatchResultCardProps {
  applicationId: number;
  initialMatch?: MatchResult | null;
  onMatchUpdated?: (result: MatchResult) => void;
}

export const MatchResultCard: React.FC<MatchResultCardProps> = ({
  applicationId,
  initialMatch,
  onMatchUpdated,
}) => {
  const [match, setMatch] = useState<MatchResult | null>(initialMatch || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRunMatch = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await aiService.matchApplication(applicationId);
      setMatch(res);
      if (onMatchUpdated) onMatchUpdated(res);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to compute AI match analysis');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 border-emerald-500 bg-emerald-50';
    if (score >= 60) return 'text-brand-600 border-brand-500 bg-brand-50';
    if (score >= 40) return 'text-amber-600 border-amber-500 bg-amber-50';
    return 'text-rose-600 border-rose-500 bg-rose-50';
  };

  if (!match) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center space-y-4 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 mx-auto">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-base font-semibold text-slate-900">AI Candidate Matching Analysis</h4>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
            Run algorithmic skill extraction, required qualification coverage, and interview question synthesis.
          </p>
        </div>
        {error && <p className="text-xs text-rose-600">{error}</p>}
        <button
          onClick={handleRunMatch}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium shadow-sm transition-all disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {loading ? 'Evaluating Credentials...' : 'Run AI Match Evaluation'}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
      {/* Header & Overall Score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-center space-x-4">
          <div
            className={`w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center shrink-0 ${getScoreColor(
              match.overallScore
            )}`}
          >
            <span className="text-2xl font-bold leading-none">{match.overallScore}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider mt-1 opacity-80">Match Score</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-lg font-bold text-slate-900">Candidate Evaluation Report</h4>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {match.provider} {match.algorithmVersion}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Evaluated on {new Date(match.createdAt).toLocaleDateString()} at{' '}
              {new Date(match.createdAt).toLocaleTimeString()}
            </p>
          </div>
        </div>

        <button
          onClick={handleRunMatch}
          disabled={loading}
          className="inline-flex items-center self-start sm:self-center px-3.5 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Recalculating...' : 'Re-run Evaluation'}
        </button>
      </div>

      {/* Breakdown Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Technical Skill Alignment
            </span>
            <span className="text-sm font-bold text-slate-900">{match.skillsScore} / 75 pts</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-brand-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(match.skillsScore / 75) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Experience Level Alignment
            </span>
            <span className="text-sm font-bold text-slate-900">{match.experienceScore} / 25 pts</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(match.experienceScore / 25) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Skills Evidence Pill Badges */}
      <div className="space-y-4">
        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-1.5" />
            Matched Required Skills ({match.matchingRequiredSkills.length})
          </h5>
          <div className="flex flex-wrap gap-2">
            {match.matchingRequiredSkills.length > 0 ? (
              match.matchingRequiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center"
                >
                  <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">No required skills explicitly verified</span>
            )}
          </div>
        </div>

        {match.missingRequiredSkills.length > 0 && (
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-rose-700 mb-2 flex items-center">
              <XCircle className="w-4 h-4 text-rose-600 mr-1.5" />
              Missing Required Qualifications ({match.missingRequiredSkills.length})
            </h5>
            <div className="flex flex-wrap gap-2">
              {match.missingRequiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-50 text-rose-800 border border-rose-200 flex items-center"
                >
                  <XCircle className="w-3 h-3 mr-1 text-rose-600" />
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {match.matchingPreferredSkills.length > 0 && (
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-2 flex items-center">
              <Award className="w-4 h-4 text-indigo-600 mr-1.5" />
              Bonus Preferred Skills ({match.matchingPreferredSkills.length})
            </h5>
            <div className="flex flex-wrap gap-2">
              {match.matchingPreferredSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-800 border border-indigo-200 flex items-center"
                >
                  <CheckCircle2 className="w-3 h-3 mr-1 text-indigo-600" />
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Narrative Summary */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
          Algorithmic Assessment Summary
        </h5>
        <p className="text-xs text-slate-700 leading-relaxed">{match.summary}</p>
      </div>

      {/* Suggested Interview Questions */}
      {match.interviewQuestions && match.interviewQuestions.length > 0 && (
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center">
            <HelpCircle className="w-4 h-4 text-brand-600 mr-1.5" />
            AI-Suggested Technical Interview Questions
          </h5>
          <div className="space-y-2">
            {match.interviewQuestions.map((q, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 flex items-start space-x-2 shadow-subtle"
              >
                <span className="font-bold text-brand-600 shrink-0">Q{idx + 1}:</span>
                <span className="leading-relaxed">{q}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ethical AI Disclaimer */}
      <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-[11px] leading-relaxed">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-700">Decision-Support Notice: </span>
          {match.disclaimer}
        </div>
      </div>
    </div>
  );
};
