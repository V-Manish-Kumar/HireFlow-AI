import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { candidateService } from '../services/candidateService';
import { applicationService } from '../services/applicationService';
import { Application, Candidate } from '../types';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Clock,
  FileText,
  Upload,
  Briefcase,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { ResumeUploadModal } from '../components/candidates/ResumeUploadModal';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const CandidateProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const candidateId = Number(id);

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [c, appRes] = await Promise.all([
        candidateService.getCandidateById(candidateId),
        applicationService.getApplications({ page: 0, size: 50 }),
      ]);
      setCandidate(c);
      // Filter applications for this candidate
      setApplications(appRes.content.filter((a) => a.candidateId === candidateId));
    } catch (err) {
      console.error('Failed to load candidate profile', err);
    } finally {
      setLoading(false);
    }
  }, [candidateId]);

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

  if (!candidate) {
    return <div className="text-center py-12 text-slate-500">Candidate not found.</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Top back link */}
      <div>
        <Link
          to="/candidates"
          className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Back to Candidate Directory
        </Link>

        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center space-x-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center shrink-0 shadow-md">
              {candidate.firstName.charAt(0)}
              {candidate.lastName.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{candidate.fullName}</h1>
              <p className="text-sm text-slate-600 font-medium">{candidate.currentTitle || 'Candidate Profile'}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2">
                <span className="flex items-center text-slate-600">
                  <Mail className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {candidate.email}
                </span>
                {candidate.phone && (
                  <>
                    <span>•</span>
                    <span className="flex items-center text-slate-600">
                      <Phone className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {candidate.phone}
                    </span>
                  </>
                )}
                {candidate.location && (
                  <>
                    <span>•</span>
                    <span className="flex items-center text-slate-600">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {candidate.location}
                    </span>
                  </>
                )}
                <span>•</span>
                <span className="flex items-center text-slate-600">
                  <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {candidate.yearsOfExperience} years experience
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsUploadOpen(true)}
            className="inline-flex items-center self-start sm:self-center px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Upload className="w-4 h-4 mr-1.5" />
            {candidate.resumeFilePath ? 'Update PDF Resume' : 'Upload PDF Resume'}
          </button>
        </div>
      </div>

      {/* Two Column Layout: Resume Text & Application History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Skills & Resume Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">Verified Technical Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {candidate.skillsSummary ? (
                candidate.skillsSummary.split(',').map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200"
                  >
                    {skill.trim()}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">No skills listed</span>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">PDF Resume Content</h3>
              {candidate.resumeOriginalFilename && (
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {candidate.resumeOriginalFilename}
                </span>
              )}
            </div>
            {candidate.resumeText ? (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-mono whitespace-pre-wrap max-h-96 overflow-y-auto leading-relaxed">
                {candidate.resumeText}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                No resume text extracted yet. Upload a PDF to automatically extract candidate experience.
              </div>
            )}
          </div>
        </div>

        {/* Right Application History */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Application History ({applications.length})</h3>
              <p className="text-xs text-slate-500">Recruitment pipelines this candidate is actively pursuing</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 flex-1">
            {applications.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400">
                This candidate has not applied to any job requisitions yet.
              </div>
            ) : (
              applications.map((app) => (
                <div key={app.id} className="p-5 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/applications/${app.id}`}
                        className="font-bold text-sm text-slate-900 hover:text-brand-600"
                      >
                        {app.jobTitle}
                      </Link>
                      <StatusBadge status={app.stage} size="sm" />
                    </div>
                    <p className="text-xs text-slate-500">
                      {app.jobDepartment} • Applied on {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    {app.matchScore !== undefined && app.matchScore !== null && (
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200 flex items-center">
                        <Sparkles className="w-3.5 h-3.5 mr-1" />
                        {app.matchScore}% Match
                      </span>
                    )}
                    <Link
                      to={`/applications/${app.id}`}
                      className="inline-flex items-center px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <span>View Application</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Resume Upload Modal */}
      {isUploadOpen && (
        <ResumeUploadModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          candidate={candidate}
          onUploaded={(updated) => {
            setCandidate(updated);
            loadData();
          }}
        />
      )}
    </div>
  );
};
