import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  GitPullRequest,
  BarChart3,
  Bell,
  ShieldCheck,
  Settings,
  Zap,
  UserCog,
  ChevronRight,
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';

/* ── HireFlow Logo Mark ────────────────────────────── */
const LogoMark: React.FC = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="9" fill="url(#logoGrad)" />
    <path d="M8 10h16M8 16h11M8 22h8" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="23" cy="21" r="4.5" fill="white" fillOpacity="0.9" />
    <path d="M21.2 21l1.2 1.2 2.4-2.4" stroke="#6457f5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <defs>
      <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6457f5" />
        <stop offset="1" stopColor="#8b5cf6" />
      </linearGradient>
    </defs>
  </svg>
);

/* ── Nav Item Type ─────────────────────────────────── */
interface NavItemDef {
  to: string;
  label: string;
  icon: React.FC<{ className?: string }>;
  badge?: number;
}

/* ── Sidebar Component ─────────────────────────────── */
export const Sidebar: React.FC = () => {
  const { unreadCount } = useNotifications();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const navItems: NavItemDef[] = [
    { to: '/',              label: 'Dashboard',           icon: LayoutDashboard },
    { to: '/jobs',          label: 'Job Openings',        icon: Briefcase },
    { to: '/candidates',    label: 'Candidate Pool',      icon: Users },
    { to: '/pipeline',      label: 'Hiring Pipeline',     icon: GitPullRequest },
    { to: '/analytics',     label: 'Analytics',           icon: BarChart3 },
    { to: '/notifications', label: 'Notifications',       icon: Bell, badge: unreadCount },
    { to: '/audit',         label: 'Audit Trail',         icon: ShieldCheck },
    { to: '/settings',      label: 'Settings',            icon: Settings },
  ];

  return (
    <aside
      className="w-[260px] flex flex-col shrink-0 min-h-screen select-none"
      style={{
        background: 'linear-gradient(180deg, #080a18 0%, #0d1020 60%, #0a0d1c 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* ── Brand ─────────────────────────────────── */}
      <div className="h-16 flex items-center px-5 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center space-x-3">
          <LogoMark />
          <div className="flex items-baseline space-x-1.5">
            <span className="font-bold text-white text-[17px] tracking-tight">HireFlow</span>
            <span
              className="text-[9px] font-extrabold uppercase tracking-[0.14em] px-1.5 py-0.5 rounded"
              style={{ background: 'rgba(100,87,245,0.18)', color: '#a78bfa', border: '1px solid rgba(100,87,245,0.3)' }}
            >
              AI
            </span>
          </div>
        </div>
      </div>

      {/* ── Navigation ────────────────────────────── */}
      <nav className="flex-1 px-3 py-5 overflow-y-auto space-y-0.5">
        {/* Section label */}
        <p className="text-[9.5px] font-bold uppercase tracking-[0.15em] px-3.5 pb-3 pt-1 text-slate-500 select-none">
          Core Workflows
        </p>

        {navItems.map((item, idx) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 group relative ${
                isActive
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`
            }
            style={({ isActive }) =>
              isActive
                ? {
                    background: 'linear-gradient(135deg, rgba(100,87,245,0.25) 0%, rgba(139,92,246,0.15) 100%)',
                    borderLeft: '2px solid #6457f5',
                    boxShadow: '0 2px 16px rgba(100,87,245,0.12)',
                    paddingLeft: '12px',
                  }
                : {}
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center space-x-3">
                  <item.icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-brand-400' : 'text-slate-500 group-hover:text-slate-300'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className="px-1.5 py-0.5 text-[10px] font-bold rounded-full min-w-[18px] text-center"
                    style={{
                      background: isActive ? 'rgba(255,255,255,0.18)' : 'rgba(100,87,245,0.75)',
                      color: 'white',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}

        {/* ── Admin Section ──────────────────────── */}
        {isAdmin && (
          <div className="pt-5">
            <div
              className="mx-0 my-2 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.25), transparent)' }}
            />
            <p className="text-[9.5px] font-bold uppercase tracking-[0.15em] px-3.5 pb-3 pt-3 text-purple-400/80 select-none">
              Administration
            </p>
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 group ${
                  isActive ? 'text-white' : 'text-slate-400 hover:text-purple-300 hover:bg-purple-500/8'
                }`
              }
              style={({ isActive }) =>
                isActive
                  ? {
                      background: 'linear-gradient(135deg, rgba(139,92,246,0.25) 0%, rgba(168,85,247,0.15) 100%)',
                      borderLeft: '2px solid #8b5cf6',
                      boxShadow: '0 2px 16px rgba(139,92,246,0.12)',
                      paddingLeft: '12px',
                    }
                  : {}
              }
            >
              {({ isActive }) => (
                <div className="flex items-center space-x-3">
                  <UserCog
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-purple-400' : 'text-purple-500/60 group-hover:text-purple-400'
                    }`}
                  />
                  <span>User Management</span>
                </div>
              )}
            </NavLink>
          </div>
        )}
      </nav>

      {/* ── Footer Status ──────────────────────────── */}
      <div className="p-4 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div
          className="rounded-xl p-3.5 space-y-2"
          style={{
            background: 'rgba(100,87,245,0.08)',
            border: '1px solid rgba(100,87,245,0.18)',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-[11px] font-bold text-slate-200">Systems Online</span>
            </div>
            <Zap className="w-3.5 h-3.5 text-brand-400" />
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] text-slate-500 font-medium">Spring Boot 3</span>
            <span className="text-slate-700">·</span>
            <span className="text-[10px] text-slate-500 font-medium">PostgreSQL</span>
            <span className="text-slate-700">·</span>
            <span className="text-[10px] text-brand-500/80 font-semibold">AI v2</span>
          </div>
        </div>

        {/* User avatar strip */}
        <div className="mt-3 flex items-center space-x-2.5 px-1">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ background: 'linear-gradient(135deg, #6457f5, #8b5cf6)' }}
          >
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-200 truncate leading-tight">{user?.fullName}</p>
            <p className="text-[10px] text-slate-500 truncate capitalize">{user?.role?.toLowerCase()}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
