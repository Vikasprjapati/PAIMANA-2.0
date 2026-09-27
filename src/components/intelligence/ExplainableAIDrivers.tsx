import React from 'react';
import { Project, RiskFactorContribution } from '../../types/project';
import { HelpCircle, AlertOctagon, AlertTriangle, CheckCircle, Info, ShieldAlert } from 'lucide-react';

export const ExplainableAIDrivers: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <div className="bg-white rounded-xl border border-ink-200 shadow-xs p-4 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-ink-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-red-100 text-red-700">
              <ShieldAlert className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-sm text-ink-950">
              Explainable AI (XAI) — Risk Attribution &amp; Drivers
            </h3>
          </div>
          <p className="text-xs text-ink-500 mt-0.5">
            Transparent SHAP-aligned feature attribution: Quantifying which specific variables drive the CUF+ risk score
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-ink-100 text-ink-700 font-mono px-2.5 py-1 rounded-md">
            Model Confidence: <b className="text-emerald-700">{project.model_confidence}%</b>
          </span>
          <span className="text-xs bg-ink-100 text-ink-700 font-mono px-2.5 py-1 rounded-md">
            Prob: <b className="text-red-700">{project.cost_overrun_probability}%</b>
          </span>
        </div>
      </div>

      {/* Distinction Header Callout */}
      <div className="p-3 bg-ink-50/80 rounded-lg border border-ink-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <span className="text-ink-400 block text-[10px] uppercase font-semibold">1. Risk Score</span>
          <span className="font-bold text-base text-ink-900 font-mono">
            {project.overall_risk_score} <span className="text-xs font-normal text-ink-500">/ 100</span>
          </span>
        </div>
        <div>
          <span className="text-ink-400 block text-[10px] uppercase font-semibold">2. Prediction Prob</span>
          <span className="font-bold text-base text-red-700 font-mono">
            {project.cost_overrun_probability}%
          </span>
        </div>
        <div>
          <span className="text-ink-400 block text-[10px] uppercase font-semibold">3. Model Confidence</span>
          <span className="font-bold text-base text-emerald-700 font-mono">
            {project.model_confidence}%
          </span>
        </div>
        <div>
          <span className="text-ink-400 block text-[10px] uppercase font-semibold">4. Data Quality</span>
          <span className="font-bold text-base text-ink-800 font-mono">
            {project.data_quality_score}%
          </span>
        </div>
      </div>

      {/* Driver Cards / Waterfall */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-ink-800 uppercase tracking-wide">
          Primary Contributing Factors (SHAP Values)
        </h4>

        {project.risk_drivers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {project.risk_drivers.map((driver, idx) => {
              const isPositive = driver.contribution > 0;
              const severityColor =
                driver.severity === 'CRITICAL'
                  ? 'border-red-300 bg-red-50/50 text-red-900'
                  : driver.severity === 'HIGH'
                  ? 'border-orange-300 bg-orange-50/50 text-orange-900'
                  : driver.severity === 'MEDIUM'
                  ? 'border-amber-300 bg-amber-50/50 text-amber-900'
                  : 'border-emerald-300 bg-emerald-50/50 text-emerald-900';

              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-lg border shadow-2xs transition-all ${severityColor}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs">
                      {idx + 1}. {driver.factor}
                    </span>
                    <span
                      className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                        isPositive ? 'bg-red-200/80 text-red-950' : 'bg-emerald-200/80 text-emerald-950'
                      }`}
                    >
                      {isPositive ? `+${driver.contribution}` : driver.contribution} pts
                    </span>
                  </div>

                  {/* Impact bar */}
                  <div className="w-full bg-white/70 h-1.5 rounded-full my-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        driver.severity === 'CRITICAL'
                          ? 'bg-red-600'
                          : driver.severity === 'HIGH'
                          ? 'bg-orange-500'
                          : driver.severity === 'MEDIUM'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.abs(driver.contribution) * 2.5)}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-ink-800 leading-relaxed font-sans">
                    <b>Evidence:</b> {driver.evidence}
                  </p>

                  {driver.benchmarkComparison && (
                    <div className="text-[10px] text-ink-500 mt-2 pt-1 border-t border-ink-200 flex items-center gap-1">
                      <Info className="w-3 h-3 text-ink-400 shrink-0" />
                      <span>Benchmark: {driver.benchmarkComparison}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded-lg text-xs text-center font-medium">
            No critical adverse risk drivers detected. Project metrics are conforming to standard baseline schedules.
          </div>
        )}
      </div>
    </div>
  );
};
