import React, { useState, useMemo } from 'react';
import { useProjectContext } from '../../context/ProjectContext';
import { Project, RiskLevel, DataQualityGrade, ProjectStatus } from '../../types/project';
import { RiskBadge, DataQualityBadge, StatusBadge } from '../common/StatusBadge';
import {
  Search,
  Filter,
  Download,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Eye,
  Building,
  MapPin,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

export const ProjectList: React.FC = () => {
  const {
    projects,
    filteredProjects,
    filters,
    setFilters,
    resetFilters,
    setSelectedProject,
    setCurrentView
  } = useProjectContext();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Unique filter option values
  const ministries = useMemo(() => ['ALL', ...Array.from(new Set(projects.map(p => p.ministry)))], [projects]);
  const sectors = useMemo(() => ['ALL', ...Array.from(new Set(projects.map(p => p.sector)))], [projects]);
  const states = useMemo(() => ['ALL', ...Array.from(new Set(projects.map(p => p.state))).sort()], [projects]);

  // Paginated records
  const totalPages = Math.ceil(filteredProjects.length / pageSize);
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProjects.slice(start, start + pageSize);
  }, [filteredProjects, currentPage]);

  const handleInspect = (project: Project) => {
    setSelectedProject(project);
    setCurrentView('PROJECT_DETAIL');
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      'Project ID',
      'Project Name',
      'Ministry',
      'Department',
      'Sector',
      'State',
      'District',
      'Agency',
      'Category',
      'Status',
      'Approved Cost (Cr)',
      'Revised Cost (Cr)',
      'Cost Overrun %',
      'Physical Progress %',
      'Financial Progress %',
      'Days Delayed',
      'Expected Completion',
      'Risk Score',
      'Risk Level',
      'Data Quality Score'
    ];

    const rows = filteredProjects.map(p => [
      `"${p.project_id}"`,
      `"${p.project_name.replace(/"/g, '""')}"`,
      `"${p.ministry}"`,
      `"${p.department}"`,
      `"${p.sector}"`,
      `"${p.state}"`,
      `"${p.district}"`,
      `"${p.implementing_agency}"`,
      `"${p.project_category}"`,
      `"${p.project_status}"`,
      p.approved_cost,
      p.revised_cost,
      p.cost_overrun_percentage,
      p.physical_progress_percentage,
      p.financial_progress_percentage,
      p.days_delayed,
      `"${p.current_expected_completion_date}"`,
      p.overall_risk_score,
      `"${p.risk_level}"`,
      p.data_quality_score
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mospi_paimana_projects_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Title & Quick Summary Bar */}
      <div className="bg-white p-4 rounded-xl border border-ink-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            <h2 className="text-lg font-bold text-ink-950 tracking-tight">
              National Infrastructure Projects Registry
            </h2>
            <span className="text-xs bg-ink-100 text-ink-700 font-mono font-bold px-2 py-0.5 rounded-full">
              {filteredProjects.length.toLocaleString()} of {projects.length.toLocaleString()} Projects
            </span>
          </div>
          <p className="text-xs text-ink-500 mt-0.5">
            Filter, search and drill down into central sector projects across all ministries, implementing agencies and states.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Showcase Filter Button */}
          <button
            onClick={() => {
              resetFilters();
              setFilters(prev => ({ ...prev, search_query: 'P-1024' }));
            }}
            className="px-3 py-1.5 rounded-lg bg-champagne-100 hover:bg-champagne-200 text-champagne-900 border border-champagne-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-champagne-700" />
            <span>Showcase Project P-1024</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Filtered CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Matrix Card */}
      <div className="bg-white p-4 rounded-xl border border-ink-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-ink-100">
          <div className="flex items-center gap-1.5 text-xs font-bold text-ink-800">
            <Filter className="w-3.5 h-3.5 text-emerald-600" />
            <span>Multi-Criteria Filtering</span>
          </div>
          <button
            onClick={resetFilters}
            className="text-xs text-ink-500 hover:text-ink-800 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        </div>

        {/* Filter Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {/* Search Query */}
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-semibold text-ink-700 mb-1">
              Search by Keyword / ID
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                type="text"
                placeholder="e.g. P-1024, Eastern, DFCCIL, Rail..."
                value={filters.search_query}
                onChange={e => {
                  setFilters(prev => ({ ...prev, search_query: e.target.value }));
                  setCurrentPage(1);
                }}
                className="w-full bg-ink-50 border border-ink-300 rounded-md pl-8 pr-2.5 py-1.5 text-xs text-ink-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Ministry */}
          <div>
            <label className="block text-[11px] font-semibold text-ink-700 mb-1">Ministry</label>
            <select
              value={filters.ministry}
              onChange={e => {
                setFilters(prev => ({ ...prev, ministry: e.target.value }));
                setCurrentPage(1);
              }}
              className="w-full bg-ink-50 border border-ink-300 rounded-md px-2 py-1.5 text-xs text-ink-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {ministries.map(m => (
                <option key={m} value={m}>
                  {m === 'ALL' ? 'All Ministries' : m.replace('Ministry of ', '')}
                </option>
              ))}
            </select>
          </div>

          {/* Sector */}
          <div>
            <label className="block text-[11px] font-semibold text-ink-700 mb-1">Sector</label>
            <select
              value={filters.sector}
              onChange={e => {
                setFilters(prev => ({ ...prev, sector: e.target.value }));
                setCurrentPage(1);
              }}
              className="w-full bg-ink-50 border border-ink-300 rounded-md px-2 py-1.5 text-xs text-ink-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {sectors.map(s => (
                <option key={s} value={s}>
                  {s === 'ALL' ? 'All Sectors' : s}
                </option>
              ))}
            </select>
          </div>

          {/* State */}
          <div>
            <label className="block text-[11px] font-semibold text-ink-700 mb-1">State / UT</label>
            <select
              value={filters.state}
              onChange={e => {
                setFilters(prev => ({ ...prev, state: e.target.value }));
                setCurrentPage(1);
              }}
              className="w-full bg-ink-50 border border-ink-300 rounded-md px-2 py-1.5 text-xs text-ink-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {states.map(s => (
                <option key={s} value={s}>
                  {s === 'ALL' ? 'All States & UTs' : s}
                </option>
              ))}
            </select>
          </div>

          {/* Risk Level */}
          <div>
            <label className="block text-[11px] font-semibold text-ink-700 mb-1">Risk Level</label>
            <select
              value={filters.risk_level}
              onChange={e => {
                setFilters(prev => ({ ...prev, risk_level: e.target.value }));
                setCurrentPage(1);
              }}
              className="w-full bg-ink-50 border border-ink-300 rounded-md px-2 py-1.5 text-xs text-ink-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="CRITICAL">🔴 Critical Risk (&gt;80)</option>
              <option value="HIGH">🟠 High Risk (60-80)</option>
              <option value="MODERATE">🟡 Moderate Risk (35-60)</option>
              <option value="LOW">🟢 Low Risk (&lt;35)</option>
            </select>
          </div>
        </div>

        {/* Secondary filters row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs pt-1">
          {/* Status */}
          <div>
            <label className="block text-[11px] font-semibold text-ink-700 mb-1">Execution Status</label>
            <select
              value={filters.project_status}
              onChange={e => {
                setFilters(prev => ({ ...prev, project_status: e.target.value }));
                setCurrentPage(1);
              }}
              className="w-full bg-ink-50 border border-ink-300 rounded-md px-2 py-1.5 text-xs text-ink-900"
            >
              <option value="ALL">All Statuses</option>
              <option value="ON_SCHEDULE">On Schedule</option>
              <option value="DELAYED">Delayed</option>
              <option value="CRITICAL_DELAY">Critical Delay</option>
              <option value="STALLED">Stalled</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-[11px] font-semibold text-ink-700 mb-1">Project Category</label>
            <select
              value={filters.project_category}
              onChange={e => {
                setFilters(prev => ({ ...prev, project_category: e.target.value }));
                setCurrentPage(1);
              }}
              className="w-full bg-ink-50 border border-ink-300 rounded-md px-2 py-1.5 text-xs text-ink-900"
            >
              <option value="ALL">All Categories</option>
              <option value="MEGA (₹1000+ Cr)">MEGA (₹1000+ Cr)</option>
              <option value="MAJOR (₹150-1000 Cr)">MAJOR (₹150-1000 Cr)</option>
              <option value="MEDIUM (<₹150 Cr)">MEDIUM (&lt;₹150 Cr)</option>
            </select>
          </div>

          {/* Data Quality */}
          <div>
            <label className="block text-[11px] font-semibold text-ink-700 mb-1">Data Quality Grade</label>
            <select
              value={filters.data_quality_grade}
              onChange={e => {
                setFilters(prev => ({ ...prev, data_quality_grade: e.target.value }));
                setCurrentPage(1);
              }}
              className="w-full bg-ink-50 border border-ink-300 rounded-md px-2 py-1.5 text-xs text-ink-900"
            >
              <option value="ALL">All Data Quality</option>
              <option value="GOOD">Good (80-100%)</option>
              <option value="WATCH">Watch (60-79%)</option>
              <option value="POOR">Poor (&lt;60%)</option>
            </select>
          </div>

          {/* Delay Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-ink-700 mb-1">
              Minimum Delay: {filters.delay_min} Days
            </label>
            <input
              type="range"
              min={0}
              max={600}
              step={30}
              value={filters.delay_min}
              onChange={e => {
                setFilters(prev => ({ ...prev, delay_min: Number(e.target.value) }));
                setCurrentPage(1);
              }}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-xl border border-ink-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ink-900 text-white font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-3">Project ID &amp; Name</th>
                <th className="py-3 px-3">Ministry &amp; Sector</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3 text-right">Approved / Revised (₹ Cr)</th>
                <th className="py-3 px-3 text-center">Progress (Phy / Fin)</th>
                <th className="py-3 px-3 text-right">Delay (Days)</th>
                <th className="py-3 px-3 text-center">Data Quality</th>
                <th className="py-3 px-3 text-center">CUF+ Risk Score</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-150">
              {paginatedProjects.length > 0 ? (
                paginatedProjects.map((p, idx) => {
                  const hasDiscrepancy = p.financial_progress_percentage - p.physical_progress_percentage >= 20;
                  return (
                    <tr
                      key={p.project_id}
                      className={`hover:bg-emerald-50/40 transition-colors ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-ink-50/40'
                      }`}
                    >
                      {/* ID & Name */}
                      <td className="py-3 px-3 max-w-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-ink-950 text-xs">
                            {p.project_id}
                          </span>
                          {p.is_showcase && (
                            <span className="bg-champagne-100 text-champagne-900 border border-champagne-300 text-[9px] font-bold px-1.5 py-0.2 rounded">
                              SHOWCASE
                            </span>
                          )}
                        </div>
                        <div className="font-semibold text-ink-800 truncate mt-0.5" title={p.project_name}>
                          {p.project_name}
                        </div>
                        <div className="text-[10px] text-ink-400 mt-0.5">
                          Agency: <span className="text-ink-600 font-medium">{p.implementing_agency}</span>
                        </div>
                      </td>

                      {/* Ministry & Sector */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-medium text-ink-800 text-[11px] truncate max-w-[180px]">
                          {p.ministry.replace('Ministry of ', '')}
                        </div>
                        <div className="text-[10px] text-ink-500">{p.sector}</div>
                        <div className="mt-1">
                          <StatusBadge status={p.project_status} />
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-medium text-ink-800 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-ink-400" />
                          <span>{p.state}</span>
                        </div>
                        <div className="text-[10px] text-ink-400 ml-4">{p.district}</div>
                      </td>

                      {/* Financials */}
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="font-mono font-bold text-ink-900">
                          ₹{p.revised_cost.toLocaleString()} Cr
                        </div>
                        <div className="text-[10px] text-ink-400 font-mono">
                          Appr: ₹{p.approved_cost.toLocaleString()} Cr
                        </div>
                        {p.cost_overrun_percentage > 0 && (
                          <div className="text-[10px] font-bold text-amber-700">
                            +{p.cost_overrun_percentage}% (+₹{p.cost_variance.toLocaleString()} Cr)
                          </div>
                        )}
                      </td>

                      {/* Progress Comparison */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <span className="font-bold text-ink-800">{p.physical_progress_percentage}%</span>
                          <span className="text-ink-300">/</span>
                          <span className={`font-bold ${hasDiscrepancy ? 'text-red-600' : 'text-ink-800'}`}>
                            {p.financial_progress_percentage}%
                          </span>
                        </div>
                        <div className="w-24 bg-ink-200 h-1.5 rounded-full mx-auto mt-1 overflow-hidden relative">
                          <div
                            className="bg-emerald-600 h-full rounded-full"
                            style={{ width: `${p.physical_progress_percentage}%` }}
                          />
                        </div>
                        {hasDiscrepancy && (
                          <div className="text-[9px] font-bold text-red-600 mt-0.5">
                            Spend +{(p.financial_progress_percentage - p.physical_progress_percentage).toFixed(0)}%
                          </div>
                        )}
                      </td>

                      {/* Days Delayed */}
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className={`font-mono font-bold ${p.days_delayed > 180 ? 'text-red-600' : p.days_delayed > 60 ? 'text-amber-700' : 'text-emerald-700'}`}>
                          {p.days_delayed} days
                        </div>
                        <div className="text-[10px] text-ink-400">
                          Exp: {p.current_expected_completion_date}
                        </div>
                      </td>

                      {/* Data Quality */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <DataQualityBadge grade={p.data_quality_grade} score={p.data_quality_score} />
                      </td>

                      {/* Risk Score */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <div className="flex flex-col items-center">
                          <RiskBadge level={p.risk_level} size="sm" />
                          <span className="font-mono text-xs font-bold text-ink-900 mt-0.5">
                            {p.overall_risk_score} / 100
                          </span>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleInspect(p)}
                          className="px-2.5 py-1 bg-ink-900 hover:bg-ink-800 text-white rounded text-[11px] font-semibold flex items-center gap-1 mx-auto transition-colors"
                        >
                          <Eye className="w-3 h-3 text-champagne-300" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-ink-500">
                    <p className="font-semibold text-sm">No projects matching the selected filter criteria.</p>
                    <button
                      onClick={resetFilters}
                      className="mt-2 text-xs text-emerald-700 hover:underline font-bold"
                    >
                      Clear All Filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-3 bg-ink-50/80 border-t border-ink-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-600">
          <div>
            Showing <span className="font-bold text-ink-900">{Math.min(filteredProjects.length, (currentPage - 1) * pageSize + 1)}</span> to{' '}
            <span className="font-bold text-ink-900">{Math.min(filteredProjects.length, currentPage * pageSize)}</span> of{' '}
            <span className="font-bold text-ink-900">{filteredProjects.length.toLocaleString()}</span> entries
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-1.5 rounded border border-ink-300 bg-white hover:bg-ink-100 disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="font-medium text-xs text-ink-800">
              Page <span className="font-bold">{currentPage}</span> of <span className="font-bold">{totalPages || 1}</span>
            </span>

            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded border border-ink-300 bg-white hover:bg-ink-100 disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
