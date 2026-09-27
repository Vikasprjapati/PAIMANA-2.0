import { Project } from '../types/project';

export interface AssistantMessage {
  id: string;
  sender: 'USER' | 'ASSISTANT';
  text: string;
  timestamp: string;
  relatedProjectIds?: string[];
  actionLinks?: { label: string; view: string; projectId?: string }[];
}

export function queryAssistant(
  prompt: string,
  projects: Project[],
  selectedProject?: Project | null
): AssistantMessage {
  const normalized = prompt.toLowerCase().trim();
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. "Which projects require immediate attention?"
  if (
    normalized.includes('immediate attention') ||
    normalized.includes('critical projects') ||
    normalized.includes('require attention') ||
    normalized.includes('urgent')
  ) {
    const criticalProjects = projects
      .filter(p => p.risk_level === 'CRITICAL')
      .sort((a, b) => b.overall_risk_score - a.overall_risk_score)
      .slice(0, 5);

    let response = `### 🚨 Projects Requiring Immediate MoSPI Intervention\n\n`;
    response += `Based on multi-variable **CUF+ risk scoring**, the following **${criticalProjects.length} projects** require urgent inter-ministerial attention due to severe schedule deviations or financial anomalies:\n\n`;

    criticalProjects.forEach((p, idx) => {
      response += `${idx + 1}. **[${p.project_id}] ${p.project_name}**\n`;
      response += `   • **Ministry:** ${p.ministry} (${p.sector})\n`;
      response += `   • **Risk Score:** **${p.overall_risk_score}/100 (CRITICAL)** | Predicted Delay: **${p.predicted_delay_months} months**\n`;
      response += `   • **Cost Overrun:** +${p.cost_overrun_percentage}% (+₹${p.cost_variance.toLocaleString()} Cr)\n`;
      response += `   • **Primary Blocker:** ${p.risk_drivers[0]?.evidence || 'Critical milestone stall'}\n\n`;
    });

    response += `> **Recommended Action:** Convene an urgent Joint Review Committee with the respective Line Ministries and initiate expenditure-physical progress reconciliation audits.`;

    return {
      id: `msg-${Date.now()}`,
      sender: 'ASSISTANT',
      text: response,
      timestamp,
      relatedProjectIds: criticalProjects.map(p => p.project_id),
      actionLinks: criticalProjects.slice(0, 3).map(p => ({
        label: `Inspect ${p.project_id}`,
        view: 'PROJECT_DETAIL',
        projectId: p.project_id
      }))
    };
  }

  // 2. Specific project lookup: "Why is Project P-1024 high risk?" or matches project ID
  const pidMatch = normalized.match(/p-\d{4}/i);
  const targetPid = pidMatch ? pidMatch[0].toUpperCase() : selectedProject?.project_id;

  if (targetPid && (normalized.includes('why') || normalized.includes('risk') || normalized.includes('p-') || normalized.includes('driver') || normalized.includes('status'))) {
    const foundProject = projects.find(p => p.project_id.toUpperCase() === targetPid);
    if (foundProject) {
      let response = `### 🔍 Intelligence Brief: [${foundProject.project_id}] ${foundProject.project_name}\n\n`;
      response += `**Current Risk Assessment:** **${foundProject.overall_risk_score}/100 (${foundProject.risk_level})**\n`;
      response += `• **Approved Cost:** ₹${foundProject.approved_cost.toLocaleString()} Cr | **Revised:** ₹${foundProject.revised_cost.toLocaleString()} Cr (+${foundProject.cost_overrun_percentage}%)\n`;
      response += `• **Physical vs Financial:** Physical **${foundProject.physical_progress_percentage}%** vs Financial **${foundProject.financial_progress_percentage}%**\n`;
      response += `• **Timeline Slippage:** **${foundProject.days_delayed} days** delayed (AI forecasts **+${foundProject.predicted_delay_months} mos** further)\n\n`;

      response += `#### ⚠️ Key Risk Drivers (SHAP Attribution):\n`;
      foundProject.risk_drivers.forEach(d => {
        response += `- **${d.factor} (+${d.contribution} pts impact)**: ${d.evidence} *(Benchmark: ${d.benchmarkComparison || 'Normal'})*\n`;
      });

      if (foundProject.dependencies.length > 0) {
        response += `\n#### 🔗 Critical Blocked Dependencies:\n`;
        foundProject.dependencies.filter(d => d.status !== 'RESOLVED').forEach(dep => {
          response += `- **${dep.name}** (${dep.category}): Blocked for ${dep.daysDelayed} days. *${dep.notes}*\n`;
        });
      }

      response += `\n#### 📋 Recommended Government Interventions:\n`;
      foundProject.recommended_interventions.forEach(rec => {
        response += `1. ${rec}\n`;
      });

      return {
        id: `msg-${Date.now()}`,
        sender: 'ASSISTANT',
        text: response,
        timestamp,
        relatedProjectIds: [foundProject.project_id],
        actionLinks: [
          { label: `View Full Profile`, view: 'PROJECT_DETAIL', projectId: foundProject.project_id },
          { label: `Simulate What-If`, view: 'WHAT_IF', projectId: foundProject.project_id },
          { label: `View Dependency Graph`, view: 'DEPENDENCY_GRAPH', projectId: foundProject.project_id }
        ]
      };
    }
  }

  // 3. "Show projects where financial progress is much higher than physical progress"
  if (
    normalized.includes('financial progress is much higher') ||
    normalized.includes('physical progress') ||
    normalized.includes('expenditure mismatch') ||
    normalized.includes('discrepancy') ||
    normalized.includes('front-load')
  ) {
    const mismatchProjects = projects
      .filter(p => p.financial_progress_percentage - p.physical_progress_percentage >= 20)
      .sort((a, b) => (b.financial_progress_percentage - b.physical_progress_percentage) - (a.financial_progress_percentage - a.physical_progress_percentage))
      .slice(0, 5);

    let response = `### ⚖️ Expenditure Ahead of Physical Delivery (Audit Flags)\n\n`;
    response += `Found **${mismatchProjects.length} critical cases** where disbursements significantly outpace ground execution by **≥20 percentage points**:\n\n`;

    mismatchProjects.forEach((p, idx) => {
      const gap = (p.financial_progress_percentage - p.physical_progress_percentage).toFixed(1);
      response += `${idx + 1}. **[${p.project_id}] ${p.project_name}**\n`;
      response += `   • **Divergence:** Financial **${p.financial_progress_percentage}%** vs Physical **${p.physical_progress_percentage}%** (**+${gap}% Discrepancy Gap**)\n`;
      response += `   • **Total Disbursed:** ₹${p.expenditure_to_date.toLocaleString()} Cr of ₹${p.revised_cost.toLocaleString()} Cr\n`;
      response += `   • **Implementing Agency:** ${p.implementing_agency} (${p.state})\n`;
      response += `   • **MoSPI Alert:** Potential mobilization uncoupling, non-performing contractor advance, or unverified milestone billing.\n\n`;
    });

    response += `> **Audit Recommendation:** Institute immediate physical verification protocol prior to sanctioning additional PFMS payment batches.`;

    return {
      id: `msg-${Date.now()}`,
      sender: 'ASSISTANT',
      text: response,
      timestamp,
      relatedProjectIds: mismatchProjects.map(p => p.project_id),
      actionLinks: mismatchProjects.slice(0, 3).map(p => ({
        label: `Inspect ${p.project_id}`,
        view: 'PROJECT_DETAIL',
        projectId: p.project_id
      }))
    };
  }

  // 4. "Which sectors have the highest average schedule variance?"
  if (
    normalized.includes('sector') ||
    normalized.includes('schedule variance') ||
    normalized.includes('highest delay') ||
    normalized.includes('average delay')
  ) {
    // Sector aggregations
    const sectorStats: Record<string, { totalDelay: number; count: number; costOverruns: number }> = {};
    projects.forEach(p => {
      if (!sectorStats[p.sector]) sectorStats[p.sector] = { totalDelay: 0, count: 0, costOverruns: 0 };
      sectorStats[p.sector].totalDelay += p.days_delayed;
      sectorStats[p.sector].costOverruns += p.cost_overrun_percentage;
      sectorStats[p.sector].count++;
    });

    const sortedSectors = Object.entries(sectorStats)
      .map(([sector, data]) => ({
        sector,
        avgDelay: Math.round(data.totalDelay / data.count),
        avgCostOverrun: Math.round((data.costOverruns / data.count) * 10) / 10,
        count: data.count
      }))
      .sort((a, b) => b.avgDelay - a.avgDelay);

    let response = `### 📊 Sector-wise Schedule Variance & Delay Analysis\n\n`;
    response += `Cross-sector comparative benchmarking across **${projects.length} monitored projects**:\n\n`;

    sortedSectors.forEach((s, idx) => {
      const severityIcon = s.avgDelay > 220 ? '🔴' : s.avgDelay > 140 ? '🟡' : '🟢';
      response += `${idx + 1}. ${severityIcon} **${s.sector}** (${s.count} projects)\n`;
      response += `   • **Average Delay:** **${s.avgDelay} days** (~${Math.round(s.avgDelay / 30)} months)\n`;
      response += `   • **Average Cost Overrun:** +${s.avgCostOverrun}%\n\n`;
    });

    response += `**Key Insight:** Linear infrastructure projects (Railways and Water Schemes) exhibit the highest schedule volatility due to non-contiguous Right-of-Way (RoW) acquisition and cross-departmental utility clearances.`;

    return {
      id: `msg-${Date.now()}`,
      sender: 'ASSISTANT',
      text: response,
      timestamp,
      actionLinks: [{ label: 'Open Sector Benchmarking', view: 'BENCHMARKING' }]
    };
  }

  // 5. Default fallback contextual answer
  let response = `### 🏛️ MoSPI PAIMANA Monitoring Intelligence\n\n`;
  response += `I have parsed your query against our active portfolio of **${projects.length} projects** across 12 Union Ministries.\n\n`;
  response += `**Current System Snapshot:**\n`;
  const criticalTotal = projects.filter(p => p.risk_level === 'CRITICAL').length;
  const highTotal = projects.filter(p => p.risk_level === 'HIGH').length;
  const avgCostOverrun = Math.round((projects.reduce((acc, p) => acc + p.cost_overrun_percentage, 0) / projects.length) * 10) / 10;

  response += `• **Critical Risk Projects:** **${criticalTotal}** requiring immediate intervention\n`;
  response += `• **High Risk Projects:** **${highTotal}** on close monitoring watch\n`;
  response += `• **Average Portfolio Cost Overrun:** **+${avgCostOverrun}%**\n\n`;
  response += `**Suggested Inquiries:**\n`;
  response += `1. *"Which projects require immediate attention?"*\n`;
  response += `2. *"Why is Project P-1024 high risk?"*\n`;
  response += `3. *"Show projects where financial progress is much higher than physical progress."*\n`;
  response += `4. *"Which sectors have the highest average schedule variance?"*\n`;
  response += `5. *"What intervention is recommended for P-1612?"*`;

  return {
    id: `msg-${Date.now()}`,
    sender: 'ASSISTANT',
    text: response,
    timestamp
  };
}
