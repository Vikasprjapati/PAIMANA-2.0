import { Project, EarlyWarningAlert, AlertSeverity } from '../types/project';

export function generateEarlyWarningAlerts(projects: Project[]): EarlyWarningAlert[] {
  const alerts: EarlyWarningAlert[] = [];

  projects.forEach(p => {
    // 1. Critical Delay Alert
    if (p.expected_delay_days >= 300 || p.predicted_delay_months >= 12) {
      alerts.push({
        id: `EW-CD-${p.project_id}`,
        project_id: p.project_id,
        project_name: p.project_name,
        ministry: p.ministry,
        sector: p.sector,
        severity: 'CRITICAL',
        trigger: 'Expected completion delay severely exceeds statutory threshold.',
        evidence: `Accumulated delay is ${p.days_delayed} days; AI model forecasts further completion slippage of ${p.predicted_delay_months} months. Schedule variance: ${p.schedule_variance_days} days.`,
        detected_date: '2026-09-24',
        recommended_action: 'Initiate departmental high-level review with Line Ministry and invoke contractual milestone recovery protocol.',
        status: 'UNREAD'
      });
    }

    // 2. Financial vs Physical Divergence Alert
    if (p.financial_progress_percentage - p.physical_progress_percentage >= 20) {
      alerts.push({
        id: `EW-FP-${p.project_id}`,
        project_id: p.project_id,
        project_name: p.project_name,
        ministry: p.ministry,
        sector: p.sector,
        severity: p.financial_progress_percentage - p.physical_progress_percentage >= 30 ? 'CRITICAL' : 'HIGH',
        trigger: 'Physical progress significantly trails financial expenditure.',
        evidence: `Disbursement stands at ${p.financial_progress_percentage}% (₹${p.expenditure_to_date.toLocaleString()} Cr) against verified physical milestone completion of only ${p.physical_progress_percentage}%. Unreconciled gap: ${(p.financial_progress_percentage - p.physical_progress_percentage).toFixed(1)}%.`,
        detected_date: '2026-09-25',
        recommended_action: 'Depute MoSPI/Line Ministry technical auditor for physical work verification and hold further fund releases pending reconciliation.',
        status: 'UNREAD'
      });
    }

    // 3. Contractor / Multiple Milestones Failure
    if (p.milestones_delayed >= 3 || p.contractor_status === 'DEFAULT_WARNING' || p.contractor_status === 'PENALIZED') {
      alerts.push({
        id: `EW-CM-${p.project_id}`,
        project_id: p.project_id,
        project_name: p.project_name,
        ministry: p.ministry,
        sector: p.sector,
        severity: 'HIGH',
        trigger: 'Repeated milestone failure & contractor performance distress.',
        evidence: `${p.milestones_delayed} of ${p.milestones_total} milestones delayed. Contractor status: ${p.contractor_status}. Contractor rating score is ${p.contractor_performance_score}/100.`,
        detected_date: '2026-09-22',
        recommended_action: 'Serve formal contractual cure period notice under EPC agreement and initiate contingency retendering or package bifurcation.',
        status: 'UNREAD'
      });
    }

    // 4. Critical Path Dependency Blocked
    const blockedDep = p.dependencies.find(d => d.criticalPath && (d.status === 'BLOCKED' || d.status === 'CRITICAL_DELAY'));
    if (blockedDep) {
      alerts.push({
        id: `EW-DEP-${p.project_id}-${blockedDep.id}`,
        project_id: p.project_id,
        project_name: p.project_name,
        ministry: p.ministry,
        sector: p.sector,
        severity: blockedDep.impactScore > 85 ? 'HIGH' : 'MEDIUM',
        trigger: `Critical path dependency stalled: ${blockedDep.name}`,
        evidence: `Dependency '${blockedDep.name}' has been blocked for ${blockedDep.daysDelayed} days with impact score ${blockedDep.impactScore}/100. Notes: ${blockedDep.notes}`,
        detected_date: '2026-09-20',
        recommended_action: `Flag ${blockedDep.category} dependency for State Apex / District Level Committee single-window resolution.`,
        status: 'UNREAD'
      });
    }

    // 5. Data Staleness Warning
    if (p.data_staleness_days >= 35) {
      alerts.push({
        id: `EW-DS-${p.project_id}`,
        project_id: p.project_id,
        project_name: p.project_name,
        ministry: p.ministry,
        sector: p.sector,
        severity: 'WATCH',
        trigger: 'Monitoring data has exceeded permissible freshness window.',
        evidence: `Last monitoring submission received on ${p.last_update_date} (${p.data_staleness_days} days ago). Reporting mandate SLA: 30 days.`,
        detected_date: '2026-09-26',
        recommended_action: 'Issue automated compliance reminder to implementing agency nodal officer for digital status update.',
        status: 'UNREAD'
      });
    }
  });

  // Sort by severity (CRITICAL > HIGH > MEDIUM > WATCH) and limit to top realistic pool
  const severityOrder: Record<AlertSeverity, number> = {
    'CRITICAL': 0,
    'HIGH': 1,
    'MEDIUM': 2,
    'WATCH': 3
  };

  return alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
}
