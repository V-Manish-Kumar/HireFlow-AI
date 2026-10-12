import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { EmploymentType, Job, JobRequest, JobStatus } from '../../types';

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: JobRequest) => Promise<void>;
  jobToEdit?: Job | null;
}

export const JobModal: React.FC<JobModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  jobToEdit,
}) => {
  const [formData, setFormData] = useState<JobRequest>({
    title: '',
    department: '',
    location: '',
    employmentType: 'FULL_TIME',
    description: '',
    responsibilities: '',
    requiredSkills: '',
    preferredSkills: '',
    minExperienceYears: 0,
    status: 'OPEN',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (jobToEdit) {
      setFormData({
        title: jobToEdit.title,
        department: jobToEdit.department,
        location: jobToEdit.location,
        employmentType: jobToEdit.employmentType,
        description: jobToEdit.description,
        responsibilities: jobToEdit.responsibilities || '',
        requiredSkills: jobToEdit.requiredSkills,
        preferredSkills: jobToEdit.preferredSkills || '',
        minExperienceYears: jobToEdit.minExperienceYears,
        status: jobToEdit.status,
      });
    } else {
      setFormData({
        title: '',
        department: 'Engineering',
        location: 'Remote',
        employmentType: 'FULL_TIME',
        description: '',
        responsibilities: '',
        requiredSkills: '',
        preferredSkills: '',
        minExperienceYears: 2,
        status: 'OPEN',
      });
    }
    setError(null);
  }, [jobToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.department || !formData.requiredSkills || !formData.description) {
      setError('Please fill in all mandatory fields (Title, Department, Skills, Description)');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save job opening');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={jobToEdit ? 'Edit Job Opening' : 'Create New Job Opening'}
      description="Define the requirements, responsibilities, and skill criteria for candidate matching."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Job Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Senior Full Stack Engineer"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Department *
            </label>
            <input
              type="text"
              required
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              placeholder="e.g. Engineering, AI Labs, Product"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Location *
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. San Francisco, CA / Remote"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Employment Type
            </label>
            <select
              value={formData.employmentType}
              onChange={(e) => setFormData({ ...formData, employmentType: e.target.value as EmploymentType })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm bg-white"
            >
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="REMOTE">Remote</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Min. Experience (Years)
            </label>
            <input
              type="number"
              min="0"
              value={formData.minExperienceYears}
              onChange={(e) => setFormData({ ...formData, minExperienceYears: parseInt(e.target.value) || 0 })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
            Required Skills (comma-separated) *
          </label>
          <input
            type="text"
            required
            value={formData.requiredSkills}
            onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
            placeholder="e.g. React, TypeScript, Java, Spring Boot, PostgreSQL"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm"
          />
          <p className="text-[11px] text-slate-500 mt-1">Used as primary baseline scoring criteria for AI matching engine.</p>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
            Preferred Skills (comma-separated)
          </label>
          <input
            type="text"
            value={formData.preferredSkills}
            onChange={(e) => setFormData({ ...formData, preferredSkills: e.target.value })}
            placeholder="e.g. Docker, Kubernetes, AWS, Tailwind CSS"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
            Job Description *
          </label>
          <textarea
            required
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="High-level overview of role mission and objectives..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
            Core Responsibilities
          </label>
          <textarea
            rows={2}
            value={formData.responsibilities}
            onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
            placeholder="Key day-to-day duties and technical deliverables..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm"
          />
        </div>

        {jobToEdit && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Job Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as JobStatus })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm bg-white"
            >
              <option value="OPEN">Open (Active hiring)</option>
              <option value="DRAFT">Draft</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        )}

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : jobToEdit ? 'Save Changes' : 'Create Job Opening'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
