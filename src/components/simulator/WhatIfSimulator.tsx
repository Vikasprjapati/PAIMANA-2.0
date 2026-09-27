import React, { useState, useMemo } from 'react';
import { useProjectContext } from '../../context/ProjectContext';
import { simulateWhatIf, WhatIfInput } from '../../engine/whatIfEngine';
import { RiskBadge } from '../common/StatusBadge';
import {
  Sliders,
  TrendingDown,
  TrendingUp,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export const WhatIfSimulator: React.FC = () => {
  const { projects, selectedProject, setSelectedProject, setCurrentView } = useProjectContext();

  const currentProject = selectedProject || projects[0];

  const [input, setInput] = useState<WhatIfInput>({
    physicalProgress: currentProject.physical_progress_percentage,
    contractorScore: currentProject.contractor_performance_score,
    procurementDelayDays: currentProject.procurement_delay_days,
    paymentDelayDays: currentProject.payment_delay_days,
    milestonesDelayed: currentProject.milestones_delayed,
    resolveDependencies: false,
    stalenessDays: currentProject.data_staleness_days
  });

  // Re-sync input if selected project changes
  const handleSelectProject = (projectId: string) => {
    const found = projects.find(p => p.project_id === projectId);
    if (found) {
      setSelectedProject(found);
      setInput({
        physicalProgress: found.physical_progress_percentage,
        contractorScore: found.contractor_performance_score,
        procurementDelayDays: found.procurement_delay_days,
        paymentDelayDays: found.payment_delay_days,
        milestonesDelayed: found.milestones_delayed,
        resolveDependencies: false,
        stalenessDays: found.data_staleness_days
      });
    }
  };

  const resetToBaseline = () => {
    setInput({
      physicalProgress: currentProject.physical_progress_percentage,
      contractorScore: currentProject.contractor_performance_score,
      procurementDelayDays: currentProject.procurement_delay_days,
      paymentDelayDays: currentProject.payment_delay_days,
      milestonesDelayed: currentProject.milestones_delayed,
      resolveDependencies: false,
      stalenessDays: currentProject.data_staleness_days
    });
  };

  const simulation = useMemo(() => {
    return simulateWhatIf(currentProject, input);
  }, [currentProject, input]);

  return (
    <div className="space-y-6 pb-16">
      {/* Title Header */}
      <div className="bg-white p-5 rounded-xl border border-ink-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-ink-900 text-champagne-300">
              <Sliders className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-ink-950 tracking-tight">
              Project What-If Scenario Simulator &amp; Intervention Sandbox
            </h2>
            <span className="bg-champagne-100 text-champagne-900 border border-champagne-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
              DECISION PLANNING
            </span>
          </div>
          <p className="text-xs text-ink-500 mt-0.5">
            Test hypothetical operational interventions: Adjust physical execution, resolve bottlenecks, and forecast calibrated risk deltas
          </p>
        </div>

        {/* Project Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-ink-700 whitespace-nowrap">Select Project:</label>
          <select
            value={currentProject.project_id}
            onChange={e => handleSelectProject(e.target.value)}
            className="bg-ink-50 border border-ink-300 rounded-lg px-3 py-1.5 text-xs text-ink-900 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 max-w-xs"
          >
            {projects.slice(0, 30).map(p => (
              <option key={p.project_id} value={p.project_id}>
                [{p.project_id}] {p.project_name.slice(0, 40)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Simulator Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Interactive Controls */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-ink-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-ink-100">
            <div>
              <h3 className="font-bold text-sm text-ink-900">Adjust Simulation Parameters</h3>
              <p className="text-xs text-ink-500 mt-0.5">
                Simulating outcomes for: <b>[{currentProject.project_id}] {currentProject.project_name}</b>
              </p>
            </div>
            <button
              onClick={resetToBaseline}
              className="text-xs text-ink-500 hover:text-ink-800 flex items-center gap-1 font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Baseline</span>
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {/* 1. Physical Progress Slider */}
            <div className="space-y-1">
              <div className="flex justify-between items-center font-medium">
                <span className="text-ink-800">1. Verified Physical Progress:</span>
                <span className="font-mono font-bold text-emerald-700 text-sm">
                  {input.physicalProgress}%{' '}
                  <span className="text-[10px] text-ink-400 font-normal">
                    (Baseline: {currentProject.physical_progress_percentage}%)
                  </span>
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={input.physicalProgress}
                onChange={e => setInput(prev => ({ ...prev, physicalProgress: Number(e.target.value) }))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* 2. Contractor Performance Score */}
            <div className="space-y-1">
              <div className="flex justify-between items-center font-medium">
                <span className="text-ink-800">2. Contractor Performance Rating:</span>
                <span className="font-mono font-bold text-ink-900 text-sm">
                  {input.contractorScore} / 100{' '}
                  <span className="text-[10px] text-ink-400 font-normal">
                    (Baseline: {currentProject.contractor_performance_score})
                  </span>
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                value={input.contractorScore}
                onChange={e => setInput(prev => ({ ...prev, contractorScore: Number(e.target.value) }))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* 3. Procurement Delay */}
            <div className="space-y-1">
              <div className="flex justify-between items-center font-medium">
                <span className="text-ink-800">3. Procurement &amp; Supply Delay:</span>
                <span className="font-mono font-bold text-ink-900 text-sm">
                  {input.procurementDelayDays} Days{' '}
                  <span className="text-[10px] text-ink-400 font-normal">
                    (Baseline: {currentProject.procurement_delay_days}d)
                  </span>
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={240}
                step={10}
                value={input.procurementDelayDays}
                onChange={e => setInput(prev => ({ ...prev, procurementDelayDays: Number(e.target.value) }))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* 4. Milestones Delayed */}
            <div className="space-y-1">
              <div className="flex justify-between items-center font-medium">
                <span className="text-ink-800">4. Delayed Milestones Count:</span>
                <span className="font-mono font-bold text-ink-900 text-sm">
                  {input.milestonesDelayed} Milestones{' '}
                  <span className="text-[10px] text-ink-400 font-normal">
                    (Baseline: {currentProject.milestones_delayed})
                  </span>
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={currentProject.milestones_total}
                value={input.milestonesDelayed}
                onChange={e => setInput(prev => ({ ...prev, milestonesDelayed: Number(e.target.value) }))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* 5. Reporting Staleness */}
            <div className="space-y-1">
              <div className="flex justify-between items-center font-medium">
                <span className="text-ink-800">5. Reporting Staleness:</span>
                <span className="font-mono font-bold text-ink-900 text-sm">
                  {input.stalenessDays} Days{' '}
                  <span className="text-[10px] text-ink-400 font-normal">
                    (Baseline: {currentProject.data_staleness_days}d)
                  </span>
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={90}
                value={input.stalenessDays}
                onChange={e => setInput(prev => ({ ...prev, stalenessDays: Number(e.target.value) }))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* 6. Dependency Toggle */}
            <div className="pt-2 border-t border-ink-150">
              <label className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50/60 border border-emerald-200 cursor-pointer hover:bg-emerald-50 transition-colors">
                <input
                  type="checkbox"
                  checked={input.resolveDependencies}
                  onChange={e => setInput(prev => ({ ...prev, resolveDependencies: e.target.checked }))}
                  className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
                />
                <div>
                  <span className="font-bold text-ink-900 text-xs block">
                    Simulate Resolution of All Critical Path Dependencies
                  </span>
                  <span className="text-[11px] text-ink-600">
                    Assumes State Apex Committee clears pending RoW/environmental litigation in single window.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Live Simulated Outcome Cards */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-ink-200 shadow-sm space-y-4">
          <div className="pb-3 border-b border-ink-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 font-mono">
              Live Recalculated Output
            </span>
            <h3 className="font-bold text-sm text-ink-950 mt-0.5">Simulation Impact Matrix</h3>
          </div>

          <div className="space-y-3">
            {/* Risk Score Delta Box */}
            <div className="p-3.5 rounded-xl bg-ink-50 border border-ink-200 space-y-2">
              <div className="text-[11px] text-ink-500 font-medium">Implementation Risk Score:</div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-ink-400">Baseline</div>
                  <div className="text-xl font-bold font-mono text-ink-700">
                    {simulation.baselineRiskScore} <span className="text-xs">/100</span>
                  </div>
                </div>

                <div className="text-ink-400">
                  <ArrowRight className="w-5 h-5" />
                </div>

                <div>
                  <div className="text-xs text-ink-400">Simulated</div>
                  <div className="text-2xl font-bold font-mono text-ink-950 flex items-center gap-1.5">
                    <span>{simulation.simulatedRiskScore}</span>
                    <span className="text-xs">/100</span>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-ink-400">Net Delta</div>
                  <div
                    className={`font-mono font-bold text-sm px-2 py-0.5 rounded flex items-center gap-0.5 ${
                      simulation.riskScoreDelta <= 0
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {simulation.riskScoreDelta <= 0 ? (
                      <TrendingDown className="w-3.5 h-3.5" />
                    ) : (
                      <TrendingUp className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {simulation.riskScoreDelta > 0 ? `+${simulation.riskScoreDelta}` : simulation.riskScoreDelta} pts
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-ink-200/80 flex items-center justify-between text-xs">
                <span>Risk Status:</span>
                <div className="flex items-center gap-2">
                  <RiskBadge level={simulation.baselineRiskLevel} size="sm" />
                  <span>→</span>
                  <RiskBadge level={simulation.simulatedRiskLevel} size="sm" />
                </div>
              </div>
            </div>

            {/* Delay Outcome Box */}
            <div className="p-3.5 rounded-xl bg-ink-50 border border-ink-200 space-y-1 text-xs">
              <div className="text-[11px] text-ink-500 font-medium">Expected Timeline Slippage:</div>
              <div className="flex items-center justify-between font-mono">
                <span className="text-ink-700">Baseline: <b>{simulation.baselineExpectedDelayDays} days</b></span>
                <span>→</span>
                <span className="text-ink-950 font-bold">Simulated: <b>{simulation.simulatedExpectedDelayDays} days</b></span>
              </div>
              <div className="text-[11px] pt-1">
                {simulation.delayDaysDelta < 0 ? (
                  <span className="text-emerald-700 font-semibold">
                    ✅ Avoids ~{Math.abs(simulation.delayDaysDelta)} days of delay (~{Math.round(Math.abs(simulation.delayDaysDelta) / 30)} mos)
                  </span>
                ) : (
                  <span className="text-red-700 font-semibold">
                    ⚠️ Additional {simulation.delayDaysDelta} days schedule slippage
                  </span>
                )}
              </div>
            </div>

            {/* Cost Overrun Box */}
            <div className="p-3.5 rounded-xl bg-ink-50 border border-ink-200 space-y-1 text-xs">
              <div className="text-[11px] text-ink-500 font-medium">Predicted Cost Overrun:</div>
              <div className="flex items-center justify-between font-mono">
                <span className="text-ink-700">₹{simulation.baselineCostOverrunCr.toLocaleString()} Cr</span>
                <span>→</span>
                <span className="text-ink-950 font-bold">₹{simulation.simulatedCostOverrunCr.toLocaleString()} Cr</span>
              </div>
              <div className="text-[11px] pt-1">
                {simulation.costCrDelta < 0 ? (
                  <span className="text-emerald-700 font-semibold">
                    💰 Saves ~₹{Math.abs(simulation.costCrDelta).toLocaleString()} Cr through timely intervention
                  </span>
                ) : (
                  <span className="text-amber-700 font-semibold">
                    +{simulation.costCrDelta > 0 ? simulation.costCrDelta : 0} Cr cost escalation risk
                  </span>
                )}
              </div>
            </div>

            {/* Narrative Explanation */}
            <div className="p-3 bg-champagne-50 border border-champagne-200 rounded-lg text-xs space-y-1">
              <div className="font-bold text-champagne-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-champagne-700" />
                <span>AI Simulation Assessment:</span>
              </div>
              <p className="text-[11px] text-ink-800 leading-relaxed">
                {simulation.explanationText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
