import React, { useEffect } from 'react';
import { useProjectContext } from '../../context/ProjectContext';
import { AshokStambh } from '../common/AshokStambh';
import { X, Printer, ShieldCheck, ArrowLeft } from 'lucide-react';

export const ReportGeneratorModal: React.FC = () => {
  const { activeReportModal, setActiveReportModal, projects } = useProjectContext();

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveReportModal(false);
      }
    };
    if (activeReportModal) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeReportModal, setActiveReportModal]);

  if (!activeReportModal) return null;

  const criticalProjects = projects
    .filter(p => p.risk_level === 'CRITICAL')
    .sort((a, b) => b.overall_risk_score - a.overall_risk_score)
    .slice(0, 5);

  const totalCostOverrunCr = projects.reduce((acc, p) => acc + p.cost_variance, 0);
  const avgDelayDays = Math.round(projects.reduce((acc, p) => acc + p.days_delayed, 0) / projects.length);

  const handlePrint = () => {
    window.print();
  };

  const handleClose = () => {
    setActiveReportModal(false);
  };

  return (
    <div
      onClick={(e) => {
        // Close when clicking on the dark backdrop outside modal
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
      className="fixed inset-0 z-50 bg-ink-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-ink-300 overflow-hidden my-4 relative animate-in fade-in zoom-in-95 duration-150">
        {/* Sticky Modal Top Toolbar (Visible at all times even while scrolling) */}
        <div className="sticky top-0 z-30 bg-ink-950 text-white px-4 sm:px-6 py-3 flex items-center justify-between border-b border-ink-800 shadow-md no-print">
          <div className="flex items-center gap-2 text-xs font-bold font-mono text-champagne-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>CABINET BRIEFING MEMORANDUM &bull; CONFIDENTIAL</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / Save as PDF</span>
              <span className="sm:hidden">Print</span>
            </button>

            {/* Highly Prominent Close Button */}
            <button
              onClick={handleClose}
              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer border border-red-500"
              title="Close memo (Esc)"
            >
              <X className="w-4 h-4" />
              <span>Close / बंद करें</span>
            </button>
          </div>
        </div>

        {/* Printable Official Document Body */}
        <div className="p-6 sm:p-12 space-y-6 text-ink-950 font-serif max-h-[80vh] overflow-y-auto" id="printable-report">
          {/* Official Letterhead Header */}
          <div className="text-center pb-6 border-b-2 border-ink-900 space-y-2">
            <div className="flex justify-center mb-1">
              <AshokStambh size={46} className="text-ink-900" />
            </div>
            <div className="text-xs uppercase font-sans font-bold tracking-widest text-ink-700">
              भारत सरकार • Government of India
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Ministry of Statistics &amp; Programme Implementation (MoSPI)
            </h1>
            <div className="text-xs font-sans text-ink-600 uppercase tracking-wider">
              Project Monitoring &amp; Statistics Division (OCMS) • Sardar Patel Bhawan, New Delhi
            </div>
            <div className="pt-2 text-xs font-mono font-bold text-ink-800">
              CONFIDENTIAL • FOR OFFICIAL MONITORING USE ONLY
            </div>
          </div>

          {/* Reference & Metadata Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs font-sans text-ink-700 pb-2 border-b border-ink-200 gap-1">
            <div>
              <b>Report Ref:</b> MoSPI/IPMD/PAIMANA/2026/09/BR-04
            </div>
            <div>
              <b>Date of Appraisal:</b> 27th September, 2026
            </div>
          </div>

          {/* Subject Line */}
          <div className="font-sans text-xs">
            <span className="font-bold uppercase tracking-wider text-ink-900">SUBJECT: </span>
            <span className="font-bold underline underline-offset-2">
              National Infrastructure Portfolio Early Warning &amp; Implementation Risk Briefing
            </span>
          </div>

          {/* Executive Overview Paragraph */}
          <div className="text-xs font-sans leading-relaxed text-ink-800 space-y-2">
            <p>
              1. The <b>PAIMANA AI Integrated Monitoring Engine</b> has evaluated <b>{projects.length} Central Sector Infrastructure Projects</b> (costing ₹150 Crore and above) across 12 Union Ministries.
            </p>
            <p>
              2. Out of the active portfolio, <b>{criticalProjects.length} critical projects</b> have breached composite tolerance thresholds under the <b>CUF+ predictive machine learning algorithm</b>, exhibiting compound delays in Right-of-Way (RoW) acquisition, contractual performance default notices, and significant expenditure uncoupling.
            </p>
          </div>

          {/* Portfolio Snapshot KPI Table */}
          <div className="font-sans text-xs pt-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-ink-900 mb-2">
              I. National Portfolio Statistics (Macro Snapshot)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded border border-ink-300 bg-ink-50">
                <span className="text-[10px] text-ink-500 uppercase block font-semibold">Total Projects</span>
                <span className="font-mono font-bold text-base">{projects.length}</span>
              </div>
              <div className="p-3 rounded border border-ink-300 bg-ink-50">
                <span className="text-[10px] text-ink-500 uppercase block font-semibold">Critical Risk</span>
                <span className="font-mono font-bold text-base text-red-700">{projects.filter(p => p.risk_level === 'CRITICAL').length}</span>
              </div>
              <div className="p-3 rounded border border-ink-300 bg-ink-50">
                <span className="text-[10px] text-ink-500 uppercase block font-semibold">Total Cost Overrun</span>
                <span className="font-mono font-bold text-base text-amber-700">+₹{(totalCostOverrunCr / 1000).toFixed(1)}k Cr</span>
              </div>
              <div className="p-3 rounded border border-ink-300 bg-ink-50">
                <span className="text-[10px] text-ink-500 uppercase block font-semibold">Average Delay</span>
                <span className="font-mono font-bold text-base text-ink-900">{avgDelayDays} Days</span>
              </div>
            </div>
          </div>

          {/* Top 5 Critical Projects Table */}
          <div className="font-sans text-xs pt-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-ink-900 mb-2">
              II. Priority Inter-Ministerial Escalation Queue (Top 5 Critical Assets)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border border-ink-300 divide-y divide-ink-200">
                <thead className="bg-ink-100 text-[10px] uppercase font-bold text-ink-800">
                  <tr>
                    <th className="p-2 border-r border-ink-300">Project Name</th>
                    <th className="p-2 border-r border-ink-300">Ministry</th>
                    <th className="p-2 border-r border-ink-300 text-center">Delay</th>
                    <th className="p-2 border-r border-ink-300 text-center">Cost Overrun</th>
                    <th className="p-2">Recommended Directive</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-200 text-[11px]">
                  {criticalProjects.map(p => (
                    <tr key={p.project_id}>
                      <td className="p-2 border-r border-ink-300 font-semibold">
                        [{p.project_id}] {p.project_name}
                      </td>
                      <td className="p-2 border-r border-ink-300 whitespace-nowrap">
                        {p.ministry.replace('Ministry of ', '')}
                      </td>
                      <td className="p-2 border-r border-ink-300 text-center font-mono text-red-700 font-bold whitespace-nowrap">
                        {p.days_delayed}d
                      </td>
                      <td className="p-2 border-r border-ink-300 text-center font-mono font-bold text-amber-700 whitespace-nowrap">
                        +{p.cost_overrun_percentage}%
                      </td>
                      <td className="p-2 text-ink-700 leading-snug">
                        {p.recommended_interventions[0]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Official Sign-off Block */}
          <div className="pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-end font-sans text-xs gap-4">
            <div className="space-y-1 text-ink-600 text-[11px]">
              <div>System: <b>PAIMANA AI Early Warning Engine v2.6</b></div>
              <div>Security Classification: Confidential / Decision Support</div>
              <div>Audit Trail Checksum: SHA-256 Verified</div>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <div className="font-serif italic font-bold text-ink-800 text-sm">R. K. Verma</div>
              <div className="font-bold text-ink-950">Dr. R. K. Verma, IAS</div>
              <div className="text-ink-600 text-[11px]">Joint Secretary to the Government of India</div>
              <div className="text-ink-500 text-[10px]">Ministry of Statistics &amp; Programme Implementation</div>
            </div>
          </div>
        </div>

        {/* Bottom Footer Action Bar */}
        <div className="bg-ink-100 px-6 py-3 border-t border-ink-200 flex items-center justify-between no-print">
          <span className="text-xs text-ink-600">
            Press <kbd className="px-1.5 py-0.5 bg-white border border-ink-300 rounded font-mono text-[10px]">Esc</kbd> or click outside to dismiss
          </span>
          <button
            onClick={handleClose}
            className="px-4 py-1.5 rounded-lg bg-ink-900 hover:bg-ink-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Dashboard / वापस जाएं</span>
          </button>
        </div>
      </div>
    </div>
  );
};
