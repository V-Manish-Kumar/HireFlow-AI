import React, { useEffect, useState } from 'react';
import { analyticsService } from '../services/analyticsService';
import { ApplicationTrendItem, PipelineFunnelItem } from '../types';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from 'recharts';
import { BarChart3, TrendingUp, Users, GitPullRequest, ArrowDown } from 'lucide-react';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

const FUNNEL_COLORS = ['#3b82f6', '#6366f1', '#a855f7', '#06b6d4', '#f59e0b', '#10b981'];

export const AnalyticsPage: React.FC = () => {
  const [funnel, setFunnel] = useState<PipelineFunnelItem[]>([]);
  const [trends, setTrends] = useState<ApplicationTrendItem[]>([]);
  const [jobsDistribution, setJobsDistribution] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const [f, t, j] = await Promise.all([
          analyticsService.getPipelineFunnel(),
          analyticsService.getApplicationTrends(),
          analyticsService.getApplicationsByJob(),
        ]);
        setFunnel(f);
        setTrends(t);
        setJobsDistribution(j);
      } catch (err) {
        console.error('Failed to load recruitment analytics', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-slate-200 rounded w-1/4 animate-pulse"></div>
        <LoadingSkeleton type="card" rows={4} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Recruitment Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">
          Conversion funnels, application velocity, and talent distribution powered by PostgreSQL aggregations.
        </p>
      </div>

      {/* Funnel Step Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recruitment Conversion Funnel</h3>
            <p className="text-xs text-slate-500">Candidate drop-off and conversion rates through hiring stages</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Live Database Pipeline
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 pt-2">
          {funnel.map((step, idx) => (
            <div key={step.stage} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center relative">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                {step.stage}
              </span>
              <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{step.count}</span>
              <span className="text-xs font-semibold text-brand-600 mt-1 block">{step.percentage}% of total</span>
              {idx < funnel.length - 1 && (
                <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10">
                  <span className="w-4 h-4 rounded-full bg-white border border-slate-300 text-slate-400 flex items-center justify-center text-[10px]">
                    →
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Two Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Funnel Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-2">
            <GitPullRequest className="w-5 h-5 text-brand-600" />
            <h3 className="text-base font-bold text-slate-900">Stage Application Volumes</h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnel} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="stage" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {funnel.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={FUNNEL_COLORS[index % FUNNEL_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Applications Over Time Line Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">Application Intake Trends</h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Applications"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="hired"
                  name="Hired Candidates"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Applications By Job Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900">Application Distribution Across Job Openings</h3>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={jobsDistribution}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 80, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis
                dataKey="jobTitle"
                type="category"
                tick={{ fontSize: 11 }}
                width={120}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  borderRadius: '0.75rem',
                  color: '#fff',
                  border: 'none',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="applicationCount" name="Applicants" fill="#6366f1" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
