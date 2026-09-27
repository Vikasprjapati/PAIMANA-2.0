import React from 'react';
import { useProjectContext } from '../../context/ProjectContext';
import { ShieldCheck, Info, FileSpreadsheet } from 'lucide-react';

export const GovFooter: React.FC = () => {
  const { setCurrentView, setActiveReportModal } = useProjectContext();

  return (
    <footer className="bg-ink-950 text-ink-400 border-t border-ink-800 text-xs py-4 px-6 no-print">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left disclaimer */}
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="font-semibold text-ink-200">
              PAIMANA AI — Integrated Project Monitoring &amp; AI Early Warning System
            </span>
          </div>
          <p className="text-[11px] text-ink-400">
            Prototype developed for Smart India Hackathon (SIH) 2026 • Problem Statement: SIH26103 • Ministry of Statistics &amp; Programme Implementation (MoSPI)
          </p>
          <p className="text-[10px] text-ink-400 flex items-center justify-center md:justify-start gap-1">
            <Info className="w-3 h-3 text-champagne-400" />
            <span>
              DATA HONESTY NOTICE: Uses synthetic/demo data structured in alignment with MoSPI OCMS/PAIMANA data dictionaries.
            </span>
          </p>
        </div>

        {/* Right action links */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <button
            onClick={() => setCurrentView('CUF_EXPERIMENT')}
            className="hover:text-emerald-400 transition-colors"
          >
            CUF+ Methodology
          </button>
          <span>•</span>
          <button
            onClick={() => setCurrentView('DATA_QUALITY')}
            className="hover:text-emerald-400 transition-colors"
          >
            Data Quality Audit
          </button>
          <span>•</span>
          <button
            onClick={() => setActiveReportModal(true)}
            className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-champagne-300"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Executive Briefing</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
