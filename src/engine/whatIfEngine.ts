import { Project, RiskLevel } from '../types/project';

export interface WhatIfInput {
  physicalProgress: number; // 0 - 100
  contractorScore: number; // 0 - 100
  procurementDelayDays: number; // 0 - 300
  paymentDelayDays: number; // 0 - 180
  milestonesDelayed: number; // 0 - 12
  resolveDependencies: boolean;
  stalenessDays: number; // 0 - 90
}

export interface WhatIfResult {
  baselineRiskScore: number;
  simulatedRiskScore: number;
  riskScoreDelta: number;

  baselineRiskLevel: RiskLevel;
  simulatedRiskLevel: RiskLevel;

  baselineExpectedDelayDays: number;
  simulatedExpectedDelayDays: number;
  delayDaysDelta: number;

  baselineCostOverrunProb: number;
  simulatedCostOverrunProb: number;
  costProbDelta: number;

  baselineCostOverrunCr: number;
  simulatedCostOverrunCr: number;
  costCrDelta: number;

  explanationText: string;
}

export function simulateWhatIf(project: Project, input: WhatIfInput): WhatIfResult {
  const baselineRiskScore = project.overall_risk_score;
  const baselineExpectedDelayDays = project.expected_delay_days;
  const baselineCostOverrunProb = project.cost_overrun_probability;
  const baselineCostOverrunCr = project.predicted_cost_overrun_crores;
  const baselineRiskLevel = project.risk_level;

  // 1. Progress divergence impact
  const currentDiff = Math.max(0, project.financial_progress_percentage - project.physical_progress_percentage);
  const simulatedDiff = Math.max(0, project.financial_progress_percentage - input.physicalProgress);
  const progressScoreImpact = (simulatedDiff - currentDiff) * 0.7;

  // 2. Contractor performance impact
  const contractorImpact = (project.contractor_performance_score - input.contractorScore) * 0.35;

  // 3. Procurement impact
  const procurementImpact = ((input.procurementDelayDays - project.procurement_delay_days) / 30) * 4.0;

  // 4. Milestone delays
  const milestoneImpact = (input.milestonesDelayed - project.milestones_delayed) * 5.0;

  // 5. Dependency resolution
  const dependencyImpact = input.resolveDependencies ? -18.0 : 0;

  // 6. Staleness impact
  const stalenessImpact = ((input.stalenessDays - project.data_staleness_days) / 30) * 4.0;

  // Calculate new score
  let simScore = Math.round(baselineRiskScore + progressScoreImpact + contractorImpact + procurementImpact + milestoneImpact + dependencyImpact + stalenessImpact);
  simScore = Math.max(5, Math.min(99, simScore));

  const riskScoreDelta = simScore - baselineRiskScore;

  // Determine simulated risk level
  let simulatedRiskLevel: RiskLevel = 'LOW';
  if (simScore >= 80) simulatedRiskLevel = 'CRITICAL';
  else if (simScore >= 60) simulatedRiskLevel = 'HIGH';
  else if (simScore >= 35) simulatedRiskLevel = 'MODERATE';
  else simulatedRiskLevel = 'LOW';

  // Simulated Delay
  const delayAdjustmentRatio = simScore / Math.max(1, baselineRiskScore);
  const simulatedExpectedDelayDays = Math.max(0, Math.round(baselineExpectedDelayDays * delayAdjustmentRatio));
  const delayDaysDelta = simulatedExpectedDelayDays - baselineExpectedDelayDays;

  // Simulated Cost Overrun Prob & Cr
  const simulatedCostOverrunProb = Math.min(99, Math.max(4, Math.round(simScore * 0.96 * 10) / 10));
  const costProbDelta = Math.round((simulatedCostOverrunProb - baselineCostOverrunProb) * 10) / 10;

  const simulatedCostOverrunCr = Math.max(0, Math.round(baselineCostOverrunCr * delayAdjustmentRatio * 10) / 10);
  const costCrDelta = Math.round((simulatedCostOverrunCr - baselineCostOverrunCr) * 10) / 10;

  let explanationText = '';
  if (riskScoreDelta < -10) {
    explanationText = `Targeted interventions (improving physical execution to ${input.physicalProgress}%, contractor rating to ${input.contractorScore}/100${input.resolveDependencies ? ', and clearing dependencies' : ''}) successfully compresses project risk by ${Math.abs(riskScoreDelta)} points, avoiding approximately ${Math.abs(delayDaysDelta)} days of delay and ₹${Math.abs(costCrDelta).toLocaleString()} Cr in predicted overrun.`;
  } else if (riskScoreDelta > 10) {
    explanationText = `Further deterioration in physical delivery or compounding supply delays would push risk upwards by +${riskScoreDelta} points into ${simulatedRiskLevel} status, expanding schedule delay by +${delayDaysDelta} days.`;
  } else {
    explanationText = `Simulated parameter adjustments reflect a marginal net risk variation of ${riskScoreDelta > 0 ? '+' : ''}${riskScoreDelta} points. Implementation metrics remain closely tethered to current operational trajectory.`;
  }

  return {
    baselineRiskScore,
    simulatedRiskScore: simScore,
    riskScoreDelta,
    baselineRiskLevel,
    simulatedRiskLevel,
    baselineExpectedDelayDays,
    simulatedExpectedDelayDays,
    delayDaysDelta,
    baselineCostOverrunProb,
    simulatedCostOverrunProb,
    costProbDelta,
    baselineCostOverrunCr,
    simulatedCostOverrunCr,
    costCrDelta,
    explanationText
  };
}
