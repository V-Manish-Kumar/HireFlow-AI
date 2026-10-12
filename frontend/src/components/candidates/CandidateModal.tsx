import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Candidate, CandidateRequest } from '../../types';

interface CandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CandidateRequest) => Promise<void>;
  candidateToEdit?: Candidate | null;
}

export const CandidateModal: React.FC<CandidateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  candidateToEdit,
}) => {
  const [formData, setFormData] = useState<CandidateRequest>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    currentTitle: '',
    yearsOfExperience: 0,
    skillsSummary: '',
    resumeText: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (candidateToEdit) {
      setFormData({
        firstName: candidateToEdit.firstName,
        lastName: candidateToEdit.lastName,
        email: candidateToEdit.email,
        phone: candidateToEdit.phone || '',
        location: candidateToEdit.location || '',
        currentTitle: candidateToEdit.currentTitle || '',
        yearsOfExperience: candidateToEdit.yearsOfExperience,
        skillsSummary: candidateToEdit.skillsSummary || '',
        resumeText: candidateToEdit.resumeText || '',
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',
        currentTitle: '',
        yearsOfExperience: 3,
        skillsSummary: '',
        resumeText: '',
      });
    }
    setError(null);
  }, [candidateToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError('First name, last name, and email are required');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save candidate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={candidateToEdit ? 'Edit Candidate Profile' : 'Add Candidate to Talent Pool'}
      description="Enter candidate credentials, skills profile, and experience history."
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
              First Name *
            </label>
            <input
              type="text"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Last Name *
            </label>
            <input
              type="text"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1-555-0100"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Current Title
            </label>
            <input
              type="text"
              value={formData.currentTitle}
              onChange={(e) => setFormData({ ...formData, currentTitle: e.target.value })}
              placeholder="e.g. Senior Software Engineer"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Seattle, WA"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Years of Experience
            </label>
            <input
              type="number"
              min="0"
              value={formData.yearsOfExperience}
              onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) || 0 })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
            Skills Summary (comma-separated)
          </label>
          <input
            type="text"
            value={formData.skillsSummary}
            onChange={(e) => setFormData({ ...formData, skillsSummary: e.target.value })}
            placeholder="e.g. React, TypeScript, Python, PostgreSQL, AWS, Docker"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
            Resume Bio / Summary Text
          </label>
          <textarea
            rows={3}
            value={formData.resumeText}
            onChange={(e) => setFormData({ ...formData, resumeText: e.target.value })}
            placeholder="Key professional accomplishments, tech stack, and background highlights..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm"
          />
        </div>

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
            {loading ? 'Saving...' : candidateToEdit ? 'Save Changes' : 'Add Candidate'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
