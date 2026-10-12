import React, { useEffect, useState, useCallback } from 'react';
import { applicationService } from '../services/applicationService';
import { jobService } from '../services/jobService';
import { Application, Job } from '../types';
import { KanbanBoard } from '../components/applications/KanbanBoard';
import { GitPullRequest, Filter, Sparkles } from 'lucide-react';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const PipelinePage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | ''>('');
  const [loading, setLoading] = useState(true);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      if (selectedJobId) {
        const list = await applicationService.getApplicationsForJob(Number(selectedJobId));
        setApplications(list);
      } else {
        const res = await applicationService.getApplications({ page: 0, size: 100 });
        setApplications(res.content);
      }
    } catch (err) {
      console.error('Failed to load recruitment pipeline', err);
    } finally {
      setLoading(false);
    }
  }, [selectedJobId]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  useEffect(() => {
    jobService.getJobs({ page: 0, size: 50 }).then((res) => setJobs(res.content)).catch(() => {});
  }, []);

  const handleApplicationUpdated = (updated: Application) => {
    setApplications((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Hiring Pipeline</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
              Kanban
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Track candidates across recruitment stages and trigger stage progression workflows.
          </p>
        </div>

        {/* Job selector filter */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value === '' ? '' : Number(e.target.value))}
              className="text-sm font-semibold text-slate-800 bg-transparent focus:outline-none"
            >
              <option value="">All Job Requisitions ({jobs.length})</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} ({j.department})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      {loading ? (
        <LoadingSkeleton type="card" rows={6} />
      ) : (
        <KanbanBoard
          applications={applications}
          onApplicationUpdated={handleApplicationUpdated}
        />
      )}
    </div>
  );
};
