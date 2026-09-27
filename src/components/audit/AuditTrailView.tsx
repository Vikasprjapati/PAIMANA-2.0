import React, { useState } from 'react';
import { useProjectContext } from '../../context/ProjectContext';
import { ShieldCheck, Download, Filter, Search, FileText } from 'lucide-react';

export const AuditTrailView: React.FC = () => {
  const { auditLogs, setCurrentView, setSelectedProject, projects } = useProjectContext();
  const [filterAction, setFilterAction] = useState<string>('ALL');

  const filteredLogs = filterAction === 'ALL'
    ? auditLogs
    : auditLogs.filter(l => l.action_type === filterAction);

  const handleExportAudit = () => {
    const headers = ['Action ID', 'Timestamp', 'Project ID', 'Project Name', 'Officer Name', 'Officer Role', 'Action Type', 'Notes', 'Evidence', 'Status'];
    const rows = filteredLogs.map(l => [
      `"${l.id}"`,
      `"${l.timestamp}"`,
      `"${l.project_id}"`,
      `"${l.project_name.replace(/"/g, '""')}"`,
      `"${l.officer_name}"`,
      `"${l.officer_role}"`,
      `"${l.action_type}"`,
      `"${l.notes.replace(/"/g, '""')}"`,
      `"${(l.evidence_snapshot || '').replace(/"/g, '""')}"`,
      `"${l.status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mospi_paimana_audit_trail_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <span className="p-1 rounded bg-ink-900 text-champagne-300">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-ink-950 tracking-tight">
              Statutory Decision Audit Trail &amp; Accountability Log
            </h2>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
              IMMUTABLE LOGS
            </span>
          </div>
          <p className="text-xs text-ink-500 mt-0.5">
            Cryptographic timestamped record of officer escalations, technical audit assignments, and inter-ministerial interventions
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Action Filter */}
          <select
            value={filterAction}
            onChange={e => setFilterAction(e.target.value)}
            className="bg-ink-50 border border-ink-300 rounded-lg px-2.5 py-1.5 text-xs text-ink-900 font-semibold"
          >
            <option value="ALL">All Recorded Actions</option>
            <option value="ESCALATED">Escalations</option>
            <option value="ASSIGNED_FOR_REVIEW">Audit Assignments</option>
            <option value="ACKNOWLEDGED">Acknowledgements</option>
            <option value="RESOLVED">Resolved Decisions</option>
            <option value="NOTE_ADDED">Officer Notes</option>
          </select>

          <button
            onClick={handleExportAudit}
            className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit Log</span>
          </button>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-ink-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ink-900 text-white font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Log ID &amp; Timestamp</th>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Action Type</th>
                <th className="py-3 px-4">Officer Signature &amp; Role</th>
                <th className="py-3 px-4">Intervention Directive / Notes</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-150">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-ink-50/50 transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-mono font-bold text-ink-900">{log.id}</div>
                    <div className="text-[10px] text-ink-400">{log.timestamp}</div>
                  </td>

                  <td className="py-3 px-4 max-w-xs">
                    <button
                      onClick={() => handleInspect(log.project_id)}
                      className="font-bold text-ink-900 hover:text-emerald-700 text-left font-mono block"
                    >
                      [{log.project_id}]
                    </button>
                    <div className="text-[11px] text-ink-600 truncate" title={log.project_name}>
                      {log.project_name}
                    </div>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                        log.action_type === 'ESCALATED'
                          ? 'bg-red-100 text-red-800'
                          : log.action_type === 'ASSIGNED_FOR_REVIEW'
                          ? 'bg-sky-100 text-sky-800'
                          : log.action_type === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-ink-100 text-ink-800'
                      }`}
                    >
                      {log.action_type.replace(/_/g, ' ')}
                    </span>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-bold text-ink-900 text-[11px]">{log.officer_name}</div>
                    <div className="text-[10px] text-ink-400 uppercase font-mono">{log.officer_role}</div>
                  </td>

                  <td className="py-3 px-4 text-ink-700 leading-relaxed font-sans max-w-md">
                    <p className="text-[11px]">{log.notes}</p>
                    {log.evidence_snapshot && (
                      <div className="text-[10px] text-ink-400 font-mono mt-1">
                        Snapshot: {log.evidence_snapshot}
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                        log.status === 'CLOSED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
