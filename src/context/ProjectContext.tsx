import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { Project, FilterOptions, UserRole, AuditAction, EarlyWarningAlert, RiskLevel } from '../types/project';
import { generateAllProjects } from '../data/generator';
import { generateEarlyWarningAlerts } from '../engine/earlyWarningEngine';

export type NavigationView =
  | 'DASHBOARD'
  | 'PROJECTS'
  | 'PROJECT_DETAIL'
  | 'DEPENDENCY_GRAPH'
  | 'EARLY_WARNING'
  | 'CUF_EXPERIMENT'
  | 'BENCHMARKING'
  | 'WHAT_IF'
  | 'AI_ASSISTANT'
  | 'DATA_QUALITY'
  | 'AUDIT_TRAIL';

interface ProjectContextType {
  projects: Project[];
  filteredProjects: Project[];
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  resetFilters: () => void;
  selectedProject: Project;
  setSelectedProject: (p: Project) => void;
  selectProjectById: (id: string) => boolean;
  currentView: NavigationView;
  setCurrentView: (view: NavigationView) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  auditLogs: AuditAction[];
  addAuditAction: (action: Omit<AuditAction, 'id' | 'timestamp' | 'officer_name' | 'officer_role'>) => void;
  earlyWarningAlerts: EarlyWarningAlert[];
  updateAlertStatus: (alertId: string, status: EarlyWarningAlert['status']) => void;
  activeReportModal: boolean;
  setActiveReportModal: (open: boolean) => void;
  showGateway: boolean;
  setShowGateway: (show: boolean) => void;
}

const defaultFilters: FilterOptions = {
  ministry: 'ALL',
  sector: 'ALL',
  state: 'ALL',
  risk_level: 'ALL',
  project_status: 'ALL',
  project_category: 'ALL',
  data_quality_grade: 'ALL',
  cost_min: 0,
  cost_max: 50000,
  delay_min: 0,
  search_query: ''
};

