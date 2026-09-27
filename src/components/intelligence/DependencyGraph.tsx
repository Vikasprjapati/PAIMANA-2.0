import React, { useState } from 'react';
import { Project, DependencyNode } from '../../types/project';
import { Network, AlertOctagon, CheckCircle2, Clock, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';

export const DependencyGraph: React.FC<{ project: Project }> = ({ project }) => {
  const [selectedNode, setSelectedNode] = useState<DependencyNode | null>(
    project.dependencies[0] || null
  );

  // Default standard dependency chain for infrastructure if project has few
  const defaultChain: DependencyNode[] = [
    {
      id: 'DEP-LAND',
      name: 'Land Acquisition & RoW Demarcation',
      category: 'LAND',
      status: project.land_acquisition_status === 'FULLY_ACQUIRED' ? 'RESOLVED' : project.land_acquisition_status === 'DISPUTED' ? 'CRITICAL_DELAY' : 'IN_PROGRESS',
      daysDelayed: project.land_acquisition_status === 'DISPUTED' ? 180 : project.land_acquisition_status === 'PARTIAL' ? 45 : 0,
      criticalPath: true,
      impactScore: project.land_acquisition_status === 'DISPUTED' ? 92 : 30,
      notes: project.land_acquisition_status === 'DISPUTED' ? 'Pending revenue court award settlement' : 'Land handed over for civil execution'
    },
    {
      id: 'DEP-ENV',
      name: 'Environmental & Forest Clearance',
      category: 'ENVIRONMENT',
      status: project.environmental_clearance === 'APPROVED' ? 'RESOLVED' : 'IN_PROGRESS',
      daysDelayed: project.environmental_clearance === 'APPROVED' ? 0 : 75,
      criticalPath: true,
      impactScore: project.environmental_clearance === 'APPROVED' ? 10 : 85,
      notes: project.environmental_clearance === 'APPROVED' ? 'Stage-II forest diversion sanctioned' : 'Tree felling compensatory afforestation pending'
    },
    {
      id: 'DEP-UTIL',
      name: 'High Voltage & Utility Relocation',
      category: 'UTILITY',
      status: project.utility_shift_status === 'COMPLETED' ? 'RESOLVED' : project.utility_shift_status === 'STALLED' ? 'CRITICAL_DELAY' : 'IN_PROGRESS',
      daysDelayed: project.utility_shift_status === 'COMPLETED' ? 0 : 60,
      criticalPath: false,
      impactScore: 55,
      notes: 'State DISCOM tower shifting and gas line crossing'
    },
    {
      id: 'DEP-PROC',
      name: 'Specialty Equipment & Material Procurement',
      category: 'PROCUREMENT',
      status: project.procurement_delay_days > 60 ? 'CRITICAL_DELAY' : project.procurement_delay_days > 20 ? 'IN_PROGRESS' : 'RESOLVED',
      daysDelayed: project.procurement_delay_days,
      criticalPath: true,
      impactScore: Math.min(95, project.procurement_delay_days),
      notes: project.procurement_delay_days > 0 ? `Procurement delayed by ${project.procurement_delay_days} days` : 'All long-lead equipment ordered'
    },
    {
      id: 'DEP-CIVIL',
      name: 'Civil Works & Structural Superstructure',
      category: 'CIVIL',
      status: project.physical_progress_percentage > 85 ? 'RESOLVED' : project.days_delayed > 180 ? 'CRITICAL_DELAY' : 'IN_PROGRESS',
      daysDelayed: project.days_delayed,
      criticalPath: true,
      impactScore: 88,
      notes: `Physical progress at ${project.physical_progress_percentage}%`
    },
    {
      id: 'DEP-COMM',
      name: 'Statutory Safety Inspection & Commissioning',
      category: 'CONTRACTOR',
      status: project.physical_progress_percentage >= 95 ? 'IN_PROGRESS' : 'BLOCKED',
      daysDelayed: 0,
      criticalPath: true,
      impactScore: 40,
      notes: 'Final safety certification prior to commercial rollout'
    }
  ];

  const displayNodes = project.dependencies.length > 2 ? project.dependencies : defaultChain;

  const getNodeColor = (status: DependencyNode['status']) => {
    switch (status) {
      case 'RESOLVED':
        return {
          bg: 'bg-emerald-50 border-emerald-400 text-emerald-950',
          dot: 'bg-emerald-500',
          badge: 'bg-emerald-100 text-emerald-800'
        };
      case 'IN_PROGRESS':
        return {
          bg: 'bg-sky-50 border-sky-400 text-sky-950',
          dot: 'bg-sky-500',
          badge: 'bg-sky-100 text-sky-800'
        };
      case 'BLOCKED':
        return {
          bg: 'bg-orange-50 border-orange-400 text-orange-950',
          dot: 'bg-orange-500',
          badge: 'bg-orange-100 text-orange-800'
        };
      case 'CRITICAL_DELAY':
        return {
          bg: 'bg-red-50 border-red-500 text-red-950 ring-2 ring-red-300 ring-offset-1',
          dot: 'bg-red-600 animate-ping',
          badge: 'bg-red-600 text-white font-bold'
        };
    }
  };

  return (
    <div className="bg-white rounded-xl border border-ink-200 shadow-xs p-4 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-ink-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-ink-900 text-champagne-300">
              <Network className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-sm text-ink-950">
              Project Dependency Intelligence Graph &amp; Critical Path
            </h3>
          </div>
          <p className="text-xs text-ink-500 mt-0.5">
            Visualization of statutory clearances, utility shifting, and procurement dependencies propagating into timeline risk
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-[11px]"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Resolved</span>
          <span className="flex items-center gap-1 text-[11px]"><span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block"></span> Active</span>
          <span className="flex items-center gap-1 text-[11px]"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span> Blocker</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Interactive Visual Chain */}
        <div className="lg:col-span-8 bg-ink-50/70 p-4 rounded-xl border border-ink-200 space-y-3">
          <div className="text-[11px] font-semibold text-ink-600 mb-2">
            Critical Path Pipeline Sequence (Click node to inspect):
          </div>

          <div className="space-y-3 relative">
            {displayNodes.map((node, index) => {
              const styling = getNodeColor(node.status);
              const isSelected = selectedNode?.id === node.id;

              return (
                <div key={node.id} className="relative">
                  {/* Connector arrow line */}
                  {index < displayNodes.length - 1 && (
                    <div className="absolute left-6 top-11 bottom-0 w-0.5 bg-ink-300 z-0 h-4"></div>
                  )}

                  <button
                    onClick={() => setSelectedNode(node)}
                    className={`w-full relative z-10 p-3 rounded-lg border text-left transition-all flex items-center justify-between gap-3 ${
                      styling.bg
                    } ${isSelected ? 'shadow-md border-ink-800' : 'hover:border-ink-400'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-white border border-ink-300 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs">{node.name}</span>
                          {node.criticalPath && (
                            <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 bg-red-100 text-red-800 rounded">
                              CRITICAL PATH
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-ink-500 mt-0.5">
                          Category: <b>{node.category}</b> • {node.notes}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      {node.daysDelayed > 0 && (
                        <span className="font-mono text-xs font-bold text-red-600">
                          +{node.daysDelayed}d delay
                        </span>
                      )}
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${styling.badge}`}>
                        {node.status.replace('_', ' ')}
                      </span>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Dependency Inspector Drawer */}
        <div className="lg:col-span-4 bg-white p-4 rounded-xl border border-ink-200 shadow-sm space-y-4">
          {selectedNode ? (
            <>
              <div className="pb-3 border-b border-ink-100">
                <span className="text-[10px] font-bold uppercase text-emerald-700 font-mono tracking-wider">
                  Dependency Breakdown
                </span>
                <h4 className="text-sm font-bold text-ink-950 mt-0.5">{selectedNode.name}</h4>
                <div className="text-xs text-ink-500 mt-0.5">
                  Category: <b>{selectedNode.category}</b>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-2.5 rounded bg-ink-50 border border-ink-150">
                  <div className="text-[11px] text-ink-500">Delay Propagation Impact:</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-bold text-ink-900 font-mono text-base">
                      {selectedNode.impactScore} <span className="text-xs font-normal text-ink-500">/ 100</span>
                    </span>
                    <span className={`text-xs font-bold ${selectedNode.impactScore > 75 ? 'text-red-600' : 'text-emerald-700'}`}>
                      {selectedNode.impactScore > 75 ? 'High Bottleneck' : 'Manageable'}
                    </span>
                  </div>
                  <div className="w-full bg-ink-200 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        selectedNode.impactScore > 75 ? 'bg-red-600' : 'bg-emerald-600'
                      }`}
                      style={{ width: `${selectedNode.impactScore}%` }}
                    />
                  </div>
                </div>

                <div className="p-2.5 rounded bg-ink-50 border border-ink-150 space-y-1">
                  <div className="text-[11px] text-ink-500">Current Delay Status:</div>
                  <div className="font-mono font-bold text-ink-900">
                    {selectedNode.daysDelayed} Calendar Days
                  </div>
                  <p className="text-[11px] text-ink-600 leading-relaxed pt-1">
                    <b>Field Intelligence:</b> {selectedNode.notes}
                  </p>
                </div>

                <div className="p-2.5 rounded bg-champagne-50 border border-champagne-200 text-xs">
                  <div className="font-bold text-champagne-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-champagne-700" />
                    <span>Cascading Risk Effect:</span>
                  </div>
                  <p className="text-[11px] text-ink-800 mt-1 leading-relaxed">
                    {selectedNode.criticalPath
                      ? `Since this node lies on the direct critical path, each 10 days of stall directly slips final commissioning by ~8.5 calendar days.`
                      : `Non-critical path node. It maintains a 25-day buffer before cascading into main civil execution schedule.`}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-10 text-xs text-ink-500">
              Select any dependency node to inspect propagation metrics.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
