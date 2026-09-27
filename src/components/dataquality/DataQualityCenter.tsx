import React, { useMemo } from 'react';
import { useProjectContext } from '../../context/ProjectContext';
import { auditDataQuality } from '../../engine/dataQualityEngine';
import { DataQualityBadge } from '../common/StatusBadge';
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  Clock,
  CircleDollarSign,
  ArrowRight,
  ShieldCheck,
  Search,
  ExternalLink
} from 'lucide-react';

export const DataQualityCenter: React.FC = () => {
  const { projects, setSelectedProject, setCurrentView } = useProjectContext();

  const audit = useMemo(() => auditDataQuality(projects), [projects]);

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
              <Database className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-ink-950 tracking-tight">
              Data Quality Engine &amp; Reporting Compliance Audit
            </h2>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
              SLA COMPLIANCE VERIFIED
            </span>
          </div>
          <p className="text-xs text-ink-500 mt-0.5">
            Automated scrutiny of 1,250+ project records for stale submissions, expenditure uncoupling, and reporting anomalies
          </p>
        </div>

        <div className="text-xs font-mono text-ink-500">
          Last Portfolio Scan: <b>{audit.auditDate}</b>
        </div>
      </div>

      {/* KPI Cards for Data Quality */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Overall Score */}
        <div className="bg-white p-4 rounded-xl border border-ink-200 shadow-xs">
          <div className="text-xs text-ink-500 font-medium">Portfolio Data Quality Score</div>
          <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">
            {audit.overallScore}%
          </div>
          <div className="mt-2 pt-2 border-t border-ink-100 text-[11px] text-ink-600 flex items-center justify-between">
            <span>Status: <b>GOOD SLA</b></span>
            <span className="text-emerald-700 font-bold">{audit.goodCount} Compliant</span>
          </div>
        </div>

        {/* Stale Records */}
        <div className="bg-white p-4 rounded-xl border border-ink-200 shadow-xs">
          <div className="text-xs text-ink-500 font-medium">Stale Reporting (&gt;30 Days)</div>
          <div className="text-2xl font-bold font-mono text-amber-700 mt-1">
            {audit.staleCount}
          </div>
          <div className="mt-2 pt-2 border-t border-ink-100 text-[11px] text-ink-600 flex items-center justify-between">
            <span>Breaches SLA</span>
            <span className="text-amber-700 font-bold">{Math.round((audit.staleCount / audit.totalRecordsChecked) * 100)}% of Projects</span>
          </div>
        </div>

        {/* Expenditure Mismatches */}
        <div className="bg-white p-4 rounded-xl border border-ink-200 shadow-xs">
          <div className="text-xs text-ink-500 font-medium">Expenditure vs Physical Divergence</div>
          <div className="text-2xl font-bold font-mono text-red-600 mt-1">
            {audit.mismatchCount}
          </div>
          <div className="mt-2 pt-2 border-t border-ink-100 text-[11px] text-ink-600 flex items-center justify-between">
            <span>Spend leads by &gt;20%</span>
            <span className="text-red-700 font-bold">Vigilance Flag</span>
          </div>
        </div>

        {/* Watch & Poor Total */}
        <div className="bg-white p-4 rounded-xl border border-ink-200 shadow-xs">
          <div className="text-xs text-ink-500 font-medium">Flagged for Compliance Review</div>
          <div className="text-2xl font-bold font-mono text-ink-900 mt-1">
            {audit.watchCount + audit.poorCount}
          </div>
          <div className="mt-2 pt-2 border-t border-ink-100 text-[11px] text-ink-600 flex items-center justify-between">
            <span>{audit.watchCount} Watch</span>
            <span className="text-red-600 font-bold">{audit.poorCount} Poor</span>
          </div>
        </div>
      </div>

      {/* Flagged Projects Table */}
      <div className="bg-white rounded-xl border border-ink-200 shadow-xs overflow-hidden space-y-2">
        <div className="p-4 border-b border-ink-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-ink-900">
              Compliance Exception List &amp; Anomaly Audit ({audit.flaggedProjects.length} Projects Flagged)
            </h3>
            <p className="text-xs text-ink-500 mt-0.5">
              Identified records with data freshness lapses or contradictory physical-financial ratios
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ink-50 text-ink-700 font-semibold border-b border-ink-200 text-[11px]">
              <tr>
                <th className="py-2.5 px-4">Project ID &amp; Name</th>
                <th className="py-2.5 px-4">Ministry &amp; Agency</th>
                <th className="py-2.5 px-4 text-center">Data Quality</th>
                <th className="py-2.5 px-4">Detected Data Discrepancy &amp; Rule Violation</th>
                <th className="py-2.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-150">
              {audit.flaggedProjects.slice(0, 15).map(({ project, issues }, idx) => (
                <tr key={project.project_id} className="hover:bg-ink-50/50 transition-colors">
                  <td className="py-3 px-4 max-w-xs">
                    <div className="font-mono font-bold text-ink-950">
                      {project.project_id}
                    </div>
                    <div className="font-semibold text-ink-800 truncate" title={project.project_name}>
                      {project.project_name}
                    </div>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-medium text-ink-800 text-[11px] truncate max-w-[180px]">
                      {project.ministry.replace('Ministry of ', '')}
                    </div>
                    <div className="text-[10px] text-ink-500">{project.implementing_agency}</div>
                  </td>

                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <DataQualityBadge grade={project.data_quality_grade} score={project.data_quality_score} />
                  </td>

                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      {issues.map((iss, i) => (
                        <div
                          key={i}
                          className={`p-2 rounded text-[11px] border leading-relaxed ${
                            iss.severity === 'POOR'
                              ? 'bg-red-50 text-red-900 border-red-200'
                              : 'bg-amber-50 text-amber-900 border-amber-200'
                          }`}
                        >
                          <span className="font-bold uppercase font-mono text-[9px] block">
                            [{iss.type.replace(/_/g, ' ')}]
                          </span>
                          {iss.description}
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => handleInspect(project.project_id)}
                      className="px-2.5 py-1 bg-ink-900 hover:bg-ink-800 text-white rounded text-[11px] font-semibold flex items-center gap-1 mx-auto transition-colors"
                    >
                      <span>Audit Profile</span>
                      <ExternalLink className="w-3 h-3 text-champagne-300" />
                    </button>
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
