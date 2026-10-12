import React, { useEffect, useState, useCallback } from 'react';
import { notificationService } from '../services/notificationService';
import { NotificationItem, PagedResponse } from '../types';
import { Bell, Check, CheckCheck, Clock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Pagination } from '../components/common/Pagination';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';

export const NotificationsPage: React.FC = () => {
  const [data, setData] = useState<PagedResponse<NotificationItem>>({
    content: [],
    page: 0,
    size: 15,
    totalElements: 0,
    totalPages: 0,
    last: true,
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await notificationService.getNotifications(page, 15);
      setData(res);
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkRead = async (id: number) => {
    await notificationService.markAsRead(id);
    fetchNotifications();
  };

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead();
    fetchNotifications();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Notifications</h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time pipeline transitions, candidate applications, and recruitment milestones.
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="inline-flex items-center px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-sm"
        >
          <CheckCheck className="w-4 h-4 mr-1.5 text-brand-600" />
          Mark all as read
        </button>
      </div>

      {loading ? (
        <LoadingSkeleton type="table" rows={6} />
      ) : !data || data.content.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No Notifications"
          description="You are completely caught up! New application activities and stage changes will appear here."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {data.content.map((item) => (
              <div
                key={item.id}
                className={`p-5 flex items-start justify-between transition-colors ${
                  item.read ? 'bg-white' : 'bg-brand-50/30'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                      item.read
                        ? 'bg-slate-100 text-slate-500 border-slate-200'
                        : 'bg-brand-50 text-brand-600 border-brand-200'
                    }`}
                  >
                    <Bell className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-sm text-slate-900">{item.title}</h4>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-brand-600"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.message}</p>
                    <div className="flex items-center space-x-3 text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(item.createdAt).toLocaleString()}
                      </span>
                      {item.linkUrl && (
                        <Link
                          to={item.linkUrl}
                          className="font-medium text-brand-600 hover:text-brand-800 flex items-center"
                        >
                          <span>Open link</span>
                          <ExternalLink className="w-3 h-3 ml-0.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                {!item.read && (
                  <button
                    onClick={() => handleMarkRead(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors shrink-0 ml-3"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
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
