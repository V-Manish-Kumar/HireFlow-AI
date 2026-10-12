import React from 'react';

interface LoadingSkeletonProps {
  rows?: number;
  type?: 'card' | 'table' | 'profile';
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ rows = 5, type = 'table' }) => {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="h-5 bg-slate-200 rounded w-2/3"></div>
              <div className="h-5 bg-slate-200 rounded-full w-16"></div>
            </div>
            <div className="h-4 bg-slate-100 rounded w-1/2"></div>
            <div className="h-12 bg-slate-100 rounded w-full"></div>
            <div className="flex gap-2">
              <div className="h-6 bg-slate-200 rounded-md w-16"></div>
              <div className="h-6 bg-slate-200 rounded-md w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm animate-pulse">
      <div className="h-12 bg-slate-100 border-b border-slate-200"></div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-3 w-1/3">
              <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0"></div>
              <div className="space-y-2 w-full">
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-3 bg-slate-100 rounded w-1/2"></div>
              </div>
            </div>
            <div className="h-4 bg-slate-100 rounded w-1/4 hidden sm:block"></div>
            <div className="h-6 bg-slate-200 rounded-full w-20"></div>
            <div className="h-8 bg-slate-100 rounded-lg w-16"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
