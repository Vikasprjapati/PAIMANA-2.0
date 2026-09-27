import React from 'react';
import { useProjectContext, NavigationView } from '../../context/ProjectContext';
import {
  LayoutDashboard,
  FolderGit2,
  FileText,
  Network,
  AlertTriangle,
  GitCompare,
  BarChart3,
  Sliders,
  Bot,
  Database,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, projects, earlyWarningAlerts } = useProjectContext();

  const criticalProjectsCount = projects.filter(p => p.risk_level === 'CRITICAL').length;
  const unreadAlertsCount = earlyWarningAlerts.filter(a => a.status === 'UNREAD').length;
  const dataQualityWatchCount = projects.filter(p => p.data_quality_grade !== 'GOOD').length;

  const navItems: {
    id: NavigationView;
    label: string;
    description: string;
    icon: React.ReactNode;
    badge?: number | string;
    badgeColor?: string;
  }[] = [
    {
      id: 'DASHBOARD',
      label: 'Monitoring Command',
      description: 'National portfolio overview & KPIs',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'PROJECTS',
      label: 'Projects Registry',
      description: '1,250+ Filterable infrastructure assets',
      icon: <FolderGit2 className="w-4 h-4" />,
      badge: projects.length,
      badgeColor: 'bg-ink-800 text-ink-300'
    },
    {
      id: 'PROJECT_DETAIL',
      label: 'Project Deep Profile',
      description: 'Progress, SHAP drivers & milestones',
      icon: <FileText className="w-4 h-4" />
    },
    {
      id: 'DEPENDENCY_GRAPH',
      label: 'Dependency Intelligence',
      description: 'Bottlenecks & propagation network',
      icon: <Network className="w-4 h-4" />
    },
    {
      id: 'EARLY_WARNING',
      label: 'Early Warning Centre',
      description: 'Real-time alert feeds & escalations',
      icon: <AlertTriangle className="w-4 h-4" />,
      badge: unreadAlertsCount,
      badgeColor: 'bg-red-950 text-red-300 border border-red-800'
    },
    {
      id: 'CUF_EXPERIMENT',
      label: 'CUF vs CUF+ Monitoring',
      description: 'Predictive model evaluation lab',
      icon: <GitCompare className="w-4 h-4" />
    },
    {
      id: 'BENCHMARKING',
      label: 'Sector Benchmarking',
      description: 'Inter-ministry & peer comparisons',
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      id: 'WHAT_IF',
      label: 'What-If Simulator',
      description: 'Intervention impact forecasting',
      icon: <Sliders className="w-4 h-4" />
    },
    {
      id: 'AI_ASSISTANT',
      label: 'AI Monitoring Assistant',
      description: 'Natural language analytical intelligence',
      icon: <Bot className="w-4 h-4" />
    },
    {
      id: 'DATA_QUALITY',
      label: 'Data Quality & Staleness',
      description: 'Reporting compliance & anomalies',
      icon: <Database className="w-4 h-4" />,
      badge: dataQualityWatchCount,
      badgeColor: 'bg-amber-950 text-amber-300 border border-amber-800'
    },
    {
      id: 'AUDIT_TRAIL',
      label: 'Audit & Human Actions',
      description: 'Traceable monitoring decisions',
      icon: <ShieldAlert className="w-4 h-4" />
    }
  ];

  return (
    <aside className="w-64 bg-ink-950 text-ink-300 border-r border-ink-800 flex flex-col justify-between shrink-0 select-none">
      <div className="py-4">
        <div className="px-4 mb-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-ink-400">
            System Modules
          </div>
        </div>

        <nav className="space-y-0.5 px-2">
          {navItems.map(item => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-emerald-900/60 text-white font-semibold border border-emerald-700/60 shadow-sm'
                    : 'text-ink-300 hover:bg-ink-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`${
                      isActive ? 'text-emerald-400' : 'text-ink-400 group-hover:text-emerald-400'
                    }`}
                  >
                    {item.icon}
                  </div>
                  <div className="truncate text-left">
                    <div className="truncate leading-snug">{item.label}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-1">
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                        item.badgeColor || 'bg-ink-800 text-ink-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3 h-3 text-emerald-400" />}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer: Critical Risk Summary Card */}
      <div className="p-3 border-t border-ink-800/80 bg-ink-900/40 m-2 rounded-lg">
        <div className="flex items-center justify-between text-[11px] mb-1.5">
          <span className="text-ink-400 font-medium">Critical Risk Watch:</span>
          <span className="font-mono font-bold text-red-400">{criticalProjectsCount} Projects</span>
        </div>
        <div className="w-full bg-ink-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-red-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${(criticalProjectsCount / projects.length) * 100}%` }}
          ></div>
        </div>
        <div className="mt-2 text-[10px] text-ink-400 flex items-center justify-between">
          <span>Rule: Detect → Explain → Act</span>
          <span className="text-emerald-400 font-mono">v2.6 SIH</span>
        </div>
      </div>
    </aside>
  );
};
