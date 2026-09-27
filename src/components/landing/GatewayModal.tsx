import React from 'react';
import { useProjectContext } from '../../context/ProjectContext';
import { AshokStambh } from '../common/AshokStambh';
import { UserRole } from '../../types/project';
import {
  ShieldCheck,
  Zap,
  Play,
  Sparkles,
  Bot,
  Sliders,
  GitCompare,
  Layers,
  X
} from 'lucide-react';

export const GatewayModal: React.FC = () => {
  const {
    showGateway,
    setShowGateway,
    setCurrentView,
    setSelectedProject,
    projects,
    userRole,
    setUserRole
  } = useProjectContext();

  if (!showGateway) return null;

  const handleLaunchShowcase = () => {
    const showcaseP = projects.find(p => p.project_id === 'P-1024') || projects[0];
    setSelectedProject(showcaseP);
    setCurrentView('PROJECT_DETAIL');
    setShowGateway(false);
  };

  const handleEnterDashboard = () => {
    setCurrentView('DASHBOARD');
    setShowGateway(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-ink-300 overflow-hidden my-6 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Top Close Button */}
        <button
          onClick={() => setShowGateway(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-ink-100 hover:bg-ink-200 text-ink-600 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Government Tricolor Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-600 via-white to-emerald-600"></div>

        {/* Official Header Section */}
        <div className="bg-ink-950 text-white p-8 text-center relative overflow-hidden border-b border-ink-800">
          <div className="flex justify-center mb-3">
            <div className="p-2 bg-ink-900 rounded-xl border border-ink-700 shadow-md">
              <AshokStambh size={48} className="text-champagne-300" />
            </div>
          </div>

          <div className="text-xs uppercase font-sans font-bold tracking-widest text-ink-300">
            भारत सरकार • GOVERNMENT OF INDIA
          </div>
          <div className="text-sm font-semibold text-ink-200 mt-0.5">
            Ministry of Statistics &amp; Programme Implementation (MoSPI)
          </div>

          <div className="mt-4">
            <h1 className="text-3xl font-extrabold text-white tracking-tight font-sans">
              PAIMANA AI
            </h1>
            <p className="text-emerald-400 font-mono text-xs uppercase tracking-widest font-bold mt-1">
              Integrated Project Monitoring &amp; AI Early Warning System
            </p>
          </div>

          <p className="text-ink-300 text-xs mt-3 italic font-serif max-w-lg mx-auto">
            “Predictive Monitoring • Risk Intelligence • Evidence-Based Intervention”
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-[11px] font-mono font-medium">
            <span>SIH 2026 Prototype • Problem Statement SIH26103</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Philosophy Banner */}
          <div className="p-3.5 bg-ink-50 rounded-xl border border-ink-200 text-center">
            <span className="text-[10px] uppercase font-bold text-ink-400 tracking-wider block mb-1">
              Core Operating Architecture
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-ink-900 font-mono">
              <span className="text-emerald-700">Detect</span>
              <span>→</span>
              <span className="text-sky-700">Explain</span>
              <span>→</span>
              <span className="text-purple-700">Predict</span>
              <span>→</span>
              <span className="text-amber-700">Simulate</span>
              <span>→</span>
              <span className="text-orange-700">Recommend</span>
              <span>→</span>
              <span className="text-ink-900">Act</span>
              <span>→</span>
              <span className="text-emerald-800">Verify</span>
            </div>
          </div>

          {/* Select Persona / Role */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-700">
              Select Your Demo Persona:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'GOVERNMENT_ADMIN', title: 'Government Admin', desc: 'MoSPI Cabinet & Inter-Ministerial Directives' },
                { id: 'MONITORING_OFFICER', title: 'Monitoring Officer', desc: 'Field Audit Allocation & SLA Enforcement' },
                { id: 'SENIOR_ANALYST', title: 'Senior Analyst', desc: 'CUF+ Model Tuning & Statistical Calibration' }
              ].map(r => (
                <button
                  key={r.id}
                  onClick={() => setUserRole(r.id as UserRole)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    userRole === r.id
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500'
                      : 'border-ink-200 hover:border-ink-400 bg-white text-ink-800'
                  }`}
                >
                  <div className="font-bold text-xs">{r.title}</div>
                  <div className="text-[10px] text-ink-500 mt-0.5 leading-snug">{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleEnterDashboard}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-ink-950 hover:bg-ink-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all group"
            >
              <Play className="w-4 h-4 text-champagne-300 fill-current group-hover:scale-110 transition-transform" />
              <span>Start Monitoring System</span>
            </button>

            <button
              onClick={handleLaunchShowcase}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <Sparkles className="w-4 h-4 text-champagne-300" />
              <span>Explore Showcase Project P-1024</span>
            </button>
          </div>

          {/* Data Honesty Notice */}
          <p className="text-[10px] text-ink-400 text-center leading-relaxed">
            <b>DATA HONESTY:</b> Preloaded with 1,250+ internally consistent synthetic project records modelled after MoSPI's Online Computerised Monitoring System (OCMS) &amp; PAIMANA data schema.
          </p>
        </div>
      </div>
    </div>
  );
};
