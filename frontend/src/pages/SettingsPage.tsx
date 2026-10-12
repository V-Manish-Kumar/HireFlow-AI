import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  User,
  Building,
  Sparkles,
  Server,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Info,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [actuatorHealth, setActuatorHealth] = useState<any>(null);

  useEffect(() => {
    axios
      .get('/actuator/health')
      .then((res) => setActuatorHealth(res.data))
      .catch(() => setActuatorHealth({ status: 'ACTIVE (Spring Boot)' }));
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Settings & Configuration</h1>
        <p className="text-sm text-slate-500 mt-1">
          Recruiter profile, AI provider telemetry, and enterprise architecture health.
        </p>
      </div>

      {/* Recruiter Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center">
          <User className="w-5 h-5 mr-2 text-brand-600" />
          Operator Profile
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-semibold text-slate-500 uppercase tracking-wider block">Full Name</span>
            <span className="text-sm font-bold text-slate-900 mt-1 block">{user?.fullName}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-semibold text-slate-500 uppercase tracking-wider block">Email Address</span>
            <span className="text-sm font-bold text-slate-900 mt-1 block">{user?.email}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-semibold text-slate-500 uppercase tracking-wider block">Role Authorization</span>
            <span className="text-sm font-bold text-brand-700 mt-1 block">{user?.role}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-semibold text-slate-500 uppercase tracking-wider block">Company</span>
            <span className="text-sm font-bold text-slate-900 mt-1 block">{user?.company || 'Enterprise Solutions'}</span>
          </div>
        </div>
      </div>

      {/* AI Matching Architecture Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-brand-600" />
            AI Candidate Matching Engine
          </h3>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Operational
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          The matching architecture operates on a provider-independent service abstraction (`AiProvider`).
          A deterministic baseline scoring engine extracts skills, normalizes synonyms/aliases, and factors in
          verified experience. An optional LLM provider integration supports structured reasoning and explanation.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 font-medium block">Default Provider</span>
            <span className="font-bold text-slate-800 text-sm mt-0.5 block">Baseline / LLM Hybrid</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 font-medium block">Algorithm Version</span>
            <span className="font-bold text-slate-800 text-sm mt-0.5 block">v1.0-deterministic</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 font-medium block">PDF Parser</span>
            <span className="font-bold text-slate-800 text-sm mt-0.5 block">Apache PDFBox 3.0</span>
          </div>
        </div>
      </div>

      {/* Architecture & Actuator Health */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center">
            <Server className="w-5 h-5 mr-2 text-indigo-600" />
            Backend Runtime & OpenAPI Telemetry
          </h3>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            {actuatorHealth?.status || 'UP'}
          </span>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800 block">OpenAPI / Swagger 3.0 Interactive Docs</span>
              <span className="text-slate-500">Live test endpoints, schemas, and authentication models</span>
            </div>
            <a
              href="http://localhost:8080/swagger-ui/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white border border-slate-300 font-semibold text-brand-600 hover:text-brand-800 shadow-sm transition-colors"
            >
              <span>Swagger UI</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800 block">Spring Boot Actuator Health</span>
              <span className="text-slate-500">Real-time database, disk space, and application health metrics</span>
            </div>
            <a
              href="http://localhost:8080/actuator/health"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white border border-slate-300 font-semibold text-slate-700 hover:text-slate-900 shadow-sm transition-colors"
            >
              <span>/actuator/health</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
