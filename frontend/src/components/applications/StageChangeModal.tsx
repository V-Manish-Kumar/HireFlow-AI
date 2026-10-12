import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Application, ApplicationStage } from '../../types';
import { applicationService } from '../../services/applicationService';
import { StatusBadge } from '../common/StatusBadge';

interface StageChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application;
  onUpdated: (updated: Application) => void;
}

export const StageChangeModal: React.FC<StageChangeModalProps> = ({
  isOpen,
  onClose,
  application,
  onUpdated,
}) => {
  const [selectedStage, setSelectedStage] = useState<ApplicationStage>(application.stage);
  const [comments, setComments] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stages: ApplicationStage[] = [
    'APPLIED',
    'SCREENING',
    'SHORTLISTED',
    'INTERVIEW',
    'OFFER',
    'HIRED',
    'REJECTED',
    'WITHDRAWN',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const updated = await applicationService.updateStage(
        application.id,
        selectedStage,
        comments || undefined,
        interviewDate ? new Date(interviewDate).toISOString() : undefined
      );
      onUpdated(updated);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update application stage');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Application Stage"
      description={`Move ${application.candidateName} for ${application.jobTitle}.`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Target Pipeline Stage
          </label>
          <div className="grid grid-cols-2 gap-2">
            {stages.map((stage) => {
              const isSelected = selectedStage === stage;
              return (
                <button
                  key={stage}
                  type="button"
                  onClick={() => setSelectedStage(stage)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                    isSelected
                      ? 'border-brand-600 bg-brand-50/70 text-brand-900 ring-2 ring-brand-500/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>{stage.replace('_', ' ')}</span>
                  <StatusBadge status={stage} size="sm" />
                </button>
              );
            })}
          </div>
        </div>

        {selectedStage === 'INTERVIEW' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Interview Date & Time
            </label>
            <input
              type="datetime-local"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Recruiter Notes / Transition Comments
          </label>
          <textarea
            rows={3}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Document candidate feedback, evaluation criteria, or next steps..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm"
          />
        </div>

        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
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
            {loading ? 'Updating...' : 'Confirm Stage Change'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
