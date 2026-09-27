import React, { useState, useMemo } from 'react';
import { useProjectContext } from '../../context/ProjectContext';
import { BarChart3, Layers, Building, MapPin, ArrowRight } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

export const BenchmarkingView: React.FC = () => {
  const { projects, selectedProject, setSelectedProject, setCurrentView } = useProjectContext();

  const [benchmarkDimension, setBenchmarkDimension] = useState<'SECTOR' | 'MINISTRY' | 'STATE'>('SECTOR');
  const activeProject = selectedProject || projects[0];

  // Aggregated Peer Group Statistics
  const dimensionAggregates = useMemo(() => {
    const stats: Record<string, {
      count: number;
      totalDelay: number;
      totalCostOverrun: number;
      totalPhysical: number;
      totalFinancial: number;
      totalDq: number;
      criticalCount: number;
    }> = {};

    projects.forEach(p => {
      const key =
        benchmarkDimension === 'SECTOR'
          ? p.sector
          : benchmarkDimension === 'MINISTRY'
          ? p.ministry.replace('Ministry of ', '')
          : p.state;

      if (!stats[key]) {
        stats[key] = {
          count: 0,
          totalDelay: 0,
          totalCostOverrun: 0,
          totalPhysical: 0,
          totalFinancial: 0,
          totalDq: 0,
          criticalCount: 0
        };
      }

      stats[key].count++;
      stats[key].totalDelay += p.days_delayed;
      stats[key].totalCostOverrun += p.cost_overrun_percentage;
      stats[key].totalPhysical += p.physical_progress_percentage;
      stats[key].totalFinancial += p.financial_progress_percentage;
      stats[key].totalDq += p.data_quality_score;
      if (p.risk_level === 'CRITICAL') stats[key].criticalCount++;
    });

    return Object.entries(stats)
      .map(([name, data]) => ({
        name: name.length > 20 ? name.slice(0, 18) + '...' : name,
        fullName: name,
        projectCount: data.count,
        avgDelay: Math.round(data.totalDelay / data.count),
        avgCostOverrun: Math.round((data.totalCostOverrun / data.count) * 10) / 10,
        avgPhysicalProgress: Math.round(data.totalPhysical / data.count),
        avgFinancialProgress: Math.round(data.totalFinancial / data.count),
        avgDq: Math.round(data.totalDq / data.count),
        criticalRatio: Math.round((data.criticalCount / data.count) * 100)
      }))
      .sort((a, b) => b.avgDelay - a.avgDelay)
      .slice(0, 10);
  }, [projects, benchmarkDimension]);

  // Peer group of activeProject (matching its sector)
  const peerGroupStats = useMemo(() => {
    const peers = projects.filter(p => p.sector === activeProject.sector);
    const avgDelay = Math.round(peers.reduce((acc, p) => acc + p.days_delayed, 0) / peers.length);
    const avgCostOverrun = Math.round((peers.reduce((acc, p) => acc + p.cost_overrun_percentage, 0) / peers.length) * 10) / 10;
    const avgPhysical = Math.round(peers.reduce((acc, p) => acc + p.physical_progress_percentage, 0) / peers.length);
    const avgFinancial = Math.round(peers.reduce((acc, p) => acc + p.financial_progress_percentage, 0) / peers.length);
    const avgDq = Math.round(peers.reduce((acc, p) => acc + p.data_quality_score, 0) / peers.length);
    const avgRisk = Math.round(peers.reduce((acc, p) => acc + p.overall_risk_score, 0) / peers.length);

    return {
      sector: activeProject.sector,
      peerCount: peers.length,
      avgDelay,
      avgCostOverrun,
      avgPhysical,
      avgFinancial,
      avgDq,
      avgRisk
    };
  }, [projects, activeProject]);

  // Radar comparison data
  const radarData = [
    { subject: 'Physical %', Project: activeProject.physical_progress_percentage, PeerAvg: peerGroupStats.avgPhysical },
    { subject: 'Financial %', Project: activeProject.financial_progress_percentage, PeerAvg: peerGroupStats.avgFinancial },
    { subject: 'Data Quality', Project: activeProject.data_quality_score, PeerAvg: peerGroupStats.avgDq },
    { subject: 'Risk Index', Project: activeProject.overall_risk_score, PeerAvg: peerGroupStats.avgRisk },
    { subject: 'Delay Factor', Project: Math.min(100, Math.round((activeProject.days_delayed / 365) * 60)), PeerAvg: Math.min(100, Math.round((peerGroupStats.avgDelay / 365) * 60)) }
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Title Header */}
      <div className="bg-white p-5 rounded-xl border border-ink-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-ink-900 text-champagne-300">
              <BarChart3 className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-ink-950 tracking-tight">
              Cross-Portfolio Benchmarking &amp; Peer Analytics
            </h2>
          </div>
          <p className="text-xs text-ink-500 mt-0.5">
            Objective comparative metrics across Ministries, Sectors, and States without subjective rankings
          </p>
        </div>

        {/* Dimension Switcher */}
        <div className="flex items-center gap-1.5 bg-ink-100 p-1 rounded-lg">
          {(['SECTOR', 'MINISTRY', 'STATE'] as const).map(dim => (
            <button
              key={dim}
              onClick={() => setBenchmarkDimension(dim)}
              className={`px-3 py-1.5 text-xs rounded-md font-semibold transition-colors ${
                benchmarkDimension === dim
                  ? 'bg-ink-900 text-white shadow-xs'
                  : 'text-ink-600 hover:text-ink-900'
              }`}
            >
              By {dim.charAt(0) + dim.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Aggregate Dimension Bar Chart */}
      <div className="bg-white p-5 rounded-xl border border-ink-200 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-ink-100">
          <div>
            <h3 className="font-bold text-sm text-ink-900">
              Comparative Analysis: Schedule Slippage vs Cost Escalation (By {benchmarkDimension})
            </h3>
            <p className="text-xs text-ink-500 mt-0.5">
              Average days delayed and average cost overrun percentage across top active portfolios
            </p>
          </div>
        </div>

        <div className="h-72 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dimensionAggregates} margin={{ top: 10, right: 20, left: -10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" angle={-15} textAnchor="end" interval={0} tick={{ fontSize: 11, fill: '#334155' }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#64748b' }} label={{ value: 'Avg Delay (Days)', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#64748b' }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#64748b' }} label={{ value: 'Cost Overrun %', angle: 90, position: 'insideRight', fontSize: 10, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar yAxisId="left" dataKey="avgDelay" name="Avg Delay (Days)" fill="#0f172a" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="avgCostOverrun" name="Cost Overrun %" fill="#d97706" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Selected Project Peer Benchmark Comparison Card */}
      <div className="bg-white p-5 rounded-xl border border-ink-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-ink-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 font-mono">
              Peer Group Benchmarking
            </span>
            <h3 className="font-bold text-sm text-ink-950 mt-0.5">
              Project [{activeProject.project_id}] vs {peerGroupStats.sector} Sector Baseline ({peerGroupStats.peerCount} Projects)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={activeProject.project_id}
              onChange={e => {
                const found = projects.find(p => p.project_id === e.target.value);
                if (found) setSelectedProject(found);
              }}
              className="bg-ink-50 border border-ink-300 rounded-lg px-2.5 py-1 text-xs text-ink-900 font-semibold"
            >
              {projects.slice(0, 20).map(p => (
                <option key={p.project_id} value={p.project_id}>
                  [{p.project_id}] {p.project_name.slice(0, 35)}...
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* Radar Chart */}
          <div className="lg:col-span-5 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="75%">
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#334155' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                <Radar name={activeProject.project_id} dataKey="Project" stroke="#ef4444" fill="#ef4444" fillOpacity={0.4} />
                <Radar name="Sector Peer Avg" dataKey="PeerAvg" stroke="#047857" fill="#047857" fillOpacity={0.25} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '5px' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Metric Comparison Table */}
          <div className="lg:col-span-7 bg-ink-50 p-4 rounded-xl border border-ink-200">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] uppercase font-bold text-ink-500 border-b border-ink-200">
                <tr>
                  <th className="pb-2">Performance Indicator</th>
                  <th className="pb-2 text-right">Project Value</th>
                  <th className="pb-2 text-right">Sector Median</th>
                  <th className="pb-2 text-right">Variance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-200 font-mono text-ink-800">
                <tr>
                  <td className="py-2.5 font-sans font-medium text-ink-900">Schedule Slippage (Days)</td>
                  <td className="py-2.5 text-right font-bold text-red-600">{activeProject.days_delayed}d</td>
                  <td className="py-2.5 text-right">{peerGroupStats.avgDelay}d</td>
                  <td className="py-2.5 text-right text-red-600">
                    {activeProject.days_delayed > peerGroupStats.avgDelay ? `+${activeProject.days_delayed - peerGroupStats.avgDelay}d` : `${activeProject.days_delayed - peerGroupStats.avgDelay}d`}
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 font-sans font-medium text-ink-900">Cost Overrun %</td>
                  <td className="py-2.5 text-right font-bold text-amber-700">+{activeProject.cost_overrun_percentage}%</td>
                  <td className="py-2.5 text-right">+{peerGroupStats.avgCostOverrun}%</td>
                  <td className="py-2.5 text-right text-amber-700">
                    {(activeProject.cost_overrun_percentage - peerGroupStats.avgCostOverrun).toFixed(1)}%
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 font-sans font-medium text-ink-900">Physical Execution %</td>
                  <td className="py-2.5 text-right font-bold text-emerald-700">{activeProject.physical_progress_percentage}%</td>
                  <td className="py-2.5 text-right">{peerGroupStats.avgPhysical}%</td>
                  <td className="py-2.5 text-right text-ink-600">
                    {(activeProject.physical_progress_percentage - peerGroupStats.avgPhysical).toFixed(1)}%
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 font-sans font-medium text-ink-900">Data Quality Score</td>
                  <td className="py-2.5 text-right font-bold text-ink-900">{activeProject.data_quality_score}%</td>
                  <td className="py-2.5 text-right">{peerGroupStats.avgDq}%</td>
                  <td className="py-2.5 text-right text-emerald-700">
                    {activeProject.data_quality_score >= peerGroupStats.avgDq ? 'Compliant' : 'Below Peer'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
