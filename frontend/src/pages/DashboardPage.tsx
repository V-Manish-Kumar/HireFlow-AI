import React, { useEffect, useState } from 'react';
import { analyticsService } from '../services/analyticsService';
import { DashboardStats } from '../types';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Users,
  FileCheck,
  Calendar,
  TrendingUp,
  Sparkles,
  ArrowRight,
  PlusCircle,
  GitPullRequest,
  CheckCircle2,
  Clock,
  Zap,
  BarChart2,
  ChevronRight,
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { useAuth } from '../context/AuthContext';

/* ── Skeleton ─────────────────────────────────────── */
const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`shimmer-bg rounded-xl ${className}`} />
);

/* ── Metric Card ──────────────────────────────────── */
interface MetricCardProps {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  accent: string;         // hex colour
  accentBg: string;       // rgba bg
  trend?: string;
  link: string;
  delay?: number;
}
const MetricCard: React.FC<MetricCardProps> = ({ label, value, icon: Icon, accent, accentBg, trend, link, delay = 0 }) => (
  <Link
    to={link}
    className="group relative bg-white rounded-2xl p-5 border border-slate-200/80 overflow-hidden transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between min-h-[120px] animate-slide-up"
    style={{ animationDelay: `${delay}ms`, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 32px rgba(0,0,0,0.10)`; }}
    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'; }}
  >
    {/* Subtle top accent line */}
    <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }} />

    <div className="flex items-start justify-between">
      <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400 leading-tight max-w-[120px]">{label}</p>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110" style={{ background: accentBg }}>
        <Icon className="w-4 h-4" style={{ color: accent }} />
      </div>
    </div>

    <div className="mt-3">
      <span className="text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">{value}</span>
      {trend && (
        <div className="flex items-center space-x-1 mt-1">
          <TrendingUp className="w-3 h-3 text-emerald-500" />
          <span className="text-[10px] font-semibold text-emerald-600">{trend}</span>
        </div>
      )}
    </div>

    <ChevronRight className="w-3.5 h-3.5 text-slate-300 absolute bottom-4 right-4 transition-all duration-200 group-hover:text-slate-500 group-hover:translate-x-0.5" />
  </Link>
);

/* ── Stage Funnel Bar ──────────────────────────────── */
const STAGES = [
  { stage: 'APPLIED',     label: 'Applied',     color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  { stage: 'SCREENING',   label: 'Screening',   color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
  { stage: 'SHORTLISTED', label: 'Shortlisted', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  { stage: 'INTERVIEW',   label: 'Interview',   color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
  { stage: 'OFFER',       label: 'Offer',       color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  { stage: 'HIRED',       label: 'Hired',       color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
];

/* ── DashboardPage ────────────────────────────────── */
export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await analyticsService.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load dashboard metrics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const metricCards: MetricCardProps[] = [
    {
      label: 'Active Job Openings',
      value: stats?.totalActiveJobs || 0,
      icon: Briefcase,
      accent: '#6457f5',
      accentBg: 'rgba(100,87,245,0.1)',
      link: '/jobs',
      delay: 0,
    },
    {
      label: 'Candidates in Pool',
      value: stats?.totalCandidates || 0,
      icon: Users,
      accent: '#3b82f6',
      accentBg: 'rgba(59,130,246,0.1)',
      link: '/candidates',
      delay: 60,
    },
    {
      label: 'Total Applications',
      value: stats?.totalApplications || 0,
      icon: FileCheck,
      accent: '#8b5cf6',
      accentBg: 'rgba(139,92,246,0.1)',
      link: '/pipeline',
      delay: 120,
    },
    {
      label: 'Interviews Scheduled',
      value: stats?.interviewsScheduled || 0,
      icon: Calendar,
      accent: '#06b6d4',
      accentBg: 'rgba(6,182,212,0.1)',
      link: '/pipeline',
      delay: 180,
    },
    {
      label: 'Hiring Conversion',
      value: `${stats?.hiringConversionRate || 0}%`,
      icon: TrendingUp,
      accent: '#10b981',
      accentBg: 'rgba(16,185,129,0.1)',
      link: '/analytics',
      delay: 240,
    },
  ];

  return (
    <div className="space-y-6 page-enter">

      {/* ── Hero Banner ───────────────────────────── */}
      <div
        className="rounded-3xl p-7 sm:p-8 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #08071a 0%, #0f0d2e 40%, #160f4a 70%, #1c1060 100%)',
          border: '1px solid rgba(100,87,245,0.22)',
          boxShadow: '0 20px 60px rgba(100,87,245,0.12)',
        }}
      >
        {/* Background effects */}
        <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" />
        <div
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(100,87,245,0.20) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
            filter: 'blur(30px)',
          }}
        />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-3">
            {/* AI badge */}
            <div
              className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: 'rgba(100,87,245,0.18)',
                border: '1px solid rgba(100,87,245,0.35)',
                color: '#a78bfa',
              }}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>AI Talent Intelligence · Live</span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                Recruiter Operations
                <span
                  className="ml-2"
                  style={{
                    background: 'linear-gradient(135deg, #818cf8 0%, #c4b5fd 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Dashboard
                </span>
              </h1>
              <p className="text-slate-400 text-sm mt-1 max-w-lg">
                Welcome back, <span className="text-slate-200 font-semibold">{user?.fullName?.split(' ')[0]}</span>.
                {' '}Live pipeline metrics, AI matching scores, and team activity — all in one view.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <Link
              to="/jobs"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #6457f5 0%, #8b5cf6 100%)',
                boxShadow: '0 4px 16px rgba(100,87,245,0.4)',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'none'; }}
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Job</span>
            </Link>
            <Link
              to="/pipeline"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.85)',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; }}
            >
              <GitPullRequest className="w-4 h-4" />
              <span>Kanban View</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Metric Cards ──────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200/80 space-y-3 h-[120px]">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-8 w-8" />
              </div>
              <Skeleton className="h-8 w-16 mt-2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {metricCards.map((card) => (
            <MetricCard key={card.label} {...card} />
          ))}
        </div>
      )}

      {/* ── Pipeline Funnel ──────────────────────── */}
      {!loading && stats?.applicationsByStage && (
        <div
          className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden animate-slide-up"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)', animationDelay: '300ms' }}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(100,87,245,0.1)' }}
              >
                <BarChart2 className="w-4 h-4 text-brand-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Live Hiring Pipeline</h3>
                <p className="text-xs text-slate-400">Application volume across active lifecycle stages</p>
              </div>
            </div>
            <Link
              to="/pipeline"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center space-x-1 transition-colors"
            >
              <span>Kanban Board</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-0 divide-x divide-slate-100">
            {STAGES.map((st) => {
              const count = stats.applicationsByStage[st.stage] || 0;
              const pct = stats.totalApplications > 0
                ? (count / stats.totalApplications) * 100
                : 0;
              return (
                <div key={st.stage} className="p-5 text-center space-y-2.5 group hover:bg-slate-50 transition-colors">
                  <p className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-slate-400">{st.label}</p>
                  <p className="text-2xl font-extrabold tabular-nums" style={{ color: st.color }}>{count}</p>
                  <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mx-auto max-w-[60px]">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: st.color }}
                    />
                  </div>
                  <p className="text-[10px] font-medium text-slate-400">{pct.toFixed(0)}%</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Bottom Two-Column Layout ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Applications */}
        <div
          className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 overflow-hidden flex flex-col animate-slide-up"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)', animationDelay: '360ms' }}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Applications</h3>
              <p className="text-xs text-slate-400 mt-0.5">Latest candidate submissions with AI match scores</p>
            </div>
            <Link
              to="/pipeline"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center space-x-1 transition-colors"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex-1 divide-y divide-slate-100/80">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="p-4 flex items-center space-x-3">
                  <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-40" />
                    <Skeleton className="h-2.5 w-28" />
                  </div>
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
              ))
            ) : stats?.recentApplications && stats.recentApplications.length > 0 ? (
              stats.recentApplications.map((app, i) => (
                <div
                  key={app.id}
                  className="p-4 flex items-center justify-between hover:bg-slate-50/70 transition-colors group animate-slide-up"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    {/* Avatar */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold text-white"
                      style={{
                        background: `hsl(${(app.candidateName.charCodeAt(0) * 40) % 360}, 65%, 55%)`,
                      }}
                    >
                      {app.candidateName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <Link
                        to={`/applications/${app.id}`}
                        className="font-semibold text-sm text-slate-900 hover:text-brand-600 block truncate transition-colors"
                      >
                        {app.candidateName}
                      </Link>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {app.jobTitle} · {app.jobDepartment}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2.5 shrink-0">
                    {app.matchScore !== undefined && app.matchScore !== null && (
                      <span
                        className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          background: app.matchScore >= 80
                            ? 'rgba(16,185,129,0.1)'
                            : 'rgba(100,87,245,0.1)',
                          color: app.matchScore >= 80 ? '#059669' : '#6457f5',
                          border: `1px solid ${app.matchScore >= 80 ? 'rgba(16,185,129,0.25)' : 'rgba(100,87,245,0.25)'}`,
                        }}
                      >
                        {app.matchScore}% match
                      </span>
                    )}
                    <StatusBadge status={app.stage} size="sm" />
                    <Link
                      to={`/applications/${app.id}`}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 flex flex-col items-center justify-center text-center space-y-2">
                <FileCheck className="w-8 h-8 text-slate-200" />
                <p className="text-xs text-slate-400 font-medium">No applications recorded yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Audit Activity */}
        <div
          className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden flex flex-col animate-slide-up"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)', animationDelay: '400ms' }}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Audit History</h3>
              <p className="text-xs text-slate-400 mt-0.5">Audited team activity</p>
            </div>
            <Link to="/audit" className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors">
              Full log
            </Link>
          </div>

          <div className="flex-1 divide-y divide-slate-100/80 overflow-y-auto">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="p-4 space-y-2">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-2.5 w-44" />
                  <Skeleton className="h-2 w-20" />
                </div>
              ))
            ) : stats?.recentActivity && stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((evt, i) => (
                <div
                  key={evt.id}
                  className="p-4 space-y-1 text-xs hover:bg-slate-50/70 transition-colors animate-slide-up"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-slate-800 text-[12px] leading-tight">
                      {evt.action.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0 flex items-center space-x-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(evt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </span>
                  </div>
                  <p className="text-slate-500 line-clamp-2 text-[11px] leading-relaxed">{evt.details}</p>
                  <div className="flex items-center space-x-1.5 mt-1">
                    <div
                      className="w-4 h-4 rounded-md flex items-center justify-center text-[8px] font-bold text-white"
                      style={{ background: 'linear-gradient(135deg, #6457f5, #8b5cf6)' }}
                    >
                      {(evt.userName || 'S').charAt(0).toUpperCase()}
                    </div>
                    <p className="text-[10px] text-slate-400">{evt.userName || 'System'}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
                <CheckCircle2 className="w-7 h-7 text-slate-200" />
                <p className="text-xs text-slate-400 font-medium">No recent activity.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
