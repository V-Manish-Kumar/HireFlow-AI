import React, { useEffect, useState, useCallback } from 'react';
import { candidateService } from '../services/candidateService';
import { Candidate, CandidateRequest, PagedResponse } from '../types';
import { Link } from 'react-router-dom';
import {
  Users,
  Plus,
  Search,
  Upload,
  FileText,
  MapPin,
  Clock,
  Edit2,
  Trash2,
  Briefcase,
} from 'lucide-react';
import { Pagination } from '../components/common/Pagination';
import { CandidateModal } from '../components/candidates/CandidateModal';
import { ResumeUploadModal } from '../components/candidates/ResumeUploadModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';

export const CandidatesPage: React.FC = () => {
  const [data, setData] = useState<PagedResponse<Candidate> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [minExperience, setMinExperience] = useState<number | ''>('');

  // Modals
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [candidateToEdit, setCandidateToEdit] = useState<Candidate | null>(null);
  const [candidateToUpload, setCandidateToUpload] = useState<Candidate | null>(null);
  const [candidateToDelete, setCandidateToDelete] = useState<Candidate | null>(null);

  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await candidateService.getCandidates({
        page,
        size: 10,
        keyword: keyword || undefined,
        minExperience: minExperience !== '' ? Number(minExperience) : undefined,
      });
      setData(res);
    } catch (err) {
      console.error('Failed to load candidate directory', err);
    } finally {
      setLoading(false);
    }
  }, [page, keyword, minExperience]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const handleSaveCandidate = async (formData: CandidateRequest) => {
    if (candidateToEdit) {
      await candidateService.updateCandidate(candidateToEdit.id, formData);
    } else {
      await candidateService.createCandidate(formData);
    }
    fetchCandidates();
  };

  const handleDeleteCandidate = async () => {
    if (candidateToDelete) {
      await candidateService.deleteCandidate(candidateToDelete.id);
      setCandidateToDelete(null);
      fetchCandidates();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Candidate Pool</h1>
          <p className="text-sm text-slate-500 mt-1">
            Search talent directory, extract resume PDF credentials, and review qualifications.
          </p>
        </div>
        <button
          onClick={() => {
            setCandidateToEdit(null);
            setIsCandidateModalOpen(true);
          }}
          className="inline-flex items-center px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-sm transition-all focus:ring-2 focus:ring-brand-500"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add Candidate
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(0);
            }}
            placeholder="Search candidate name, title, skills, or email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={minExperience}
            onChange={(e) => {
              setMinExperience(e.target.value === '' ? '' : Number(e.target.value));
              setPage(0);
            }}
            className="px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 bg-white focus:ring-2 focus:ring-brand-500"
          >
            <option value="">Any Experience</option>
            <option value="2">2+ Years Experience</option>
            <option value="4">4+ Years Experience</option>
            <option value="6">6+ Years Experience</option>
            <option value="8">8+ Years Experience</option>
          </select>
        </div>
      </div>

      {/* Candidate List Table */}
      {loading ? (
        <LoadingSkeleton type="table" rows={6} />
      ) : !data || data.content.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Candidates Found"
          description="Try broadening your search keyword criteria or add a new candidate to the talent directory."
          actionText="Add Candidate Profile"
          onAction={() => {
            setCandidateToEdit(null);
            setIsCandidateModalOpen(true);
          }}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Candidate</th>
                  <th className="px-6 py-4">Title & Experience</th>
                  <th className="px-6 py-4">Verified Skills</th>
                  <th className="px-6 py-4">Resume Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.content.map((cand) => (
                  <tr key={cand.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Candidate */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-brand-700 font-bold flex items-center justify-center shrink-0 border border-slate-200">
                          {cand.firstName.charAt(0)}
                          {cand.lastName.charAt(0)}
                        </div>
                        <div>
                          <Link
                            to={`/candidates/${cand.id}`}
                            className="font-semibold text-slate-900 hover:text-brand-600 block"
                          >
                            {cand.fullName}
                          </Link>
                          <span className="text-xs text-slate-400 block">{cand.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Title & Experience */}
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <p className="font-medium text-slate-800 text-xs">{cand.currentTitle || 'Professional'}</p>
                        <p className="text-xs text-slate-400 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {cand.yearsOfExperience} yrs exp
                          {cand.location && (
                            <>
                              <span className="mx-1">•</span>
                              <MapPin className="w-3 h-3 mr-1" />
                              {cand.location}
                            </>
                          )}
                        </p>
                      </div>
                    </td>

                    {/* Verified Skills */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {cand.skillsSummary ? (
                          cand.skillsSummary.split(',').slice(0, 3).map((s) => (
                            <span
                              key={s}
                              className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                            >
                              {s.trim()}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">None specified</span>
                        )}
                        {cand.skillsSummary && cand.skillsSummary.split(',').length > 3 && (
                          <span className="text-[11px] text-slate-400 font-medium">
                            +{cand.skillsSummary.split(',').length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Resume status */}
                    <td className="px-6 py-4">
                      {cand.resumeFilePath || cand.resumeOriginalFilename ? (
                        <div className="flex items-center space-x-1.5 text-xs text-emerald-700 font-medium bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg w-max">
                          <FileText className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="truncate max-w-[120px]">
                            {cand.resumeOriginalFilename || 'PDF Parsed'}
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => setCandidateToUpload(cand)}
                          className="inline-flex items-center text-xs font-semibold text-brand-600 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 border border-brand-200 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          <Upload className="w-3 h-3 mr-1" />
                          Upload PDF
                        </button>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setCandidateToUpload(cand)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-100 transition-colors"
                          title="Upload / Re-extract Resume"
                        >
                          <Upload className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setCandidateToEdit(cand);
                            setIsCandidateModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title="Edit Profile"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setCandidateToDelete(cand)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Candidate"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={data.page}
            totalPages={data.totalPages}
            totalElements={data.totalElements}
            pageSize={data.size}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Candidate Modal */}
      <CandidateModal
        isOpen={isCandidateModalOpen}
        onClose={() => setIsCandidateModalOpen(false)}
        onSubmit={handleSaveCandidate}
        candidateToEdit={candidateToEdit}
      />

      {/* Resume Upload Modal */}
      {candidateToUpload && (
        <ResumeUploadModal
          isOpen={!!candidateToUpload}
          onClose={() => setCandidateToUpload(null)}
          candidate={candidateToUpload}
          onUploaded={() => {
            fetchCandidates();
          }}
        />
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!candidateToDelete}
        onClose={() => setCandidateToDelete(null)}
        onConfirm={handleDeleteCandidate}
        title="Delete Candidate"
        message={`Are you sure you want to delete "${candidateToDelete?.fullName}"? All application links and resume records will be permanently removed.`}
        confirmText="Delete Candidate"
        isDestructive={true}
      />
    </div>
  );
};
