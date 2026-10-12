import React from 'react';
import { ApplicationStage, JobStatus } from '../../types';

interface StatusBadgeProps {
  status: JobStatus | ApplicationStage | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getBadgeStyle = (val: string) => {
    switch (val) {
      case 'OPEN':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'CLOSED':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'DRAFT':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'APPLIED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'SCREENING':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'SHORTLISTED':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'INTERVIEW':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'OFFER':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'HIRED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-1 ring-emerald-200';
      case 'REJECTED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'WITHDRAWN':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const formatText = (val: string) => {
    return val.replace('_', ' ');
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs tracking-wide font-medium';

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium uppercase ${sizeClasses} ${getBadgeStyle(
        status
      )}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
          status === 'HIRED' || status === 'OPEN'
            ? 'bg-emerald-500'
            : status === 'REJECTED'
            ? 'bg-rose-500'
            : status === 'INTERVIEW'
            ? 'bg-cyan-500'
            : 'bg-indigo-500'
        }`}
      />
      {formatText(status)}
    </span>
  );
};