const INITIAL_AUDIT_LOGS: AuditAction[] = [
  {
    id: 'AUD-001',
    project_id: 'P-1024',
    project_name: 'Eastern Dedicated Freight Corridor — Sonnagar to Dankuni',
    action_type: 'ESCALATED',
    timestamp: '2026-09-26 11:30 AM',
    officer_name: 'Dr. R. K. Verma, IAS',
    officer_role: 'GOVERNMENT_ADMIN',
    notes: 'Escalated to Cabinet Secretariat Infrastructure Group due to 14.2 km RoW dispute in Rohtas district and 26% spend-progress mismatch.',
    evidence_snapshot: 'Physical: 42%, Financial: 68%, Delays: 5 milestones, Contractor: Default Warning',
    status: 'IN_PROGRESS'
  },
  {
    id: 'AUD-002',
    project_id: 'P-1612',
    project_name: 'Jal Jeevan Mission — Rural Multi-Village Piped Water, Bundelkhand',
    action_type: 'ASSIGNED_FOR_REVIEW',
    timestamp: '2026-09-25 04:15 PM',
    officer_name: 'Priyanka Sharma',
    officer_role: 'MONITORING_OFFICER',
    notes: 'Assigned Central Quality Auditor to inspect DI pipeline laying in Jhansi rural belt following 64-day data reporting staleness.',
    evidence_snapshot: 'Staleness: 64 days, Physical: 54%, Financial: 76.4%',
    status: 'IN_PROGRESS'
  },
  {
    id: 'AUD-003',
    project_id: 'P-1088',
    project_name: 'Delhi-Vadodara-Mumbai Greenfield Expressway (Package 17)',
    action_type: 'ACKNOWLEDGED',
    timestamp: '2026-09-24 02:40 PM',
    officer_name: 'Suresh Menon',
    officer_role: 'SENIOR_ANALYST',
    notes: 'Acknowledged high-risk alert triggered by National Board for Wildlife (NBWL) eco-duct clearance delay.',
    evidence_snapshot: 'NBWL clearance delay: 110 days on critical path',
    status: 'PENDING'
  },
  {
    id: 'AUD-004',
    project_id: 'P-1845',
    project_name: 'Western Dedicated Freight Corridor — Rewari to Madar',
    action_type: 'RESOLVED',
    timestamp: '2026-09-23 09:20 AM',
    officer_name: 'Dr. R. K. Verma, IAS',
    officer_role: 'GOVERNMENT_ADMIN',
    notes: 'Statutory safety clearance achieved; verified 95% physical completion against 92.5% financial disbursement. Benchmark status documented.',
    evidence_snapshot: 'CRS inspection passed. On-schedule status.',
    status: 'CLOSED'
  }
];

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load full synthetic dataset (1250 projects with showcase projects seeded)
  const [projects] = useState<Project[]>(() => generateAllProjects(1250));
  const [selectedProject, setSelectedProject] = useState<Project>(() => projects[0]);
  const [currentView, setCurrentView] = useState<NavigationView>('DASHBOARD');
  const [userRole, setUserRole] = useState<UserRole>('GOVERNMENT_ADMIN');
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [showGateway, setShowGateway] = useState<boolean>(true);
  const [activeReportModal, setActiveReportModal] = useState<boolean>(false);

  // Early warning alerts state
  const [earlyWarningAlerts, setEarlyWarningAlerts] = useState<EarlyWarningAlert[]>(() =>
    generateEarlyWarningAlerts(projects)
  );

  // Audit actions state
  const [auditLogs, setAuditLogs] = useState<AuditAction[]>(() => {
    try {
      const saved = localStorage.getItem('mospi_paimana_audit_logs');
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('mospi_paimana_audit_logs', JSON.stringify(auditLogs));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [auditLogs]);

  const addAuditAction = (action: Omit<AuditAction, 'id' | 'timestamp' | 'officer_name' | 'officer_role'>) => {
    const roleNameMap: Record<UserRole, string> = {
      GOVERNMENT_ADMIN: 'Dr. R. K. Verma, IAS (Joint Secretary MoSPI)',
      MONITORING_OFFICER: 'Priyanka Sharma (Director, Infrastructure Monitoring)',
      SENIOR_ANALYST: 'Suresh Menon (Lead Data Scientist, OCMS)'
    };

    const newAction: AuditAction = {
      ...action,
      id: `AUD-${Date.now().toString().slice(-5)}`,
      timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      officer_name: roleNameMap[userRole],
      officer_role: userRole
    };

    setAuditLogs(prev => [newAction, ...prev]);
  };

  const updateAlertStatus = (alertId: string, status: EarlyWarningAlert['status']) => {
    setEarlyWarningAlerts(prev =>
      prev.map(a => (a.id === alertId ? { ...a, status } : a))
    );
  };

  const selectProjectById = (id: string): boolean => {
    const found = projects.find(p => p.project_id.toLowerCase() === id.toLowerCase());
    if (found) {
      setSelectedProject(found);
      setCurrentView('PROJECT_DETAIL');
      return true;
    }
    return false;
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  // Filter computation
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      // Search query
      if (filters.search_query.trim()) {
        const q = filters.search_query.toLowerCase();
        const matchesQuery =
          p.project_id.toLowerCase().includes(q) ||
          p.project_name.toLowerCase().includes(q) ||
          p.ministry.toLowerCase().includes(q) ||
          p.implementing_agency.toLowerCase().includes(q) ||
          p.state.toLowerCase().includes(q) ||
          p.district.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // Ministry
      if (filters.ministry !== 'ALL' && p.ministry !== filters.ministry) return false;

      // Sector
      if (filters.sector !== 'ALL' && p.sector !== filters.sector) return false;

      // State
      if (filters.state !== 'ALL' && p.state !== filters.state) return false;

      // Risk Level
      if (filters.risk_level !== 'ALL' && p.risk_level !== filters.risk_level) return false;

      // Project Status
      if (filters.project_status !== 'ALL' && p.project_status !== filters.project_status) return false;

      // Category
      if (filters.project_category !== 'ALL' && p.project_category !== filters.project_category) return false;

      // Data Quality Grade
      if (filters.data_quality_grade !== 'ALL' && p.data_quality_grade !== filters.data_quality_grade) return false;

      // Cost Range
      if (p.approved_cost < filters.cost_min || p.approved_cost > filters.cost_max) return false;

      // Delay min
      if (p.days_delayed < filters.delay_min) return false;

      return true;
    });
  }, [projects, filters]);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        filteredProjects,
        filters,
        setFilters,
        resetFilters,
        selectedProject,
        setSelectedProject,
        selectProjectById,
        currentView,
        setCurrentView,
        userRole,
        setUserRole,
        auditLogs,
        addAuditAction,
        earlyWarningAlerts,
        updateAlertStatus,
        activeReportModal,
        setActiveReportModal,
        showGateway,
        setShowGateway
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
};
