export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
export type DataQualityGrade = 'GOOD' | 'WATCH' | 'POOR';
export type ProjectStatus = 'ON_SCHEDULE' | 'DELAYED' | 'CRITICAL_DELAY' | 'COMPLETED' | 'STALLED';
export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'WATCH';
export type UserRole = 'GOVERNMENT_ADMIN' | 'MONITORING_OFFICER' | 'SENIOR_ANALYST';

export interface Milestone {
  id: string;
  name: string;
  target_date: string;
  revised_date: string;
  actual_date?: string;
  status: 'COMPLETED' | 'ON_TRACK' | 'DELAYED' | 'CRITICAL';
  weightage_percentage: number;
}

export interface DependencyNode {
  id: string;
  name: string;
  category: 'LAND' | 'ENVIRONMENT' | 'UTILITY' | 'PROCUREMENT' | 'CONTRACTOR' | 'CIVIL';
  status: 'RESOLVED' | 'IN_PROGRESS' | 'BLOCKED' | 'CRITICAL_DELAY';
  daysDelayed: number;
  criticalPath: boolean;
  impactScore: number; // 0 - 100
  notes: string;
}

export interface RiskFactorContribution {
  factor: string;
  category: 'PROGRESS' | 'FINANCIAL' | 'CONTRACTOR' | 'PROCUREMENT' | 'DEPENDENCY' | 'DATA';
  contribution: number; // percentage contribution to overall risk (+ or -)
  evidence: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  benchmarkComparison?: string;
}

export interface AuditAction {
  id: string;
  project_id: string;
  project_name: string;
  action_type: 'ACKNOWLEDGED' | 'ASSIGNED_FOR_REVIEW' | 'UNDER_ACTION' | 'RESOLVED' | 'NOTE_ADDED' | 'ESCALATED';
  timestamp: string;
  officer_name: string;
  officer_role: UserRole;
  notes: string;
  evidence_snapshot?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'CLOSED';
}

export interface EarlyWarningAlert {
  id: string;
  project_id: string;
  project_name: string;
  ministry: string;
  sector: string;
  severity: AlertSeverity;
  trigger: string;
  evidence: string;
  detected_date: string;
  recommended_action: string;
  status: 'UNREAD' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'RESOLVED';
  assigned_officer?: string;
}

export interface ProjectDataQualityIssue {
  type: 'MISSING_VALUE' | 'STALE_RECORD' | 'INCONSISTENT_DATES' | 'INVALID_PERCENTAGE' | 'EXPENDITURE_MISMATCH' | 'SUSPICIOUS_REPORTING';
  severity: 'POOR' | 'WATCH';
  field: string;
  description: string;
}

export interface Project {
  // 1. Basic Info
  project_id: string;
  project_name: string;
  ministry: string;
  department: string;
  sector: string;
  state: string;
  district: string;
  implementing_agency: string;
  project_type: 'INFRASTRUCTURE' | 'SOCIAL' | 'ENERGY' | 'DIGITAL' | 'STRATEGIC';
  project_category: 'MEGA (₹1000+ Cr)' | 'MAJOR (₹150-1000 Cr)' | 'MEDIUM (<₹150 Cr)';
  project_status: ProjectStatus;

  // 2. Financial (Values in ₹ Crores)
  approved_cost: number;
  revised_cost: number;
  expenditure_to_date: number;
  remaining_budget: number;
  expenditure_percentage: number;
  cost_variance: number; // revised_cost - approved_cost
  cost_overrun_percentage: number;

  // 3. Time & Progress
  approval_date: string;
  original_start_date: string;
  original_completion_date: string;
  revised_completion_date: string;
  current_expected_completion_date: string;
  physical_progress_percentage: number;
  financial_progress_percentage: number;
  schedule_variance_days: number;
  days_delayed: number;
  expected_delay_days: number;

  // 4. Implementation
  milestones_total: number;
  milestones_completed: number;
  milestones_delayed: number;
  contractor_status: 'SATISFACTORY' | 'UNDER_REVIEW' | 'DEFAULT_WARNING' | 'PENALIZED';
  tender_status: 'AWARDED' | 'RE-TENDERED' | 'DISPUTED' | 'COMPLETED';
  land_acquisition_status: 'FULLY_ACQUIRED' | 'PARTIAL' | 'DISPUTED' | 'NOT_STARTED';
  environmental_clearance: 'APPROVED' | 'CONDITIONAL' | 'PENDING' | 'REJECTED';
  utility_shift_status: 'COMPLETED' | 'IN_PROGRESS' | 'STALLED';
  manpower_availability: 'ADEQUATE' | 'DEFICIT_MILD' | 'DEFICIT_SEVERE';
  material_availability: 'NORMAL' | 'SHORTAGE' | 'CRITICAL';
  procurement_delay_days: number;
  payment_delay_days: number;

  // 5. Risk Variables
  historical_delay_rate: number; // 0.0 to 1.0
  contractor_performance_score: number; // 0 to 100
  regional_risk_index: number; // 0 to 100
  dependency_count: number;
  unresolved_issues_count: number;
  complaint_count: number;
  inspection_findings_count: number;
  previous_revision_count: number;
  data_staleness_days: number;
  reporting_frequency_days: number;

  // 6. Monitoring & Scores
  last_update_date: string;
  last_inspection_date: string;
  monitoring_frequency: 'FORTNIGHTLY' | 'MONTHLY' | 'QUARTERLY';
  data_quality_score: number; // 0 to 100
  data_quality_grade: DataQualityGrade;
  data_quality_issues: ProjectDataQualityIssue[];

  // 7. AI & Predictive Metrics
  CUF_score: number; // Baseline score 0 - 100
  CUF_plus_score: number; // Extended score 0 - 100
  overall_risk_score: number; // 0 - 100
  risk_level: RiskLevel;
  cost_overrun_probability: number; // 0 - 100%
  time_overrun_probability: number; // 0 - 100%
  model_confidence: number; // 0 - 100%
  predicted_delay_months: number;
  predicted_cost_overrun_crores: number;

  // 8. Qualitative & Structural
  milestones: Milestone[];
  dependencies: DependencyNode[];
  risk_drivers: RiskFactorContribution[];
  recommended_interventions: string[];
  is_showcase?: boolean;
}

export interface FilterOptions {
  ministry: string;
  sector: string;
  state: string;
  risk_level: string;
  project_status: string;
  project_category: string;
  data_quality_grade: string;
  cost_min: number;
  cost_max: number;
  delay_min: number;
  search_query: string;
}

export interface ModelMetricComparison {
  metric: string;
  cuf_baseline: number;
  cuf_plus: number;
  difference: string;
  interpretation: string;
}
