import React, { useState } from 'react';
import { useProjectContext } from '../../context/ProjectContext';
import { EarlyWarningAlert, AlertSeverity } from '../../types/project';
import { SeverityBadge } from '../common/StatusBadge';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Filter,
  ShieldAlert,
  ArrowRight,
  Send,
  Eye
} from 'lucide-react';

export const EarlyWarningCenter: React.FC = () => {
  const {
    earlyWarningAlerts,
    updateAlertStatus,
    projects,
    setSelectedProject,
    setCurrentView,
    addAuditAction
  } = useProjectContext();

  const [severityFilter, setSeverityFilter] = useState<'ALL' | AlertSeverity>('ALL');

  const filteredAlerts = severityFilter === 'ALL'
    ? earlyWarningAlerts
    : earlyWarningAlerts.filter(a => a.severity === severityFilter);

  const handleAction = (alert: EarlyWarningAlert, newStatus: EarlyWarningAlert['status']) => {
    updateAlertStatus(alert.id, newStatus);
    addAuditAction({
      project_id: alert.project_id,
      project_name: alert.project_name,
      action_type: newStatus === 'ACKNOWLEDGED' ? 'ACKNOWLEDGED' : newStatus === 'IN_PROGRESS' ? 'ASSIGNED_FOR_REVIEW' : 'RESOLVED',
      notes: `Alert '${alert.trigger}' transitioned to ${newStatus}. Recommended intervention: ${alert.recommended_action}`,
      evidence_snapshot: alert.evidence,
      status: newStatus === 'RESOLVED' ? 'CLOSED' : 'IN_PROGRESS'
    });
  };

  const handleInspect = (projectId: string) => {
    const target = projects.find(p => p.project_id === projectId);
    if (target) {
      setSelectedProject(target);
      setCurrentView('PROJECT_DETAIL');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Title Header */}
      <div className="bg-white p-5 rounded-xl border border-ink-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-red-100 text-red-700">
              <ShieldAlert className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-ink-950 tracking-tight">
              MoSPI Early Warning Alert Centre &amp; Escalation Hub
            </h2>
            <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {earlyWarningAlerts.length} Active System Alerts
            </span>
          </div>
          <p className="text-xs text-ink-500 mt-0.5">
            Automated multi-tier alert engine detecting schedule drift, disbursement divergence, contractor distress, and data staleness
          </p>
        </div>

        {/* Severity Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'WATCH'] as const).map(sev => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all ${
                severityFilter === sev
                  ? sev === 'CRITICAL'
                    ? 'bg-red-600 text-white shadow-xs'
                    : sev === 'HIGH'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : sev === 'MEDIUM'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : sev === 'WATCH'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-ink-900 text-white shadow-xs'
                  : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Feed Cards */}
      <div className="space-y-3.5">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map(alert => (
            <div
              key={alert.id}
              className={`bg-white rounded-xl border p-4 shadow-2xs space-y-3 transition-all ${
                alert.status === 'RESOLVED'
                  ? 'opacity-60 border-ink-200'
                  : alert.severity === 'CRITICAL'
                  ? 'border-red-300 hover:border-red-500'
                  : alert.severity === 'HIGH'
                  ? 'border-orange-300 hover:border-orange-500'
                  : 'border-ink-200 hover:border-ink-400'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-ink-100">
                <div className="flex items-center gap-2.5">
                  <SeverityBadge severity={alert.severity} />
                  <span className="font-mono font-bold text-xs text-ink-950">
                    [{alert.project_id}]
                  </span>
                  <span className="text-xs font-bold text-ink-800">
                    {alert.project_name}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-ink-400 font-mono">
                  <span>Detected: {alert.detected_date}</span>
                  <span className="text-ink-300">•</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase font-mono ${
                      alert.status === 'UNREAD'
                        ? 'bg-red-100 text-red-800'
                        : alert.status === 'IN_PROGRESS'
                        ? 'bg-sky-100 text-sky-800'
                        : alert.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-ink-100 text-ink-700'
                    }`}
                  >
                    {alert.status}
                  </span>
                </div>
              </div>

              {/* Trigger & Evidence */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-ink-50 border border-ink-150 space-y-1">
                  <div className="font-bold text-ink-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>System Anomaly Trigger:</span>
                  </div>
                  <p className="text-[11px] text-ink-700 leading-relaxed font-sans font-medium">
                    {alert.trigger}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-ink-50 border border-ink-150 space-y-1">
                  <div className="font-bold text-ink-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Empirical Supporting Evidence:</span>
                  </div>
                  <p className="text-[11px] text-ink-600 leading-relaxed font-sans">
                    {alert.evidence}
                  </p>
                </div>
              </div>

              {/* Recommended Action */}
              <div className="p-3 rounded-lg bg-champagne-50 border border-champagne-200 text-xs">
                <span className="font-bold text-champagne-950 block">Recommended MoSPI Intervention Directive:</span>
                <p className="text-[11px] text-ink-800 mt-0.5 leading-relaxed font-sans">
                  {alert.recommended_action}
                </p>
              </div>

              {/* Officer Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  {alert.status === 'UNREAD' && (
                    <button
                      onClick={() => handleAction(alert, 'ACKNOWLEDGED')}
                      className="px-3 py-1 bg-ink-100 hover:bg-ink-200 text-ink-800 text-xs font-semibold rounded transition-colors"
                    >
                      Acknowledge
                    </button>
                  )}
                  {alert.status !== 'IN_PROGRESS' && alert.status !== 'RESOLVED' && (
                    <button
                      onClick={() => handleAction(alert, 'IN_PROGRESS')}
                      className="px-3 py-1 bg-sky-100 hover:bg-sky-200 text-sky-900 text-xs font-semibold rounded transition-colors"
                    >
                      Assign Review
                    </button>
                  )}
                  {alert.status !== 'RESOLVED' && (
                    <button
                      onClick={() => handleAction(alert, 'RESOLVED')}
                      className="px-3 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-semibold rounded transition-colors"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleInspect(alert.project_id)}
                  className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
                >
                  <span>Open Deep Profile</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center bg-white rounded-xl border border-ink-200 text-xs text-ink-500">
            No alerts found for severity level '{severityFilter}'.
          </div>
        )}
      </div>
    </div>
  );
};
