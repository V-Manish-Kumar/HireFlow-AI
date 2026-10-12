import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Bell, LogOut, Check, ExternalLink, Search, Command } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

/* ── Page title map ──────────────────────────────── */
const PAGE_TITLES: Record<string, string> = {
  '/':               'Dashboard',
  '/jobs':           'Job Openings',
  '/candidates':     'Candidate Pool',
  '/pipeline':       'Hiring Pipeline',
  '/analytics':      'Analytics',
  '/notifications':  'Notifications',
  '/audit':          'Audit Trail',
  '/settings':       'Settings',
  '/admin/users':    'User Management',
};

/* ── Navbar ──────────────────────────────────────── */
export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { unreadCount, recentNotifications, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const notifRef = useRef<HTMLDivElement>(null);

  const pageTitle = Object.entries(PAGE_TITLES).find(([path]) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  })?.[1] ?? 'HireFlow AI';

  /* Close notification popover on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="h-16 bg-white/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6 shrink-0"
      style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 0 rgba(0,0,0,0.04)' }}
    >
      {/* ── Left: Page Title ─────────────────────── */}
      <div className="flex items-center space-x-3">
        <div>
          <h2 className="text-[15px] font-bold text-slate-800 leading-none">{pageTitle}</h2>
          <p className="text-[11px] text-slate-400 mt-0.5 font-medium leading-none">
            {user?.company || 'Enterprise Talent Cloud'}
          </p>
        </div>
      </div>

      {/* ── Right: Controls ──────────────────────── */}
      <div className="flex items-center space-x-1.5">

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            id="navbar-notifications-btn"
            onClick={() => setShowNotifications(v => !v)}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all duration-200"
            title="Notifications"
          >
            <Bell className="w-4.5 h-4.5" style={{ width: '18px', height: '18px' }} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
              </span>
            )}
          </button>

          {showNotifications && (
            <div
              id="notifications-popover"
              className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200/80 z-50 overflow-hidden animate-scale-in"
              style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.04)' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', background: 'rgba(248,249,252,0.8)' }}
              >
                <div className="flex items-center space-x-2">
                  <Bell className="w-3.5 h-3.5 text-brand-500" />
                  <span className="text-xs font-bold text-slate-800">
                    Notifications
                    {unreadCount > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.5 text-[9px] font-extrabold bg-brand-500 text-white rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </span>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100/80">
                {recentNotifications.length === 0 ? (
                  <div className="py-10 flex flex-col items-center justify-center text-center space-y-2">
                    <Bell className="w-6 h-6 text-slate-200" />
                    <p className="text-xs text-slate-400 font-medium">You're all caught up!</p>
                  </div>
                ) : (
                  recentNotifications.map((n) => (
                    <div
                      key={n.id}
                      className={`px-4 py-3 flex items-start justify-between transition-colors ${
                        n.read ? 'bg-white' : 'bg-brand-50/50'
                      }`}
                    >
                      <div className="space-y-0.5 pr-2 min-w-0">
                        <div className="flex items-center space-x-1.5">
                          {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />}
                          <p className="text-xs font-semibold text-slate-800 truncate">{n.title}</p>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{n.message}</p>
                      </div>
                      {!n.read && (
                        <button
                          onClick={() => markAsRead(n.id)}
                          className="p-1 text-brand-500 hover:bg-brand-100 rounded-lg shrink-0 mt-0.5 transition-colors"
                          title="Mark read"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 text-center" style={{ borderTop: '1px solid rgba(0,0,0,0.06)', background: 'rgba(248,249,252,0.8)' }}>
                <Link
                  to="/notifications"
                  onClick={() => setShowNotifications(false)}
                  className="text-[11px] font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center space-x-1 transition-colors"
                >
                  <span>View all notifications</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-slate-200 mx-1" />

        {/* User pill */}
        <div className="flex items-center space-x-2.5 pl-1 pr-1">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ background: 'linear-gradient(135deg, #6457f5, #8b5cf6)', boxShadow: '0 2px 8px rgba(100,87,245,0.35)' }}
          >
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="hidden sm:block text-left leading-none">
            <p className="text-xs font-bold text-slate-800">{user?.fullName}</p>
            <p className="text-[10px] text-slate-400 capitalize mt-0.5">{user?.role?.toLowerCase()}</p>
          </div>
          <button
            id="navbar-logout-btn"
            onClick={logout}
            className="ml-1 w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all duration-200"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
