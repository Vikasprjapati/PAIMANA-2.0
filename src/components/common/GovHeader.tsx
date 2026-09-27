import React, { useState, useEffect } from 'react';
import { AshokStambh } from './AshokStambh';
import { useProjectContext } from '../../context/ProjectContext';
import { UserRole } from '../../types/project';
import { Search, Download, HelpCircle, User, Bell, ChevronDown } from 'lucide-react';

export const GovHeader: React.FC = () => {
  const {
    userRole,
    setUserRole,
    filters,
    setFilters,
    setCurrentView,
    earlyWarningAlerts,
    setActiveReportModal,
    setShowGateway
  } = useProjectContext();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('en-IN', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }) + ' | ' + now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const unreadAlertsCount = earlyWarningAlerts.filter(a => a.status === 'UNREAD').length;

  const rolesList: { id: UserRole; title: string; subtitle: string }[] = [
    { id: 'GOVERNMENT_ADMIN', title: 'Government Admin (MoSPI)', subtitle: 'Full Inter-Ministerial Review & Directive Authority' },
    { id: 'MONITORING_OFFICER', title: 'Monitoring Officer (Director)', subtitle: 'SLA Escalations & Field Technical Audit Assignment' },
    { id: 'SENIOR_ANALYST', title: 'Senior Data Scientist (OCMS)', subtitle: 'CUF+ ML Model Calibration & Risk Verification' }
  ];

  return (
    <header className="bg-ink-950 text-white border-b border-ink-800 sticky top-0 z-40 shadow-md">
      {/* Top micro-bar: Indian Tricolor ribbon + Live Clock & Prototype Notice */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-600 via-white to-emerald-600"></div>

      <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-ink-900/60 text-xs text-ink-300">
        <div className="flex items-center gap-3">
          <span className="bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded font-mono font-medium tracking-wide">
            PROTOTYPE FOR SIH 2026 | PROBLEM STATEMENT SIH26103
          </span>
          <span className="hidden md:inline text-ink-400">
            PAIMANA/OCMS-aligned Prototype Data Model • Synthetic Data
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-mono text-ink-300 hidden sm:inline">{currentTime}</span>
          <button
            onClick={() => setShowGateway(true)}
            className="flex items-center gap-1 text-champagne-300 hover:text-white transition-colors underline underline-offset-2"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Judge Guide / Welcome</span>
          </button>
        </div>
      </div>

      {/* Main Government Banner */}
      <div className="px-4 py-3 flex items-center justify-between gap-4">
        {/* Left Branding */}
        <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => setCurrentView('DASHBOARD')}>
          <div className="p-1 bg-ink-900/90 rounded border border-ink-700/80 shadow-inner">
            <AshokStambh size={36} className="text-champagne-300" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[10px] tracking-widest font-semibold uppercase text-ink-300 font-sans">
                भारत सरकार • Government of India
              </span>
            </div>
            <h1 className="text-sm md:text-base font-bold text-white tracking-tight leading-snug">
              Ministry of Statistics &amp; Programme Implementation (MoSPI)
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-extrabold text-emerald-400 text-xs tracking-wider uppercase font-mono">
                PAIMANA AI
              </span>
              <span className="text-ink-400 text-[11px] hidden sm:inline">
                Integrated Project Monitoring &amp; AI Early Warning System
              </span>
            </div>
          </div>
        </div>

        {/* Global Quick Search */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              placeholder="Search 1,250+ projects by ID, Name, Ministry, Agency or State..."
              value={filters.search_query}
              onChange={e => setFilters(prev => ({ ...prev, search_query: e.target.value }))}
              onFocus={() => setCurrentView('PROJECTS')}
              className="w-full bg-ink-900 border border-ink-700 text-xs rounded-lg pl-9 pr-3 py-1.5 text-white placeholder-ink-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Right Tools: Alerts, Report Generation & Officer Role Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Early Warning Alert Quick Trigger */}
          <button
            onClick={() => setCurrentView('EARLY_WARNING')}
            className="relative p-2 rounded-lg bg-ink-900 hover:bg-ink-800 border border-ink-700 text-ink-200 transition-colors"
            title="Early Warning Alert Feed"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-ink-950 animate-pulse">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {/* Executive Report Download Modal */}
          <button
            onClick={() => setActiveReportModal(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold shadow-sm transition-all border border-emerald-500"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Generate Report</span>
          </button>

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-ink-900 hover:bg-ink-800 border border-ink-700 text-xs text-ink-100"
            >
              <User className="w-3.5 h-3.5 text-champagne-300" />
              <div className="text-left hidden md:block">
                <div className="text-[10px] text-ink-400 uppercase tracking-wider font-semibold">Active Role</div>
                <div className="font-semibold text-xs leading-none mt-0.5">
                  {userRole === 'GOVERNMENT_ADMIN' ? 'Govt Admin' : userRole === 'MONITORING_OFFICER' ? 'Monitoring Officer' : 'Senior Analyst'}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-ink-400" />
            </button>

            {roleMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-72 bg-ink-900 border border-ink-700 rounded-lg shadow-2xl py-1 z-50 divide-y divide-ink-800"
                onMouseLeave={() => setRoleMenuOpen(false)}
              >
                <div className="px-3 py-2 text-[11px] text-ink-400 font-medium bg-ink-950/50">
                  Switch Active Governance Persona:
                </div>
                {rolesList.map(r => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setUserRole(r.id);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 hover:bg-ink-800 text-xs transition-colors ${
                      userRole === r.id ? 'bg-emerald-950/40 text-emerald-300 font-semibold border-l-2 border-emerald-500' : 'text-ink-200'
                    }`}
                  >
                    <div className="font-bold">{r.title}</div>
                    <div className="text-[11px] text-ink-400 mt-0.5">{r.subtitle}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
