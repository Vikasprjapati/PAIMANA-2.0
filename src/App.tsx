import React from 'react';
import { ProjectProvider, useProjectContext } from './context/ProjectContext';
import { GovHeader } from './components/common/GovHeader';
import { GovFooter } from './components/common/GovFooter';
import { Sidebar } from './components/common/Sidebar';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { ProjectList } from './components/projects/ProjectList';
import { ProjectDetail } from './components/projects/ProjectDetail';
import { DependencyGraph } from './components/intelligence/DependencyGraph';
import { EarlyWarningCenter } from './components/earlywarning/EarlyWarningCenter';
import { CUFComparison } from './components/cuf/CUFComparison';
import { BenchmarkingView } from './components/benchmarking/BenchmarkingView';
import { WhatIfSimulator } from './components/simulator/WhatIfSimulator';
import { AIAssistant } from './components/assistant/AIAssistant';
import { DataQualityCenter } from './components/dataquality/DataQualityCenter';
import { AuditTrailView } from './components/audit/AuditTrailView';
import { GatewayModal } from './components/landing/GatewayModal';
import { ReportGeneratorModal } from './components/reports/ReportGeneratorModal';

const MainLayout: React.FC = () => {
  const { currentView, selectedProject, setSelectedProject, projects } = useProjectContext();

  const renderActiveView = () => {
    switch (currentView) {
      case 'DASHBOARD':
        return <ExecutiveDashboard />;
      case 'PROJECTS':
        return <ProjectList />;
      case 'PROJECT_DETAIL':
        return <ProjectDetail />;
      case 'DEPENDENCY_GRAPH':
        return (
          <div className="space-y-4 pb-12">
            <div className="bg-white p-4 rounded-xl border border-ink-200 shadow-xs flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-ink-950">
                  National Dependency Intelligence Graph
                </h2>
                <p className="text-xs text-ink-500">
                  Inspecting critical path bottlenecks for: <b>[{selectedProject?.project_id}] {selectedProject?.project_name}</b>
                </p>
              </div>
              <select
                value={selectedProject?.project_id}
                onChange={e => {
                  const target = projects.find(p => p.project_id === e.target.value);
                  if (target) setSelectedProject(target);
                }}
                className="bg-ink-50 border border-ink-300 rounded-lg px-2.5 py-1 text-xs text-ink-900 font-semibold"
              >
                {projects.slice(0, 30).map(p => (
                  <option key={p.project_id} value={p.project_id}>
                    [{p.project_id}] {p.project_name.slice(0, 35)}...
                  </option>
                ))}
              </select>
            </div>
            {selectedProject && <DependencyGraph project={selectedProject} />}
          </div>
        );
      case 'EARLY_WARNING':
        return <EarlyWarningCenter />;
      case 'CUF_EXPERIMENT':
        return <CUFComparison />;
      case 'BENCHMARKING':
        return <BenchmarkingView />;
      case 'WHAT_IF':
        return <WhatIfSimulator />;
      case 'AI_ASSISTANT':
        return <AIAssistant />;
      case 'DATA_QUALITY':
        return <DataQualityCenter />;
      case 'AUDIT_TRAIL':
        return <AuditTrailView />;
      default:
        return <ExecutiveDashboard />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-ink-50 text-ink-900 font-sans antialiased">
      {/* Official Government Header */}
      <GovHeader />

      {/* Main App Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Dynamic Main Workspace View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Official Government Footer */}
      <GovFooter />

      {/* Modals */}
      <GatewayModal />
      <ReportGeneratorModal />
    </div>
  );
};

export function App() {
  return (
    <ProjectProvider>
      <MainLayout />
    </ProjectProvider>
  );
}

export default App;
