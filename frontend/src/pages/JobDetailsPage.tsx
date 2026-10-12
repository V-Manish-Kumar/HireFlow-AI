import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { applicationService } from '../services/applicationService';
import { candidateService } from '../services/candidateService';
import { Application, Candidate, Job } from '../types';
import {
  Briefcase,
  MapPin,
  Clock,
  ArrowLeft,
  Users,
  CheckCircle2,
  Sparkles,
  Plus,
  Calendar,
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { StageChangeModal } from '../components/applications/StageChangeModal';
import { Modal } from '../components/common/Modal';

export const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const jobId = Number(id);

  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // Stage change modal
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  // Link Candidate Modal
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState<number | ''>('');
  const [candidateNotes, setCandidateNotes] = useState('');
  const [linkError, setLinkError] = useState<string | null>(null);

  const loadJobData = useCallback(async () => {
    setLoading(true);
    try {
      const [jobData, appData] = await Promise.all([
        jobService.getJobById(jobId),
        applicationService.getApplicationsForJob(jobId),
      ]);
      setJob(jobData);
      setApplications(appData);
    } catch (err) {
      console.error('Failed to load job details', err);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    loadJobData();
  }, [loadJobData]);

  const openLinkCandidateModal = async () => {
    try {
      const res = await candidateService.getCandidates({ page: 0, size: 50 });
      setCandidates(res.content);
      setSelectedCandidateId(res.content.length > 0 ? res.content[0].id : '');
      setIsLinkModalOpen(true);
      setLinkError(null);
    } catch (err) {
      console.error('Failed to load candidates', err);
    }
  };

  const handleLinkCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidateId) return;
    setLinkError(null);
    try {
      await applicationService.createApplication(Number(selectedCandidateId), jobId, candidateNotes);
      setIsLinkModalOpen(false);
      loadJobData();
    } catch (err: any) {
      setLinkError(err.response?.data?.message || 'Failed to submit application');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-slate-200 rounded w-1/4 animate-pulse"></div>
        <LoadingSkeleton type="table" rows={6} />
      </div>
    );
  }

  if (!job) {
    return <div className="text-center py-12 text-slate-500">Job opening not found.</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Top breadcrumb */}
      <div>
        <Link
          to="/jobs"
          className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Back to all jobs
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{job.title}</h1>
              <StatusBadge status={job.status} />
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">{job.department}</span>
              <span>•</span>
              <span className="flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                {job.location}
              </span>
              <span>•</span>
              <span className="flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                {job.employmentType.replace('_', ' ')}
              </span>
              <span>•</span>
              <span>Min. {job.minExperienceYears}+ years experience</span>
            </div>
          </div>

          <button
            onClick={openLinkCandidateModal}
            className="inline-flex items-center px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Candidate Application
          </button>
        </div>
      </div>

      {/* Two Column Layout: Specifications & Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Specification Column */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">Required Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {job.requiredSkills.split(',').map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>

            {job.preferredSkills && (
              <>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 pt-2 border-t border-slate-100">
                  Preferred Qualifications
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {job.preferredSkills.split(',').map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">Role Description</h3>
            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{job.description}</p>

            {job.responsibilities && (
              <>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 pt-2 border-t border-slate-100">
                  Core Responsibilities
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{job.responsibilities}</p>
              </>
            )}
          </div>
        </div>

        {/* Right Applications Column */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Job Applicants ({applications.length})</h3>
              <p className="text-xs text-slate-500">Candidates evaluated for this role opening</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 flex-1">
            {applications.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400">
                No candidates have applied to this job yet. Click "Add Candidate Application" to submit a profile.
              </div>
            ) : (
              applications.map((app) => (
                <div
                  key={app.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2.5">
                      <Link
                        to={`/applications/${app.id}`}
                        className="font-bold text-sm text-slate-900 hover:text-brand-600"
                      >
                        {app.candidateName}
                      </Link>
                      <StatusBadge status={app.stage} size="sm" />
                    </div>
                    <p className="text-xs text-slate-500">
                      {app.candidateTitle} • {app.candidateExperience} years experience • {app.candidateEmail}
                    </p>
                    {app.interviewDate && (
                      <p className="text-xs text-cyan-700 flex items-center font-medium mt-1">
                        <Calendar className="w-3.5 h-3.5 mr-1" />
                        Interview scheduled: {new Date(app.interviewDate).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    {app.matchScore !== undefined && app.matchScore !== null && (
                      <div
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center ${
                          app.matchScore >= 80
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-brand-50 text-brand-800 border-brand-200'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5 mr-1" />
                        <span>{app.matchScore}% AI Match</span>
                      </div>
                    )}
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Update Stage
                    </button>
                    <Link
                      to={`/applications/${app.id}`}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
                    >
                      View Report
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Stage Change Modal */}
      {selectedApp && (
        <StageChangeModal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          application={selectedApp}
          onUpdated={(updated) => {
            setApplications((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
            setSelectedApp(null);
          }}
        />
      )}

      {/* Link Candidate Modal */}
      <Modal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        title="Add Candidate Application"
        description={`Submit a candidate profile from the talent pool for ${job.title}.`}
        maxWidth="md"
      >
        <form onSubmit={handleLinkCandidate} className="space-y-4">
          {linkError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
              {linkError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Select Candidate
            </label>
            <select
              value={selectedCandidateId}
              onChange={(e) => setSelectedCandidateId(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-brand-500"
            >
              {candidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName} — {c.currentTitle || 'Candidate'} ({c.yearsOfExperience}y exp)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Initial Application Notes
            </label>
            <textarea
              rows={3}
              value={candidateNotes}
              onChange={(e) => setCandidateNotes(e.target.value)}
              placeholder="Initial recruiter notes, referral info, or special context..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsLinkModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 shadow-sm"
            >
              Submit Application
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
