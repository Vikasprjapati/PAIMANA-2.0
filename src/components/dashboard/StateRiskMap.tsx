import React, { useState } from 'react';
import { INDIA_STATES_DATA, StateMetric } from '../../data/indiaStatesData';
import { useProjectContext } from '../../context/ProjectContext';
import { MapPin, ArrowRight, ShieldAlert, Layers } from 'lucide-react';

export const StateRiskMap: React.FC = () => {
  const { filters, setFilters, setCurrentView } = useProjectContext();
  const [selectedState, setSelectedState] = useState<StateMetric | null>(null);
  const [activeZone, setActiveZone] = useState<string>('ALL');

  const zones = ['ALL', 'North', 'South', 'West', 'East', 'Central', 'North-East'];

  const filteredStates = activeZone === 'ALL'
    ? INDIA_STATES_DATA
    : INDIA_STATES_DATA.filter(s => s.zone === activeZone);

  const handleStateClick = (state: StateMetric) => {
    setSelectedState(state);
    setFilters(prev => ({ ...prev, state: state.name }));
  };

  const getRiskColor = (risk: number) => {
    if (risk >= 70) return 'bg-red-500 text-white border-red-600 hover:bg-red-600';
    if (risk >= 50) return 'bg-orange-500 text-white border-orange-600 hover:bg-orange-600';
    if (risk >= 40) return 'bg-amber-400 text-ink-950 border-amber-500 hover:bg-amber-500';
    return 'bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600';
  };

  return (
    <div className="bg-white rounded-xl border border-ink-200 shadow-sm p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-ink-100">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-sm text-ink-900 tracking-tight">
              State-wise Implementation Risk Heatmap &amp; Regional Intelligence
            </h3>
          </div>
          <p className="text-xs text-ink-500 mt-0.5">
            Geographic risk concentration calculated from land disputes, statutory clearances and contractor density
          </p>
        </div>

        {/* Zone Selector */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1">
          {zones.map(z => (
            <button
              key={z}
              onClick={() => setActiveZone(z)}
              className={`px-2.5 py-1 text-xs rounded-md font-medium whitespace-nowrap transition-colors ${
                activeZone === z
                  ? 'bg-ink-900 text-white shadow-xs'
                  : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
              }`}
            >
              {z}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Interactive India Grid Heatmap */}
        <div className="lg:col-span-8 bg-ink-50/70 p-4 rounded-lg border border-ink-200">
          <div className="flex items-center justify-between text-xs text-ink-500 mb-3">
            <span className="font-semibold text-ink-700">Click any State tile to filter portfolio ({filteredStates.length} States/UTs):</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[11px]"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Low (&lt;40)</span>
              <span className="flex items-center gap-1 text-[11px]"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span> Moderate (40-50)</span>
              <span className="flex items-center gap-1 text-[11px]"><span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block"></span> High (50-70)</span>
              <span className="flex items-center gap-1 text-[11px]"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span> Critical (&gt;70)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {filteredStates.map(state => {
              const isCurrent = filters.state === state.name;
              return (
                <button
                  key={state.code}
                  onClick={() => handleStateClick(state)}
                  className={`relative p-2.5 rounded-lg border text-left transition-all transform active:scale-95 ${
                    isCurrent
                      ? 'ring-2 ring-emerald-600 ring-offset-1 shadow-md bg-white border-emerald-500'
                      : 'bg-white hover:border-ink-400 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-ink-900">{state.code}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${getRiskColor(
                        state.riskIndex
                      )}`}
                    >
                      {state.riskIndex}
                    </span>
                  </div>
                  <div className="font-semibold text-xs text-ink-800 truncate mt-1">{state.name}</div>
                  <div className="flex items-center justify-between text-[11px] text-ink-500 mt-1.5 pt-1 border-t border-ink-100">
                    <span>{state.activeProjects} Projects</span>
                    <span className="text-red-600 font-bold">{state.criticalProjects} Crit</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected State Intelligence Card */}
        <div className="lg:col-span-4 bg-white p-4 rounded-lg border border-ink-200 shadow-sm space-y-4">
          {selectedState ? (
            <>
              <div className="flex items-center justify-between pb-2 border-b border-ink-200">
                <div>
                  <div className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wide">
                    {selectedState.zone} Zone • {selectedState.code}
                  </div>
                  <h4 className="text-base font-bold text-ink-900">{selectedState.name}</h4>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-mono font-bold ${getRiskColor(selectedState.riskIndex)}`}>
                  Risk Index: {selectedState.riskIndex}/100
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-ink-50 border border-ink-150">
                  <div className="text-[11px] text-ink-500">Active MoSPI Projects</div>
                  <div className="text-base font-bold text-ink-900 mt-0.5">{selectedState.activeProjects}</div>
                </div>
                <div className="p-2 rounded bg-red-50 border border-red-200">
                  <div className="text-[11px] text-red-600 font-medium">Critical Delays</div>
                  <div className="text-base font-bold text-red-700 mt-0.5">{selectedState.criticalProjects}</div>
                </div>
                <div className="p-2 rounded bg-ink-50 border border-ink-150">
                  <div className="text-[11px] text-ink-500">Avg Schedule Delay</div>
                  <div className="text-sm font-bold text-ink-900 mt-0.5">{selectedState.avgDelayDays} days</div>
                </div>
                <div className="p-2 rounded bg-ink-50 border border-ink-150">
                  <div className="text-[11px] text-ink-500">Avg Cost Escalation</div>
                  <div className="text-sm font-bold text-orange-700 mt-0.5">+{selectedState.avgCostOverrunPct}%</div>
                </div>
              </div>

              <div className="p-2.5 rounded bg-champagne-50 border border-champagne-200 text-xs text-ink-800">
                <div className="font-semibold text-champagne-900 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-champagne-700" />
                  <span>Regional Risk Factors:</span>
                </div>
                <p className="mt-1 text-[11px] text-ink-700 leading-relaxed">
                  {selectedState.riskIndex > 65
                    ? 'High incidence of land acquisition court litigations, pending forest clearances, and contractor liquidity stress.'
                    : selectedState.riskIndex > 45
                    ? 'Moderate seasonal monsoon disruption and cross-departmental utility shifting clearances.'
                    : 'Streamlined single-window statutory clearances and healthy EPC contractor performance records.'}
                </p>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setCurrentView('PROJECTS')}
                  className="flex-1 py-1.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Filter All {selectedState.name} Projects</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-10 space-y-2">
              <Layers className="w-8 h-8 text-ink-400 mx-auto" />
              <div className="text-xs font-bold text-ink-700">Select a State Tile</div>
              <p className="text-[11px] text-ink-500 px-4">
                Click any Indian state above to inspect regional cost-delay variance, active project load, and filter the national portfolio.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
