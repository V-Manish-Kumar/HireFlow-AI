import React, { useEffect, useState, useCallback } from 'react';
import { auditService } from '../services/auditService';
import { AuditEvent, PagedResponse } from '../types';
import { ShieldCheck, Clock, User } from 'lucide-react';
import { Pagination } from '../components/common/Pagination';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';

export const AuditPage: React.FC = () => {
  const [data, setData] = useState<PagedResponse<AuditEvent>>({
    content: [],
    page: 0,
    size: 15,
    totalElements: 0,
    totalPages: 0,
    last: true,
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  const fetchAuditEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await auditService.getAuditEvents(page, 15);
      setData(res);
    } catch (err) {
      console.error('Failed to load audit events', err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchAuditEvents();
  }, [fetchAuditEvents]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Audit Trail & Compliance Log</h1>
        <p className="text-sm text-slate-500 mt-1">
          Immutable audit record of all recruiter actions, candidate updates, and hiring stage transitions.
        </p>
      </div>

      {loading ? (
        <LoadingSkeleton type="table" rows={6} />
      ) : !data || data.content.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="No Audit Events Recorded"
          description="System actions and user events will be automatically logged here."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Target Entity</th>
                  <th className="px-6 py-4">Operator</th>
                  <th className="px-6 py-4">Event Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.content.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                      <span className="flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                        {new Date(evt.createdAt).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                        {evt.action.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-slate-700">
                      {evt.entityType} #{evt.entityId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600">
                      <span className="flex items-center">
                        <User className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {evt.userName || 'System'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 max-w-md">
                      <p className="line-clamp-2">{evt.details}</p>
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
    </div>
  );
};
