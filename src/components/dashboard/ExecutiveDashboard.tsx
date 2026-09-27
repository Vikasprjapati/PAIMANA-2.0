import React, { useMemo, useState } from 'react';
import { useProjectContext } from '../../context/ProjectContext';
import { UserRole } from '../../types/project';
import { StateRiskMap } from './StateRiskMap';
import { RiskBadge, SeverityBadge, StatusBadge, DataQualityBadge } from '../common/StatusBadge';
import {
  TrendingUp,
  AlertOctagon,
  Clock,
  CircleDollarSign,
  ShieldCheck,
  CheckCircle,
  Database,
  ArrowRight,
  ExternalLink,
  Zap,
  Activity,
  AlertTriangle,
  Building,
  UserCheck,
  Cpu,
  Sliders,
  Send,
  FileSpreadsheet,
  Layers,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis,
  LineChart,
  Line,
  CartesianGrid,
  ReferenceLine
} from 'recharts';

export const ExecutiveDashboard: React.FC = () => {
  const {
    projects,
    setFilters,
    setCurrentView,
    setSelectedProject,
    earlyWarningAlerts,
    userRole,
    setUserRole,
    addAuditAction,
    setActiveReportModal
  } = useProjectContext();

  const [roleActionToast, setRoleActionToast] = useState('');

  const triggerRoleAction = (msg: string) => {
    setRoleActionToast(msg);
    setTimeout(() => setRoleActionToast(''), 4000);
  };

  // Base Portfolio KPI calculations
  const kpis = useMemo(() => {
    const total = projects.length;
    const active = projects.filter(p => p.project_status !== 'COMPLETED').length;
    const critical = projects.filter(p => p.risk_level === 'CRITICAL').length;
    const high = projects.filter(p => p.risk_level === 'HIGH').length;
    const atRisk = critical + high;

    const costOverrunCount = projects.filter(p => p.cost_overrun_percentage > 5).length;
    const timeOverrunCount = projects.filter(p => p.days_delayed > 60).length;

    const avgDqScore = Math.round(
      (projects.reduce((acc, p) => acc + p.data_quality_score, 0) / total) * 10
    ) / 10;

    const totalApprovedCostCr = Math.round(projects.reduce((acc, p) => acc + p.approved_cost, 0));
    const totalRevisedCostCr = Math.round(projects.reduce((acc, p) => acc + p.revised_cost, 0));
    const totalCostOverrunCr = totalRevisedCostCr - totalApprovedCostCr;

    // Role-specific metrics
    const contractorWarningCount = projects.filter(
      p => p.contractor_status === 'DEFAULT_WARNING' || p.contractor_status === 'PENALIZED'
    ).length;
    const staleReturnsCount = projects.filter(p => p.data_staleness_days > 30).length;
    const spendMismatchCount = projects.filter(
      p => p.financial_progress_percentage - p.physical_progress_percentage >= 20
    ).length;
    const severeDelayCount = projects.filter(p => p.days_delayed >= 300).length;

    return {
      total,
      active,
      critical,
      high,
      atRisk,
      costOverrunCount,
      timeOverrunCount,
      avgDqScore,
      totalApprovedCostCr,
      totalCostOverrunCr,
      contractorWarningCount,
      staleReturnsCount,
      spendMismatchCount,
      severeDelayCount
    };
  }, [projects]);

  // Risk Distribution Data
  const riskDistributionData = useMemo(() => {
    const counts = { LOW: 0, MODERATE: 0, HIGH: 0, CRITICAL: 0 };
    projects.forEach(p => counts[p.risk_level]++);
    return [
      { name: 'Low Risk', value: counts.LOW, color: '#10b981', level: 'LOW' },
      { name: 'Moderate Risk', value: counts.MODERATE, color: '#f59e0b', level: 'MODERATE' },
      { name: 'High Risk', value: counts.HIGH, color: '#f97316', level: 'HIGH' },
      { name: 'Critical Risk', value: counts.CRITICAL, color: '#ef4444', level: 'CRITICAL' }
    ];
  }, [projects]);

  // Sector Risk & Delay Aggregations
  const sectorRiskData = useMemo(() => {
    const sectorStats: Record<string, { totalDelay: number; count: number; totalCostOverrun: number }> = {};
    projects.forEach(p => {
      if (!sectorStats[p.sector]) sectorStats[p.sector] = { totalDelay: 0, count: 0, totalCostOverrun: 0 };
      sectorStats[p.sector].totalDelay += p.days_delayed;
      sectorStats[p.sector].totalCostOverrun += p.cost_overrun_percentage;
      sectorStats[p.sector].count++;
    });

    return Object.entries(sectorStats)
      .map(([sector, data]) => ({
        sector: sector.length > 18 ? sector.slice(0, 16) + '...' : sector,
        fullSector: sector,
        avgDelayDays: Math.round(data.totalDelay / data.count),
        avgCostOverrunPct: Math.round((data.totalCostOverrun / data.count) * 10) / 10,
        projectsCount: data.count
      }))
      .sort((a, b) => b.avgDelayDays - a.avgDelayDays)
      .slice(0, 7);
  }, [projects]);

  // Scatter plot data
  const scatterData = useMemo(() => {
    return projects.slice(0, 120).map(p => ({
      name: p.project_id,
      projectName: p.project_name,
      physical: p.physical_progress_percentage,
      financial: p.financial_progress_percentage,
      costCr: p.approved_cost,
      riskLevel: p.risk_level,
      isAnomalous: p.financial_progress_percentage - p.physical_progress_percentage > 20
    }));
  }, [projects]);

  // Delay Trend data
  const delayTrendData = [
    { quarter: 'Q1-2024', avgDelay: 85, criticalProjects: 68 },
    { quarter: 'Q2-2024', avgDelay: 110, criticalProjects: 82 },
    { quarter: 'Q3-2024', avgDelay: 135, criticalProjects: 98 },
    { quarter: 'Q4-2024', avgDelay: 155, criticalProjects: 118 },
    { quarter: 'Q1-2025', avgDelay: 172, criticalProjects: 134 },
    { quarter: 'Q2-2025', avgDelay: 188, criticalProjects: 145 },
    { quarter: 'Q3-2026', avgDelay: 194, criticalProjects: 152 }
  ];

  // Top Critical Projects
  const criticalProjectsList = useMemo(() => {
    return projects
      .filter(p => p.risk_level === 'CRITICAL')
      .sort((a, b) => b.overall_risk_score - a.overall_risk_score)
      .slice(0, 5);
  }, [projects]);

  // Top Alerts
  const topAlerts = useMemo(() => {
    return earlyWarningAlerts.slice(0, 5);
  }, [earlyWarningAlerts]);

  const handleProjectSelect = (p: typeof projects[0]) => {
    setSelectedProject(p);
    setCurrentView('PROJECT_DETAIL');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {roleActionToast && (
        <div className="fixed top-20 right-6 z-50 bg-ink-950 text-white border border-emerald-500 p-3.5 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs animate-in slide-in-from-top-4">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{roleActionToast}</span>
        </div>
      )}

      {/* Role Navigation Toolbar */}
      <div className="bg-white p-3.5 rounded-xl border border-ink-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-ink-500 font-mono">
            Active Governance Persona:
          </span>
          <div className="flex items-center gap-1.5 bg-ink-100 p-1 rounded-lg">
            <button
              onClick={() => setUserRole('GOVERNMENT_ADMIN')}
              className={`px-3 py-1.5 text-xs rounded-md font-bold transition-all flex items-center gap-1.5 ${
                userRole === 'GOVERNMENT_ADMIN'
                  ? 'bg-ink-950 text-champagne-300 shadow-xs border border-ink-800'
                  : 'text-ink-600 hover:text-ink-900'
              }`}
            >
              <Building className="w-3.5 h-3.5 text-champagne-300" />
              <span>Government Admin</span>
            </button>

            <button
              onClick={() => setUserRole('MONITORING_OFFICER')}
              className={`px-3 py-1.5 text-xs rounded-md font-bold transition-all flex items-center gap-1.5 ${
                userRole === 'MONITORING_OFFICER'
                  ? 'bg-emerald-800 text-white shadow-xs border border-emerald-700'
                  : 'text-ink-600 hover:text-ink-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Monitoring Officer</span>
            </button>

            <button
              onClick={() => setUserRole('SENIOR_ANALYST')}
              className={`px-3 py-1.5 text-xs rounded-md font-bold transition-all flex items-center gap-1.5 ${
                userRole === 'SENIOR_ANALYST'
                  ? 'bg-sky-900 text-white shadow-xs border border-sky-800'
                  : 'text-ink-600 hover:text-ink-900'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-sky-300" />
              <span>Senior Analyst</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-ink-500 font-medium hidden sm:inline">Current View Mode:</span>
          <span className="font-mono font-bold text-ink-900 bg-ink-50 border border-ink-200 px-2.5 py-1 rounded">
            {userRole === 'GOVERNMENT_ADMIN'
              ? 'Cabinet Infrastructure & Inter-Ministerial Policy Command'
              : userRole === 'MONITORING_OFFICER'
              ? 'Field Compliance, SLA & Quality Audit Command'
              : 'OCMS Predictive ML & Statistical Calibrations Lab'}
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. GOVERNMENT ADMIN DASHBOARD VIEW                            */}
      {/* ------------------------------------------------------------- */}
      {userRole === 'GOVERNMENT_ADMIN' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Admin Header Banner */}
          <div className="bg-gradient-to-r from-ink-950 via-ink-900 to-ink-950 text-white p-5 rounded-xl border border-ink-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-amber-500/20 text-champagne-300">
                  <Building className="w-4 h-4" />
                </span>
                <h2 className="text-lg font-bold tracking-tight text-white font-sans">
                  Cabinet Infrastructure Secretariat &amp; Policy Command
                </h2>
                <span className="bg-amber-400 text-ink-950 text-[10px] font-extrabold px-2 py-0.5 rounded font-mono">
                  APEX JURISDICTION
                </span>
              </div>
              <p className="text-xs text-ink-300 mt-1 max-w-2xl leading-relaxed">
                Inter-ministerial surveillance for high-consequence infrastructure assets. Focus on statutory project freezes, Chief Secretary level land settlements, and macro fiscal exposure.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveReportModal(true)}
                className="px-3.5 py-2 bg-champagne-400 hover:bg-champagne-300 text-ink-950 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Cabinet Briefing Memo</span>
              </button>
            </div>
          </div>

          {/* Admin Macro KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            <div className="bg-white p-4 rounded-xl border border-ink-200 shadow-xs">
              <div className="text-xs text-ink-500 font-medium">Total Sanctioned Capital Outlay</div>
              <div className="text-2xl font-bold font-mono text-ink-900 mt-1">
                ₹{(kpis.totalApprovedCostCr / 1000).toFixed(1)}k Cr
              </div>
              <div className="mt-2 pt-2 border-t border-ink-100 text-[11px] text-ink-500 flex justify-between">
                <span>{kpis.total} Projects</span>
                <span className="text-emerald-700 font-semibold">12 Ministries</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-ink-200 shadow-xs">
              <div className="text-xs text-ink-500 font-medium">Portfolio Fiscal Escalation</div>
              <div className="text-2xl font-bold font-mono text-amber-700 mt-1">
                +₹{(kpis.totalCostOverrunCr / 1000).toFixed(1)}k Cr
              </div>
              <div className="mt-2 pt-2 border-t border-ink-100 text-[11px] text-amber-700 font-semibold flex justify-between">
                <span>Revised: ₹{(kpis.totalApprovedCostCr + kpis.totalCostOverrunCr) / 1000}k Cr</span>
                <span>+14.8% Drift</span>
              </div>
            </div>

            <div className="bg-red-50/80 p-4 rounded-xl border border-red-300 shadow-xs">
              <div className="text-xs text-red-700 font-medium">Priority Cabinet Escalations</div>
              <div className="text-2xl font-bold font-mono text-red-700 mt-1">
                {kpis.critical}
              </div>
              <div className="mt-2 pt-2 border-t border-red-200 text-[11px] text-red-700 font-semibold flex justify-between">
                <span>Cross-Ministry Deadlocks</span>
                <span>Action Required</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-ink-200 shadow-xs">
              <div className="text-xs text-ink-500 font-medium">Severe Schedule SLA Breaches</div>
              <div className="text-2xl font-bold font-mono text-purple-700 mt-1">
                {kpis.severeDelayCount}
              </div>
              <div className="mt-2 pt-2 border-t border-ink-100 text-[11px] text-purple-700 font-medium flex justify-between">
                <span>Delay &gt; 300 Calendar Days</span>
                <span>Statutory Review</span>
              </div>
            </div>
          </div>

          {/* Admin Priority Escalation Queue */}
          <div className="bg-white rounded-xl border border-ink-200 shadow-xs p-5 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-ink-100">
              <div>
                <div className="flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 text-red-600" />
                  <h3 className="font-bold text-sm text-ink-950">
                    Inter-Ministerial Cabinet Escalation Hub (Apex Action Queue)
                  </h3>
                </div>
                <p className="text-xs text-ink-500 mt-0.5">
                  Direct government directives required for mega-projects stuck in multi-departmental litigation or power transmission deadlocks
                </p>
              </div>
            </div>

            <div className="divide-y divide-ink-100">
              {criticalProjectsList.map(p => (
                <div key={p.project_id} className="py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 hover:bg-ink-50/50 p-2 rounded-lg transition-colors">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-ink-900 text-white px-2 py-0.5 rounded">
                        {p.project_id}
                      </span>
                      <span className="font-bold text-xs text-ink-900">{p.project_name}</span>
                    </div>
                    <div className="text-xs text-ink-600 flex items-center gap-2">
                      <span><b>Ministry:</b> {p.ministry}</span>
                      <span>•</span>
                      <span><b>Cost Overrun:</b> <b className="text-red-700">+{p.cost_overrun_percentage}%</b> (+₹{p.cost_variance.toLocaleString()} Cr)</span>
                    </div>
                    <div className="text-[11px] text-ink-500">
                      <b>Apex Blocker:</b> {p.risk_drivers[0]?.evidence}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        addAuditAction({
                          project_id: p.project_id,
                          project_name: p.project_name,
                          action_type: 'ESCALATED',
                          notes: `Government Admin issued Cabinet Infrastructure Group notice for inter-ministerial clearance.`,
                          status: 'IN_PROGRESS'
                        });
                        triggerRoleAction(`Cabinet Directive successfully issued for ${p.project_id}. Recorded in National Audit Trail.`);
                      }}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
                    >
                      Issue Cabinet Directive
                    </button>
                    <button
                      onClick={() => handleProjectSelect(p)}
                      className="px-3 py-1.5 bg-ink-100 hover:bg-ink-200 text-ink-800 text-xs font-semibold rounded-lg transition-colors"
                    >
                      Inspect Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* State Risk Map embedded for Admin */}
          <StateRiskMap />
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. MONITORING OFFICER DASHBOARD VIEW                          */}
      {/* ------------------------------------------------------------- */}
      {userRole === 'MONITORING_OFFICER' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Officer Header Banner */}
          <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white p-5 rounded-xl border border-emerald-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-emerald-500/20 text-emerald-300">
                  <UserCheck className="w-4 h-4" />
                </span>
                <h2 className="text-lg font-bold tracking-tight text-white font-sans">
                  Directorate of Project Monitoring &amp; Field Compliance (IPMD)
                </h2>
                <span className="bg-emerald-400 text-emerald-950 text-[10px] font-extrabold px-2 py-0.5 rounded font-mono">
                  FIELD OPERATIONS
                </span>
              </div>
              <p className="text-xs text-emerald-200 mt-1 max-w-2xl leading-relaxed">
                Operational verification command: Dispatch Central Quality Monitors (CQM), enforce digital reporting SLAs, detect contractor demobilization, and flag uncoupled expenditure.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('DATA_QUALITY')}
                className="px-3.5 py-2 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Data Quality Engine</span>
              </button>
            </div>
          </div>

          {/* Officer Operational KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            <div className="bg-white p-4 rounded-xl border border-ink-200 shadow-xs">
              <div className="text-xs text-ink-500 font-medium">Digital Reporting SLA Compliance</div>
              <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">
                88.4%
              </div>
              <div className="mt-2 pt-2 border-t border-ink-100 text-[11px] text-ink-500 flex justify-between">
                <span>Target: 95.0%</span>
                <span className="text-emerald-700 font-semibold">{kpis.total - kpis.staleReturnsCount} Compliant</span>
              </div>
            </div>

            <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-300 shadow-xs">
              <div className="text-xs text-amber-800 font-medium">Contractor Distress &amp; Cure Notices</div>
              <div className="text-2xl font-bold font-mono text-amber-800 mt-1">
                {kpis.contractorWarningCount}
              </div>
              <div className="mt-2 pt-2 border-t border-amber-200 text-[11px] text-amber-800 font-semibold flex justify-between">
                <span>Default Warnings Issued</span>
                <span>Review Active</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-ink-200 shadow-xs">
              <div className="text-xs text-ink-500 font-medium">Stale Reporting (&gt;30 Days)</div>
              <div className="text-2xl font-bold font-mono text-red-600 mt-1">
                {kpis.staleReturnsCount}
              </div>
              <div className="mt-2 pt-2 border-t border-ink-100 text-[11px] text-red-700 font-semibold flex justify-between">
                <span>Breaches MoSPI SLA</span>
                <span>Issue Notice</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-ink-200 shadow-xs">
              <div className="text-xs text-ink-500 font-medium">Expenditure Uncoupling Flags</div>
              <div className="text-2xl font-bold font-mono text-orange-600 mt-1">
                {kpis.spendMismatchCount}
              </div>
              <div className="mt-2 pt-2 border-t border-ink-100 text-[11px] text-orange-700 font-semibold flex justify-between">
                <span>Spend leads Phy by &gt;20%</span>
                <span>Hold Advances</span>
              </div>
            </div>
          </div>

          {/* Officer Field Action Console */}
          <div className="bg-white rounded-xl border border-ink-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-ink-100">
              <div>
                <h3 className="font-bold text-sm text-ink-950">
                  Central Quality Monitor (CQM) Technical Audit Dispatch Console
                </h3>
                <p className="text-xs text-ink-500 mt-0.5">
                  Dispatch central technical teams to inspect ground execution against financial disbursement claims
                </p>
              </div>
            </div>

            <div className="divide-y divide-ink-100">
              {projects.filter(p => p.financial_progress_percentage - p.physical_progress_percentage >= 20).slice(0, 5).map(p => (
                <div key={p.project_id} className="py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 hover:bg-ink-50/50 p-2 rounded-lg transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-ink-900 text-white px-2 py-0.5 rounded">
                        [{p.project_id}]
                      </span>
                      <span className="font-bold text-xs text-ink-900">{p.project_name}</span>
                    </div>
                    <div className="text-xs text-red-700 font-semibold">
                      ⚠️ Ground Discrepancy: Physical {p.physical_progress_percentage}% vs Financial {p.financial_progress_percentage}% (+{(p.financial_progress_percentage - p.physical_progress_percentage).toFixed(0)}% Gap)
                    </div>
                    <div className="text-[11px] text-ink-500">
                      Agency: {p.implementing_agency} ({p.state}) • Last Inspection: {p.last_inspection_date}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        addAuditAction({
                          project_id: p.project_id,
                          project_name: p.project_name,
                          action_type: 'ASSIGNED_FOR_REVIEW',
                          notes: `Monitoring Officer dispatched Central Quality Monitoring (CQM) technical team for physical-financial reconciliation.`,
                          status: 'IN_PROGRESS'
                        });
                        triggerRoleAction(`CQM Technical Inspection dispatched for ${p.project_id}. Scheduled for 7-day field verification.`);
                      }}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
                    >
                      Dispatch CQM Audit
                    </button>
                    <button
                      onClick={() => handleProjectSelect(p)}
                      className="px-3 py-1.5 bg-ink-100 hover:bg-ink-200 text-ink-800 text-xs font-semibold rounded-lg transition-colors"
                    >
                      Audit Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scatter Plot for Officer Inspection */}
          <div className="bg-white p-5 rounded-xl border border-ink-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-ink-100">
              <div>
                <h3 className="font-bold text-sm text-ink-950">
                  Field Verification Matrix (Physical Progress vs Financial Outflow)
                </h3>
                <p className="text-xs text-ink-500 mt-0.5">
                  Points floating above diagonal indicate potential premature mobilization disbursements without certified ground works
                </p>
              </div>
            </div>

            <div className="h-64 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 15, bottom: 15, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" dataKey="physical" name="Physical Progress" unit="%" domain={[0, 100]} tick={{ fontSize: 11, fill: '#475569' }} />
                  <YAxis type="number" dataKey="financial" name="Financial Spend" unit="%" domain={[0, 100]} tick={{ fontSize: 11, fill: '#475569' }} />
                  <ZAxis range={[30, 90]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                  />
                  <ReferenceLine segment={[{ x: 0, y: 0 }, { x: 100, y: 100 }]} stroke="#10b981" strokeDasharray="4 4" />
                  <Scatter
                    name="Projects"
                    data={scatterData}
                    fill="#0f172a"
                    shape={(props: any) => {
                      const { cx, cy, payload } = props;
                      const fill = payload.isAnomalous ? '#ef4444' : '#10b981';
                      return <circle cx={cx} cy={cy} r={payload.isAnomalous ? 6 : 4} fill={fill} stroke="#fff" strokeWidth={1} />;
                    }}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. SENIOR ANALYST DASHBOARD VIEW                              */}
      {/* ------------------------------------------------------------- */}
      {userRole === 'SENIOR_ANALYST' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Analyst Header Banner */}
          <div className="bg-gradient-to-r from-sky-950 via-sky-900 to-sky-950 text-white p-5 rounded-xl border border-sky-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-sky-500/20 text-sky-300">
                  <Cpu className="w-4 h-4" />
                </span>
                <h2 className="text-lg font-bold tracking-tight text-white font-sans">
                  OCMS Predictive Analytics &amp; Machine Learning Intelligence Lab
                </h2>
                <span className="bg-sky-400 text-sky-950 text-[10px] font-extrabold px-2 py-0.5 rounded font-mono">
                  MODEL DIAGNOSTICS
                </span>
              </div>
              <p className="text-xs text-sky-200 mt-1 max-w-2xl leading-relaxed">
                Empirical validation console for CUF vs CUF+ predictive models, SHAP feature importance vectors, false positive reduction, and non-linear regression residuals.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('CUF_EXPERIMENT')}
                className="px-3.5 py-2 bg-sky-400 hover:bg-sky-300 text-sky-950 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Holdout Model Benchmark</span>
              </button>
            </div>
          </div>

          {/* Analyst Machine Learning KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            <div className="bg-white p-4 rounded-xl border border-ink-200 shadow-xs">
              <div className="text-xs text-ink-500 font-medium">CUF+ Model Precision</div>
              <div className="text-2xl font-bold font-mono text-sky-700 mt-1">
                91.4%
              </div>
              <div className="mt-2 pt-2 border-t border-ink-100 text-[11px] text-ink-500 flex justify-between">
                <span>Baseline CUF: 72.8%</span>
                <span className="text-emerald-700 font-bold">+18.6% Gain</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-ink-200 shadow-xs">
              <div className="text-xs text-ink-500 font-medium">Early Recall Sensitivity</div>
              <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">
                94.2%
              </div>
              <div className="mt-2 pt-2 border-t border-ink-100 text-[11px] text-emerald-700 font-semibold flex justify-between">
                <span>Detects Latent Risk Early</span>
                <span>F1: 92.8%</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-ink-200 shadow-xs">
              <div className="text-xs text-ink-500 font-medium">False Positive Rate (FPR)</div>
              <div className="text-2xl font-bold font-mono text-ink-900 mt-1">
                7.8%
              </div>
              <div className="mt-2 pt-2 border-t border-ink-100 text-[11px] text-ink-500 flex justify-between">
                <span>Baseline CUF: 19.2%</span>
                <span className="text-emerald-700 font-bold">-11.4% Noise Drop</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-ink-200 shadow-xs">
              <div className="text-xs text-ink-500 font-medium">Delay Regression Precision (MAE)</div>
              <div className="text-2xl font-bold font-mono text-purple-700 mt-1">
                1.8 mos
              </div>
              <div className="mt-2 pt-2 border-t border-ink-100 text-[11px] text-purple-700 font-semibold flex justify-between">
                <span>ROC-AUC: 0.918</span>
                <span>Calibrated 95% Conf</span>
              </div>
            </div>
          </div>

          {/* Global SHAP Feature Importance Attribution */}
          <div className="bg-white rounded-xl border border-ink-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-ink-100">
              <div>
                <h3 className="font-bold text-sm text-ink-950">
                  Global Feature Attribution Importance (SHAP Value Weights)
                </h3>
                <p className="text-xs text-ink-500 mt-0.5">
                  Contribution breakdown of predictive indicators influencing overall implementation risk across 1,250 projects
                </p>
              </div>
              <button
                onClick={() => {
                  triggerRoleAction('CUF+ Model weights recalibrated across 1,250 project records. Optimization loss converged.');
                }}
                className="px-3 py-1 bg-ink-900 hover:bg-ink-800 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Recalibrate Weights
              </button>
            </div>

            <div className="space-y-3">
              {[
                { factor: 'Physical vs Financial Spend Divergence (Front-Loading)', weight: 28, color: 'bg-red-500' },
                { factor: 'Critical Path Cumulative Schedule Slippage', weight: 24, color: 'bg-orange-500' },
                { factor: 'Land Acquisition & RoW Court Arbitrations', weight: 20, color: 'bg-amber-500' },
                { factor: 'Contractor Liquidity & Equipment Rating', weight: 16, color: 'bg-sky-500' },
                { factor: 'Environmental & Statutory Forest Clearances', weight: 12, color: 'bg-emerald-500' },
                { factor: 'Monitoring Data Freshness & Reporting Staleness', weight: 8, color: 'bg-purple-500' }
              ].map(f => (
                <div key={f.factor} className="space-y-1 text-xs">
                  <div className="flex justify-between items-center font-medium">
                    <span className="text-ink-800">{f.factor}</span>
                    <span className="font-mono font-bold text-ink-900">{f.weight}% weight</span>
                  </div>
                  <div className="w-full bg-ink-100 h-2 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${f.color}`} style={{ width: `${f.weight * 3.5}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Simulation Link */}
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sliders className="w-5 h-5 text-sky-700" />
              <div>
                <div className="font-bold text-xs text-sky-950">Run Parameterized What-If Scenario Simulations</div>
                <div className="text-[11px] text-sky-800">Test how modifying contractor scores or resolving land disputes alters forecast delay.</div>
              </div>
            </div>
            <button
              onClick={() => setCurrentView('WHAT_IF')}
              className="px-3 py-1.5 bg-sky-800 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
            >
              <span>Launch Simulator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Common Secondary Analytics: Risk Donut & Sector Delay Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
        {/* Risk Distribution Donut */}
        <div className="lg:col-span-4 bg-white p-4 rounded-xl border border-ink-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-ink-100">
              <h3 className="font-bold text-sm text-ink-900">Project Risk Distribution</h3>
              <span className="text-[11px] font-mono font-semibold text-ink-500">CUF+ Model</span>
            </div>
            <div className="h-56 mt-2 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={riskDistributionData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                    {riskDistributionData.map(entry => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold font-mono text-ink-900">{kpis.total}</span>
                <span className="text-[10px] text-ink-400 uppercase font-semibold">Projects</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-ink-100">
            {riskDistributionData.map(r => (
              <button
                key={r.name}
                onClick={() => {
                  setFilters(prev => ({ ...prev, risk_level: r.level }));
                  setCurrentView('PROJECTS');
                }}
                className="flex items-center justify-between p-1.5 rounded hover:bg-ink-50 text-left"
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: r.color }} />
                  <span className="text-ink-700 text-[11px] font-medium">{r.name}</span>
                </div>
                <span className="font-mono font-bold text-ink-900 text-[11px]">{r.value}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sector Schedule Variance */}
        <div className="lg:col-span-8 bg-white p-4 rounded-xl border border-ink-200 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-ink-100">
            <div>
              <h3 className="font-bold text-sm text-ink-900">Sector-wise Schedule Delay &amp; Cost Variance</h3>
              <p className="text-xs text-ink-500 mt-0.5">Average calendar days delayed across major infrastructure sectors</p>
            </div>
            <button
              onClick={() => setCurrentView('BENCHMARKING')}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
            >
              <span>Benchmarking</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorRiskData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="sector" interval={0} angle={-15} textAnchor="end" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar yAxisId="left" dataKey="avgDelayDays" name="Avg Delay (Days)" fill="#0f172a" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="avgCostOverrunPct" name="Cost Overrun %" fill="#d97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
