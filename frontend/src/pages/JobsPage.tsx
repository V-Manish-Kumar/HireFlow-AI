import React, { useEffect, useState, useCallback } from 'react';
import { jobService } from '../services/jobService';
import { Job, JobRequest, JobStatus, PagedResponse } from '../types';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  MapPin,
  Clock,
  Users,
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { Pagination } from '../components/common/Pagination';
import { JobModal } from '../components/jobs/JobModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';

export const JobsPage: React.FC = () => {
  const [data, setData] = useState<PagedResponse<Job> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<JobStatus | ''>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [departments, setDepartments] = useState<string[]>([]);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState<Job | null>(null);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await jobService.getJobs({
        page,
        size: 9,
        keyword: keyword || undefined,
        status: selectedStatus || undefined,
        department: selectedDepartment || undefined,
      });
      setData(res);
    } catch (err) {
      console.error('Failed to load jobs', err);
    } finally {
      setLoading(false);
    }
  }, [page, keyword, selectedStatus, selectedDepartment]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    jobService.getDepartments().then(setDepartments).catch(() => {});
  }, []);

  const handleSaveJob = async (formData: JobRequest) => {
    if (jobToEdit) {
      await jobService.updateJob(jobToEdit.id, formData);
    } else {
      await jobService.createJob(formData);
    }
    fetchJobs();
  };

  const handleToggleStatus = async (job: Job) => {
    const nextStatus: JobStatus = job.status === 'OPEN' ? 'CLOSED' : 'OPEN';
    await jobService.updateStatus(job.id, nextStatus);
    fetchJobs();
  };

  const handleDeleteJob = async () => {
    if (jobToDelete) {
      await jobService.deleteJob(jobToDelete.id);
      setJobToDelete(null);
      fetchJobs();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Job Openings</h1>
          <p className="text-sm text-slate-500 mt-1">
            Create, manage, and filter active recruitment requisitions and skill profiles.
          </p>
        </div>
        <button
          onClick={() => {
            setJobToEdit(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-sm transition-all focus:ring-2 focus:ring-brand-500"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Create Job Opening
        </button>
      </div>

      {/* Search and Filters Bar */}
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
            placeholder="Search by title, skills, or location..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={selectedDepartment}
            onChange={(e) => {
              setSelectedDepartment(e.target.value);
              setPage(0);
            }}
            className="px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value as JobStatus | '');
              setPage(0);
            }}
            className="px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          >
            <option value="">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="CLOSED">Closed</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>
      </div>

      {/* Job Cards Grid */}
      {loading ? (
        <LoadingSkeleton type="card" rows={6} />
      ) : !data || data.content.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No Job Openings Found"
          description="Try modifying your search filter criteria or create a new job opening to begin candidate matching."
          actionText="Create Job Opening"
          onAction={() => {
            setJobToEdit(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.content.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-subtle hover:shadow-card hover:-translate-y-0.5 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700">
                    {job.department}
                  </span>
                  <StatusBadge status={job.status} size="sm" />
                </div>

                <Link
                  to={`/jobs/${job.id}`}
                  className="font-bold text-base text-slate-900 hover:text-brand-600 transition-colors line-clamp-1"
                >
                  {job.title}
                </Link>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 mt-2">
                  <span className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {job.location}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {job.minExperienceYears}+ yrs exp
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 mt-3 leading-relaxed">
                  {job.description}
                </p>

                {/* Required Skills pills */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {job.requiredSkills.split(',').slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 text-[11px] font-medium bg-brand-50 text-brand-700 rounded-md border border-brand-100"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                  {job.requiredSkills.split(',').length > 4 && (
                    <span className="px-1.5 py-0.5 text-[11px] font-medium text-slate-400">
                      +{job.requiredSkills.split(',').length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom bar */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <Link
                  to={`/jobs/${job.id}`}
                  className="inline-flex items-center font-semibold text-slate-700 hover:text-brand-600"
                >
                  <Users className="w-3.5 h-3.5 mr-1.5 text-brand-600" />
                  <span>{job.applicationCount} applications</span>
                </Link>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleToggleStatus(job)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    title={job.status === 'OPEN' ? 'Close Job' : 'Re-open Job'}
                  >
                    {job.status === 'OPEN' ? (
                      <XCircle className="w-4 h-4 text-slate-500" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setJobToEdit(job);
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-100 transition-colors"
                    title="Edit Job"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setJobToDelete(job)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Job"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && (
        <Pagination
          currentPage={data.page}
          totalPages={data.totalPages}
          totalElements={data.totalElements}
          pageSize={data.size}
          onPageChange={setPage}
        />
      )}

      {/* Create / Edit Modal */}
      <JobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveJob}
        jobToEdit={jobToEdit}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!jobToDelete}
        onClose={() => setJobToDelete(null)}
        onConfirm={handleDeleteJob}
        title="Delete Job Opening"
        message={`Are you sure you want to delete "${jobToDelete?.title}"? All associated application links will be permanently removed.`}
        confirmText="Delete Job"
        isDestructive={true}
      />
    </div>
  );
};
