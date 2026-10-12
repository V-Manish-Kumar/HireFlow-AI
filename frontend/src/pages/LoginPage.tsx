import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Zap } from 'lucide-react';

/* ── Feature list ──────────────────────────────────── */
const FEATURES = [
  { icon: '🤖', label: 'AI-Powered Matching',    desc: 'Algorithmic resume scoring' },
  { icon: '📊', label: 'Real-Time Analytics',     desc: 'PostgreSQL pipeline metrics' },
  { icon: '🔐', label: 'Role-Based Access',        desc: 'Enterprise RBAC controls' },
  { icon: '⚡', label: 'Automated Workflows',     desc: 'Smart recruitment pipeline' },
];

/* ── Floating orb component ─────────────────────────── */
const Orb: React.FC<{ className?: string; size?: number; style?: React.CSSProperties }> = ({
  className,
  size = 400,
  style,
}) => (
  <div
    className={`absolute rounded-full pointer-events-none ${className}`}
    style={{ width: size, height: size, ...style }}
  />
);

/* ── LoginPage ─────────────────────────────────────── */
export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [showPass, setShowPass]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: '#070a14' }}>

      {/* ── Left Panel: Branding ─────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[52%] relative overflow-hidden p-12"
        style={{
          background: 'linear-gradient(145deg, #090b1a 0%, #0f1230 40%, #14104a 80%, #1a0e4f 100%)',
          borderRight: '1px solid rgba(100,87,245,0.15)',
        }}
      >
        {/* Decorative orbs */}
        <Orb
          size={600}
          style={{
            top: '-200px', left: '-200px',
            background: 'radial-gradient(circle, rgba(100,87,245,0.18) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <Orb
          size={500}
          style={{
            bottom: '-150px', right: '-150px',
            background: 'radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <Orb
          size={300}
          style={{
            top: '40%', left: '30%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
            filter: 'blur(30px)',
          }}
        />

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-grid opacity-40" />

        {/* Logo */}
        <div className="relative z-10 animate-fade-in">
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #6457f5, #8b5cf6)',
                boxShadow: '0 8px 24px rgba(100,87,245,0.4)',
              }}
            >
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-xl font-bold text-white tracking-tight">HireFlow</span>
              <span
                className="text-[10px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded"
                style={{ background: 'rgba(100,87,245,0.2)', color: '#a78bfa', border: '1px solid rgba(100,87,245,0.35)' }}
              >
                AI
              </span>
            </div>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative z-10 space-y-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="space-y-4">
            <div
              className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: 'rgba(100,87,245,0.15)',
                border: '1px solid rgba(100,87,245,0.3)',
                color: '#a78bfa',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Enterprise Platform v2.0</span>
            </div>

            <h1 className="text-4xl xl:text-5xl font-extrabold leading-[1.12] tracking-tight">
              <span className="text-white">Recruit Smarter</span>
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #c4b5fd 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                With AI Precision
              </span>
            </h1>

            <p className="text-slate-400 text-base leading-relaxed max-w-sm">
              Enterprise talent intelligence that turns your hiring data into competitive advantage. Built on Spring Boot 3 and PostgreSQL.
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-2 gap-3 max-w-md">
            {FEATURES.map((f, i) => (
              <div
                key={f.label}
                className="rounded-2xl p-4 space-y-1.5 animate-slide-up"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  animationDelay: `${0.2 + i * 0.08}s`,
                }}
              >
                <span className="text-xl">{f.icon}</span>
                <p className="text-white text-[13px] font-semibold leading-tight">{f.label}</p>
                <p className="text-slate-500 text-[11px]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom badges */}
        <div className="relative z-10 flex items-center space-x-2 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          {['Spring Boot 3', 'PostgreSQL', 'React', 'JWT Auth'].map((t) => (
            <span
              key={t}
              className="text-[10px] font-semibold px-2 py-1 rounded-lg"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── Right Panel: Login Form ───────────────── */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 relative">
        {/* Mobile logo */}
        <div className="lg:hidden mb-10 flex items-center space-x-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6457f5, #8b5cf6)' }}
          >
            <Zap className="w-4.5 h-4.5 text-white" style={{ width: '18px', height: '18px' }} />
          </div>
          <span className="text-xl font-bold text-white">HireFlow AI</span>
        </div>

        <div className="max-w-[380px] w-full mx-auto space-y-8 animate-slide-up">
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Welcome back
            </h2>
            <p className="text-sm text-slate-400">
              Sign in to your recruitment workspace
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              className="p-3.5 rounded-xl text-sm text-rose-300 flex items-start space-x-2.5 animate-scale-in"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              <span className="text-rose-400 mt-0.5 shrink-0">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                />
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@email.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-slate-600 transition-all duration-200 focus:outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.10)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.border = '1px solid rgba(100,87,245,0.6)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(100,87,245,0.15)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.border = '1px solid rgba(255,255,255,0.10)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                />
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 rounded-xl text-sm text-white placeholder-slate-600 transition-all duration-200 focus:outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.10)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.border = '1px solid rgba(100,87,245,0.6)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(100,87,245,0.15)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.border = '1px solid rgba(255,255,255,0.10)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #6457f5 0%, #8b5cf6 100%)',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(100,87,245,0.45)',
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Register link */}
          <p className="text-center text-xs text-slate-500">
            Don&apos;t have an account?{' '}
            <a
              href="/register"
              className="font-semibold transition-colors"
              style={{ color: '#a78bfa' }}
            >
              Register here
            </a>
          </p>
        </div>

        {/* Footer */}
        <div className="max-w-[380px] w-full mx-auto mt-12 text-center">
          <p className="text-[10px] text-slate-600">
            © 2025 HireFlow AI · Enterprise Edition · v2.0
          </p>
        </div>
      </div>
    </div>
  );
};
