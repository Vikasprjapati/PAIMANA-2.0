import React, { useState } from 'react';
import { useProjectContext } from '../../context/ProjectContext';
import { RiskBadge, StatusBadge, DataQualityBadge } from '../common/StatusBadge';
import { ExplainableAIDrivers } from '../intelligence/ExplainableAIDrivers';
import { DependencyGraph } from '../intelligence/DependencyGraph';
import {
  Calendar,
  CircleDollarSign,
  TrendingUp,
  Clock,
  Building,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Sliders,
  ShieldCheck,
  Send,
  FileText,
  ArrowLeft
} from 'lucide-react';

export const ProjectDetail: React.FC = () => {
  const {
    selectedProject,
    setCurrentView,
    addAuditAction,
    userRole
  } = useProjectContext();

  const [officerNote, setOfficerNote] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  if (!selectedProject) {
    return (
      <div className="p-8 text-center text-ink-500 bg-white rounded-xl border border-ink-200">
        <p className="font-semibold text-sm">No project selected.</p>
        <button
          onClick={() => setCurrentView('PROJECTS')}
          className="mt-2 text-xs text-emerald-700 font-bold hover:underline"
        >
          Return to Projects Registry
        </button>
      </div>
    );
  }

  const p = selectedProject;
  const hasSpendDiscrepancy = p.financial_progress_percentage - p.physical_progress_percentage >= 20;

  const handleTakeAction = (actionType: 'ACKNOWLEDGED' | 'ASSIGNED_FOR_REVIEW' | 'UNDER_ACTION' | 'RESOLVED' | 'ESCALATED') => {
    addAuditAction({
      project_id: p.project_id,
      project_name: p.project_name,
      action_type: actionType,
      notes: officerNote.trim() || `Officer executed ${actionType.replace(/_/g, ' ')} directive via PAIMANA Decision Support.`,
      evidence_snapshot: `Risk: ${p.overall_risk_score}/100 (${p.risk_level}), Physical: ${p.physical_progress_percentage}%, Financial: ${p.financial_progress_percentage}%, Delay: ${p.days_delayed}d`,
      status: actionType === 'RESOLVED' ? 'CLOSED' : 'IN_PROGRESS'
    });

    setActionSuccessMsg(`Action '${actionType.replace(/_/g, ' ')}' successfully recorded in government audit trail.`);
    setOfficerNote('');
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!officerNote.trim()) return;

    addAuditAction({
      project_id: p.project_id,
      project_name: p.project_name,
      action_type: 'NOTE_ADDED',
      notes: officerNote.trim(),
      evidence_snapshot: `Officer Note recorded under role: ${userRole}`,
      status: 'IN_PROGRESS'
    });

    setActionSuccessMsg('Officer audit note appended successfully.');
    setOfficerNote('');
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('PROJECTS')}
          className="text-xs text-ink-600 hover:text-ink-900 font-semibold flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Projects Registry</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('WHAT_IF')}
            className="px-3 py-1.5 rounded-lg bg-champagne-100 hover:bg-champagne-200 text-champagne-900 border border-champagne-300 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Sliders className="w-3.5 h-3.5 text-champagne-800" />
            <span>Launch What-If Simulator for this Project</span>
          </button>
        </div>
      </div>

      {/* Main Project Profile Header Card */}
      <div className="bg-white rounded-xl border border-ink-200 shadow-sm p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono font-bold text-sm bg-ink-900 text-champagne-300 px-2.5 py-0.5 rounded">
                {p.project_id}
              </span>
              <RiskBadge level={p.risk_level} size="md" />
              <StatusBadge status={p.project_status} />
              <DataQualityBadge grade={p.data_quality_grade} score={p.data_quality_score} />
              {p.is_showcase && (
                <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded">
                  OFFICIAL SHOWCASE ASSET
                </span>
              )}
            </div>

            <h2 className="text-xl font-bold text-ink-950 tracking-tight leading-snug">
              {p.project_name}
            </h2>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-ink-600">
              <div className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-ink-400" />
                <span className="font-semibold text-ink-900">{p.ministry}</span>
                <span>({p.department})</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <span className="text-ink-400">Agency:</span>
                <span className="font-semibold text-ink-900">{p.implementing_agency}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-ink-400" />
                <span>{p.district}, <b>{p.state}</b></span>
              </div>
            </div>
          </div>

          {/* Quick Risk Score Gauge Box */}
          <div className="flex items-center gap-4 bg-ink-50 p-3.5 rounded-xl border border-ink-200 shrink-0">
            <div className="text-center">
              <div className="text-[10px] uppercase font-bold text-ink-500">Overall Risk</div>
              <div className="text-3xl font-mono font-extrabold text-red-600 leading-tight">
                {p.overall_risk_score}
              </div>
              <div className="text-[10px] font-mono text-ink-400">Scale 0-100</div>
            </div>
            <div className="h-10 w-px bg-ink-200"></div>
            <div className="text-xs space-y-1">
              <div>
                <span className="text-ink-400">Predicted Delay: </span>
                <b className="font-mono text-red-700">+{p.predicted_delay_months} mos</b>
              </div>
              <div>
                <span className="text-ink-400">Cost Overrun: </span>
                <b className="font-mono text-amber-700">+{p.cost_overrun_percentage}%</b>
              </div>
              <div>
                <span className="text-ink-400">Model Conf: </span>
                <b className="font-mono text-emerald-700">{p.model_confidence}%</b>
              </div>
            </div>
          </div>
        </div>

        {/* 12 Detailed Primary Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 pt-3 border-t border-ink-100 text-xs">
          <div className="p-2.5 rounded-lg bg-ink-50 border border-ink-150">
            <span className="text-ink-400 block text-[10px] uppercase font-semibold">Approved Cost</span>
            <span className="font-mono font-bold text-ink-900 text-sm">
              ₹{p.approved_cost.toLocaleString()} Cr
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-ink-50 border border-ink-150">
            <span className="text-ink-400 block text-[10px] uppercase font-semibold">Revised Cost</span>
            <span className="font-mono font-bold text-ink-900 text-sm">
              ₹{p.revised_cost.toLocaleString()} Cr
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-ink-50 border border-ink-150">
            <span className="text-ink-400 block text-[10px] uppercase font-semibold">Cost Variance</span>
            <span className={`font-mono font-bold text-sm ${p.cost_variance > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
              {p.cost_variance > 0 ? `+₹${p.cost_variance.toLocaleString()} Cr` : '₹0 Cr'}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-ink-50 border border-ink-150">
            <span className="text-ink-400 block text-[10px] uppercase font-semibold">Physical Progress</span>
            <span className="font-mono font-bold text-emerald-700 text-sm">
              {p.physical_progress_percentage}%
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-ink-50 border border-ink-150">
            <span className="text-ink-400 block text-[10px] uppercase font-semibold">Financial Spend</span>
            <span className={`font-mono font-bold text-sm ${hasSpendDiscrepancy ? 'text-red-600' : 'text-ink-900'}`}>
              {p.financial_progress_percentage}%
            </span>
            {hasSpendDiscrepancy && (
              <span className="text-[9px] text-red-600 font-bold block">Front-Loaded</span>
            )}
          </div>

          <div className="p-2.5 rounded-lg bg-ink-50 border border-ink-150">
            <span className="text-ink-400 block text-[10px] uppercase font-semibold">Schedule Variance</span>
            <span className={`font-mono font-bold text-sm ${p.schedule_variance_days > 100 ? 'text-red-600' : 'text-emerald-700'}`}>
              {p.schedule_variance_days} Days
            </span>
          </div>
        </div>
      </div>

      {/* Project Timeline & Milestones */}
      <div className="bg-white rounded-xl border border-ink-200 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-ink-100">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-sm text-ink-950">
                Official Project Timeline &amp; Milestone Tracking
              </h3>
            </div>
            <p className="text-xs text-ink-500 mt-0.5">
              Original planned targets vs revised schedules; red badges highlight milestone bottlenecks
            </p>
          </div>

          <div className="text-xs text-ink-500">
            Milestones: <b className="text-ink-900">{p.milestones_completed}</b> of {p.milestones_total} completed (<b>{p.milestones_delayed}</b> delayed)
          </div>
        </div>

        {/* Chronological Milestone Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {p.milestones.map((m, idx) => {
            const isCompleted = m.status === 'COMPLETED';
            const isDelayed = m.status === 'DELAYED' || m.status === 'CRITICAL';

            return (
              <div
                key={m.id}
                className={`p-3.5 rounded-lg border text-xs space-y-2 ${
                  isCompleted
                    ? 'bg-emerald-50/50 border-emerald-300'
                    : isDelayed
                    ? 'bg-red-50/50 border-red-300 ring-1 ring-red-200'
                    : 'bg-ink-50/50 border-ink-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[11px] text-ink-500">{m.id}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      isCompleted
                        ? 'bg-emerald-200 text-emerald-900'
                        : isDelayed
                        ? 'bg-red-200 text-red-900'
                        : 'bg-sky-200 text-sky-900'
                    }`}
                  >
                    {m.status}
                  </span>
                </div>

                <div className="font-bold text-ink-900 line-clamp-2">
                  {m.name}
                </div>

                <div className="pt-2 border-t border-ink-200/60 text-[11px] space-y-1 text-ink-600">
                  <div className="flex justify-between">
                    <span>Target Date:</span>
                    <span className="font-mono font-medium">{m.target_date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Revised/Actual:</span>
                    <span className={`font-mono font-bold ${isDelayed ? 'text-red-700' : 'text-emerald-700'}`}>
                      {m.actual_date || m.revised_date}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-ink-400">
                    <span>Weightage:</span>
                    <span>{m.weightage_percentage}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SHAP-style Explainable AI Risk Attribution */}
      <ExplainableAIDrivers project={p} />

      {/* Interactive Dependency Intelligence Graph */}
      <DependencyGraph project={p} />

      {/* Recommended Government Interventions */}
      <div className="bg-white rounded-xl border border-ink-200 shadow-xs p-5 space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-ink-100">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <h3 className="font-bold text-sm text-ink-950">
            Evidence-Based Intervention Directives (Decision Support)
          </h3>
        </div>
        <p className="text-xs text-ink-500">
          Machine learning-guided recommendations for MoSPI Monitoring Authority and Line Ministry Secretariat:
        </p>

        <div className="space-y-2">
          {p.recommended_interventions.map((rec, i) => (
            <div
              key={i}
              className="p-3 rounded-lg bg-ink-50 border border-ink-200 flex items-start gap-3 text-xs text-ink-900"
            >
              <span className="w-5 h-5 rounded-full bg-ink-900 text-white flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="leading-relaxed flex-1">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Human-in-the-Loop Officer Action Console */}
      <div className="bg-white rounded-xl border border-ink-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-ink-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-ink-900 text-champagne-300">
                <FileText className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-sm text-ink-950">
                Human-in-the-Loop Officer Workflow &amp; Audit Trail
              </h3>
            </div>
            <p className="text-xs text-ink-500 mt-0.5">
              AI provides early warnings; statutory administrative decisions require accountable officer signature
            </p>
          </div>

          <span className="text-xs font-mono bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-1 rounded">
            Logged as: <b>{userRole}</b>
          </span>
        </div>

        {actionSuccessMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-lg text-xs font-medium flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        <div className="space-y-3">
          <label className="block text-xs font-semibold text-ink-800">
            Append Officer Monitoring Note or Escalation Directive:
          </label>
          <textarea
            rows={2}
            value={officerNote}
            onChange={e => setOfficerNote(e.target.value)}
            placeholder="Enter statutory inspection directives, inter-departmental notices, or fund release restrictions..."
            className="w-full text-xs p-3 rounded-lg border border-ink-300 bg-ink-50 text-ink-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleTakeAction('ACKNOWLEDGED')}
                className="px-3 py-1.5 rounded-lg bg-ink-100 hover:bg-ink-200 text-ink-800 text-xs font-semibold transition-colors"
              >
                Acknowledge Alert
              </button>
              <button
                onClick={() => handleTakeAction('ASSIGNED_FOR_REVIEW')}
                className="px-3 py-1.5 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-900 text-xs font-semibold transition-colors"
              >
                Assign Technical Audit
              </button>
              <button
                onClick={() => handleTakeAction('UNDER_ACTION')}
                className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-semibold transition-colors"
              >
                Mark Under Action
              </button>
              <button
                onClick={() => handleTakeAction('ESCALATED')}
                className="px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-900 text-xs font-semibold transition-colors"
              >
                Escalate to Line Ministry
              </button>
              <button
                onClick={() => handleTakeAction('RESOLVED')}
                className="px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-semibold transition-colors"
              >
                Resolve &amp; Close
              </button>
            </div>

            <button
              onClick={handleAddNote}
              disabled={!officerNote.trim()}
              className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Record Audit Note</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
