import { Project, ProjectDataQualityIssue, DataQualityGrade } from '../types/project';

export interface DataQualitySummary {
  overallScore: number;
  goodCount: number;
  watchCount: number;
  poorCount: number;
  staleCount: number;
  mismatchCount: number;
  suspiciousCount: number;
  inconsistentCount: number;
  totalRecordsChecked: number;
  auditDate: string;
  flaggedProjects: {
    project: Project;
    issues: ProjectDataQualityIssue[];
  }[];
}

export function auditDataQuality(projects: Project[]): DataQualitySummary {
  let goodCount = 0;
  let watchCount = 0;
  let poorCount = 0;
  let staleCount = 0;
  let mismatchCount = 0;
  let suspiciousCount = 0;
  let inconsistentCount = 0;

  const flaggedProjects: { project: Project; issues: ProjectDataQualityIssue[] }[] = [];
  let totalScoreSum = 0;

  projects.forEach(p => {
    totalScoreSum += p.data_quality_score;

    if (p.data_quality_grade === 'GOOD') goodCount++;
    else if (p.data_quality_grade === 'WATCH') watchCount++;
    else poorCount++;

    if (p.data_staleness_days > 30) staleCount++;

    const hasMismatch = p.financial_progress_percentage > p.physical_progress_percentage + 20;
    if (hasMismatch) mismatchCount++;

    const hasSuspicious = p.data_quality_issues.some(i => i.type === 'SUSPICIOUS_REPORTING');
    if (hasSuspicious) suspiciousCount++;

    const hasInconsistent = p.data_quality_issues.some(i => i.type === 'INCONSISTENT_DATES' || i.type === 'INVALID_PERCENTAGE');
    if (hasInconsistent) inconsistentCount++;

    if (p.data_quality_issues.length > 0 || p.data_staleness_days > 30 || hasMismatch) {
      const combinedIssues = [...p.data_quality_issues];
      if (p.data_staleness_days > 30 && !combinedIssues.some(i => i.type === 'STALE_RECORD')) {
        combinedIssues.push({
          type: 'STALE_RECORD',
          severity: p.data_staleness_days > 60 ? 'POOR' : 'WATCH',
          field: 'last_update_date',
          description: `Last data refresh logged ${p.data_staleness_days} days ago (MoSPI SLA: 30 days max).`
        });
      }
      if (hasMismatch && !combinedIssues.some(i => i.type === 'EXPENDITURE_MISMATCH')) {
        combinedIssues.push({
          type: 'EXPENDITURE_MISMATCH',
          severity: p.financial_progress_percentage - p.physical_progress_percentage > 30 ? 'POOR' : 'WATCH',
          field: 'expenditure_percentage',
          description: `Financial expenditure (${p.financial_progress_percentage}%) leads physical execution (${p.physical_progress_percentage}%) by ${(p.financial_progress_percentage - p.physical_progress_percentage).toFixed(1)}%.`
        });
      }

      flaggedProjects.push({
        project: p,
        issues: combinedIssues
      });
    }
  });

  const overallScore = Math.round((totalScoreSum / Math.max(1, projects.length)) * 10) / 10;

  return {
    overallScore,
    goodCount,
    watchCount,
    poorCount,
    staleCount,
    mismatchCount,
    suspiciousCount,
    inconsistentCount,
    totalRecordsChecked: projects.length,
    auditDate: '2026-09-27',
    flaggedProjects
  };
}
