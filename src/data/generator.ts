import { Project, RiskLevel, DataQualityGrade, ProjectStatus, Milestone, DependencyNode, RiskFactorContribution, ProjectDataQualityIssue } from '../types/project';
import { SHOWCASE_PROJECTS } from './showcaseProjects';
import { INDIA_STATES_DATA } from './indiaStatesData';

const MINISTRIES = [
  { name: 'Ministry of Railways', dept: 'Railway Board', sector: 'Railways', agencies: ['DFCCIL', 'RVNL', 'IRCON', 'KRCL', 'Northern Railway', 'Southern Railway'] },
  { name: 'Ministry of Road Transport and Highways', dept: 'NHAI', sector: 'Road Transport and Highways', agencies: ['NHAI', 'NHIDCL', 'State PWD NH Wing', 'BRO'] },
  { name: 'Ministry of Power', dept: 'Thermal & Hydro Division', sector: 'Power', agencies: ['NTPC Limited', 'PowerGrid', 'NHPC', 'SJVN Limited'] },
  { name: 'Ministry of Petroleum and Natural Gas', dept: 'PSU Monitoring', sector: 'Petroleum and Natural Gas', agencies: ['IOCL', 'ONGC', 'BPCL', 'HPCL', 'GAIL', 'NRL'] },
  { name: 'Ministry of Housing and Urban Affairs', dept: 'Urban Transport Division', sector: 'Urban Development', agencies: ['DMRC', 'BMRCL', 'KMRL', 'MMRDA', 'Smart City SPV'] },
  { name: 'Ministry of Ports, Shipping and Waterways', dept: 'Sagarmala Division', sector: 'Shipping and Ports', agencies: ['JNPA', 'Deendayal Port', 'Paradip Port Authority', 'IWAI', 'Cochin Shipyard'] },
  { name: 'Ministry of Jal Shakti', dept: 'Drinking Water & Sanitation', sector: 'Water and Sanitation', agencies: ['NMCG', 'WAPCOS', 'State Water Mission', 'CWC'] },
  { name: 'Ministry of Health and Family Welfare', dept: 'PMSSY Division', sector: 'Health and Family Welfare', agencies: ['HITES', 'HSCC', 'Central PWD Health Wing'] },
  { name: 'Ministry of Communications', dept: 'DoT', sector: 'Telecommunications', agencies: ['BBNL (BharatNet)', 'BSNL', 'ITI Limited'] },
  { name: 'Ministry of New and Renewable Energy', dept: 'Green Energy Division', sector: 'Renewable Energy', agencies: ['SECI', 'IREDA', 'State Nodal Energy Agencies'] },
  { name: 'Ministry of Coal', dept: 'CIL Monitoring', sector: 'Coal', agencies: ['Coal India Limited', 'NLC India', 'SECL', 'BCCL'] }
];

const PROJECT_NAMING_TEMPLATES: Record<string, string[]> = {
  'Railways': [
    'Doubling and Third Line Addition on {State} Corridor ({Dist1} to {Dist2})',
    'High-Speed Freight Terminal & Multi-Modal Hub at {Dist1}',
    'Electrification of {Dist1}–{Dist2} Broad Gauge Section',
    'New Broad Gauge Rail Link connecting {Dist1} to {Dist2}',
    'Grade Separator Flyover & Automatic Signaling Network at {Dist1}'
  ],
  'Road Transport and Highways': [
    'Four-Laning of NH-{Num} Package-{Pkg} ({Dist1} Bypass to {Dist2})',
    'Economic Corridor Greenfield Access-Controlled Highway ({Dist1}–{Dist2})',
    'Ring Road and Elevated Bypass Corridor around {Dist1} Urban Fringe',
    'Upgradation of Strategic Border Highway Section in {State}',
    'Six-Lane Coastal Highway with Major Cable-Stayed Bridge across River'
  ],
  'Power': [
    'Inter-State Transmission System (ISTS) 765kV Substation at {Dist1}',
    'Ultra Mega Solar Power Park Transmission Evacuation Link ({State})',
    'Flue Gas Desulfurization (FGD) Emission Abatement Unit at {Dist1} TPP',
    'Hydroelectric Pumped Storage Project (Stage-{Pkg}) in {Dist1}',
    'High Voltage Direct Current (HVDC) Bipole Terminal Link'
  ],
  'Petroleum and Natural Gas': [
    'Cross-Country City Gas Distribution (CGD) Network in {Dist1} GA',
    'LPG Bottling Plant & Cryogenic Bulk Storage Facility at {Dist1}',
    'Petrochemical Fluid Catalytic Cracking Unit (FCCU) Upgrade',
    'Natural Gas Pipeline Feeder Spur Line to Industrial Growth Center',
    'Crude Oil Pipeline Augmented Pumping Stations along {State} Belt'
  ],
  'Urban Development': [
    'Metro Rail Rapid Transit Phase-2 Reach-{Pkg} ({Dist1})',
    'Integrated Command and Control Centre (ICCC) & Smart Infrastructure',
    'Underground Drainage, Stormwater & Sewerage Treatment Plant (MLD)',
    'Solid Waste Bio-Methanation & Waste-to-Energy Facility at {Dist1}',
    'Multi-Modal Transport Interchange & Inter-State Bus Terminal (ISBT)'
  ],
  'Shipping and Ports': [
    'Deepening and Widening of Navigation Access Channel at Port',
    'Development of Container Transshipment Terminal Berth No. {Pkg}',
    'Mechanized Coastal Coal Handling & Wagon Loading System',
    'Roll-On Roll-Off (Ro-Ro) Passenger & Vehicle Terminal Ferry Link',
    'Multimodal Cargo Terminal on National Waterway NW-{Num}'
  ],
  'Water and Sanitation': [
    'Multi-Village Piped Drinking Water Supply Scheme covering {Dist1} Gram Panchayats',
    'Riverfront Rejuvenation & Interception-Diversion STP Network along River',
    'Gravity-Fed Mountainous Canal Irrigation Scheme in {Dist1}',
    'Micro-Irrigation Solar Pumping Network Phase-{Pkg}',
    'Industrial Effluent Treatment & Zero Liquid Discharge (ZLD) Facility'
  ],
  'Health and Family Welfare': [
    'Greenfield All India Institute of Medical Sciences Campus at {Dist1}',
    'Super-Specialty Trauma Care & Tertiary Oncology Center',
    'National Centre for Disease Control (NCDC) Bio-Safety Level 3 Lab',
    'Central Government Health Scheme (CGHS) Modern Diagnostic Polyclinic',
    'Upgradation of District Civil Hospital to 500-Bed Medical College'
  ],
  'Telecommunications': [
    'BharatNet Phase-III Optical Fibre Cable (OFC) Connectivity to Gram Panchayats',
    '4G/5G Saturation Project in Uncovered Border & Tribal Habitations',
    'National Knowledge Network (NKN) High-Bandwidth Gateway Node',
    'Submarine Optical Fibre Cable Landing Station'
  ],
  'Renewable Energy': [
    'Floating Solar PV Power Plant on Reservoir ({State})',
    'Green Hydrogen Production & Ammonia Synthesis Pilot Facility',
    'Wind-Solar Hybrid Renewable Energy Park (300 MW) at {Dist1}',
    'Rooftop Solar Integration on Government Institutional Buildings'
  ],
  'Coal': [
    'First-Mile Connectivity (FMC) Coal Handling Plant & Rapid Loading Silo',
    'Open Cast Mine Expansion Project ({Dist1} Coalfield)',
    'Coal Washery Modernization & Reject Recovery Unit'
  ]
};

// Seeded pseudo-random generator for internal consistency
class SeededRandom {
  private seed: number;
  constructor(seed: number) {
    this.seed = seed;
  }
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }
  choice<T>(arr: T[]): T {
    return arr[Math.floor(this.next() * arr.length)];
  }
  integer(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }
}

export function generateAllProjects(totalTargetCount = 1250): Project[] {
  const projects: Project[] = [...SHOWCASE_PROJECTS];
  const rng = new SeededRandom(2026103);

  const showcaseIds = new Set(SHOWCASE_PROJECTS.map(p => p.project_id));
  let currentIdCounter = 1000;

  while (projects.length < totalTargetCount) {
    currentIdCounter++;
    const pid = `P-${currentIdCounter}`;
    if (showcaseIds.has(pid)) continue;

    const ministryObj = rng.choice(MINISTRIES);
    const stateObj = rng.choice(INDIA_STATES_DATA);
    const agency = rng.choice(ministryObj.agencies);

    // Cost Tier distribution
    const costRoll = rng.next();
    let approved_cost = 0;
    let project_category: 'MEGA (₹1000+ Cr)' | 'MAJOR (₹150-1000 Cr)' | 'MEDIUM (<₹150 Cr)';

    if (costRoll > 0.65) {
      // Mega
      approved_cost = Math.round(rng.range(1050, 24000) * 10) / 10;
      project_category = 'MEGA (₹1000+ Cr)';
    } else if (costRoll > 0.25) {
      // Major
      approved_cost = Math.round(rng.range(160, 980) * 10) / 10;
      project_category = 'MAJOR (₹150-1000 Cr)';
    } else {
      // Medium
      approved_cost = Math.round(rng.range(45, 148) * 10) / 10;
      project_category = 'MEDIUM (<₹150 Cr)';
    }

    // Risk archetype generator (to create realistic correlation between delay, progress, contractor, and risk)
    // 0: Healthy (40%)
    // 1: Mild Delay / Moderate Risk (32%)
    // 2: Critical Delay / High Risk (20%)
    // 3: Stalled / Severe Anomaly (8%)
    const archetypeRoll = rng.next();
    let archetype: 'HEALTHY' | 'MODERATE' | 'HIGH' | 'STALLED';
    if (archetypeRoll < 0.40) archetype = 'HEALTHY';
    else if (archetypeRoll < 0.72) archetype = 'MODERATE';
    else if (archetypeRoll < 0.92) archetype = 'HIGH';
    else archetype = 'STALLED';

    // Timeline calculations
    const startYear = rng.integer(2019, 2023);
    const startMonth = rng.integer(1, 12);
    const durationMonths = rng.integer(18, 54);
    const startDay = rng.integer(1, 28);

    const startDateStr = `${startYear}-${String(startMonth).padStart(2, '0')}-${String(startDay).padStart(2, '0')}`;
    const approvalDateStr = `${startYear - 1}-${String(rng.integer(6, 12)).padStart(2, '0')}-15`;

    let daysDelayed = 0;
    let physicalProgress = 0;
    let financialProgress = 0;
    let costOverrunPct = 0;
    let contractorRating = 75;
    let procurementDelayDays = 0;
    let landStatus: 'FULLY_ACQUIRED' | 'PARTIAL' | 'DISPUTED' | 'NOT_STARTED' = 'FULLY_ACQUIRED';
    let envStatus: 'APPROVED' | 'CONDITIONAL' | 'PENDING' | 'REJECTED' = 'APPROVED';
    let contractorStatus: 'SATISFACTORY' | 'UNDER_REVIEW' | 'DEFAULT_WARNING' | 'PENALIZED' = 'SATISFACTORY';
    let projectStatus: ProjectStatus = 'ON_SCHEDULE';
    let dataQualityGrade: DataQualityGrade = 'GOOD';
    let dataQualityScore = rng.integer(88, 98);
    const dqIssues: ProjectDataQualityIssue[] = [];
    let stalenessDays = rng.integer(2, 22);

    if (archetype === 'HEALTHY') {
      physicalProgress = Math.round(rng.range(30, 95));
      // Financial progress tracks physical within +/- 5%
      financialProgress = Math.max(5, Math.min(98, Math.round(physicalProgress + rng.range(-4, 5))));
      daysDelayed = rng.integer(0, 45);
      costOverrunPct = Math.round(rng.range(0, 4) * 10) / 10;
      contractorRating = rng.integer(82, 96);
      procurementDelayDays = rng.integer(0, 15);
      projectStatus = 'ON_SCHEDULE';
    } else if (archetype === 'MODERATE') {
      physicalProgress = Math.round(rng.range(25, 75));
      financialProgress = Math.min(95, Math.round(physicalProgress + rng.range(4, 14))); // slight financial lead
      daysDelayed = rng.integer(60, 180);
      costOverrunPct = Math.round(rng.range(4, 15) * 10) / 10;
      contractorRating = rng.integer(62, 80);
      procurementDelayDays = rng.integer(25, 60);
      landStatus = rng.next() > 0.4 ? 'PARTIAL' : 'FULLY_ACQUIRED';
      contractorStatus = rng.next() > 0.5 ? 'UNDER_REVIEW' : 'SATISFACTORY';
      projectStatus = 'DELAYED';
    } else if (archetype === 'HIGH') {
      physicalProgress = Math.round(rng.range(15, 60));
      financialProgress = Math.min(92, Math.round(physicalProgress + rng.range(14, 28))); // severe uncoupling
      daysDelayed = rng.integer(190, 450);
      costOverrunPct = Math.round(rng.range(15, 38) * 10) / 10;
      contractorRating = rng.integer(38, 60);
      procurementDelayDays = rng.integer(60, 150);
      landStatus = rng.next() > 0.3 ? 'DISPUTED' : 'PARTIAL';
      envStatus = rng.next() > 0.5 ? 'CONDITIONAL' : 'PENDING';
      contractorStatus = rng.next() > 0.4 ? 'DEFAULT_WARNING' : 'PENALIZED';
      projectStatus = 'CRITICAL_DELAY';
    } else {
      // Stalled
      physicalProgress = Math.round(rng.range(8, 35));
      financialProgress = Math.min(85, Math.round(physicalProgress + rng.range(22, 45))); // high spend, dead progress
      daysDelayed = rng.integer(460, 950);
      costOverrunPct = Math.round(rng.range(32, 65) * 10) / 10;
      contractorRating = rng.integer(20, 42);
      procurementDelayDays = rng.integer(140, 290);
      landStatus = 'DISPUTED';
      envStatus = 'PENDING';
      contractorStatus = 'PENALIZED';
      projectStatus = 'STALLED';
      stalenessDays = rng.integer(45, 95); // Data staleness issue!
    }

    // Occasional injected Data Quality anomaly for the Data Quality Engine (~10% of projects)
    const dqRoll = rng.next();
    if (dqRoll < 0.04) {
      // Stale record issue
      stalenessDays = rng.integer(65, 120);
      dataQualityGrade = 'POOR';
      dataQualityScore = rng.integer(40, 58);
      dqIssues.push({
        type: 'STALE_RECORD',
        severity: 'POOR',
        field: 'last_update_date',
        description: `Project reporting is ${stalenessDays} days stale. MoSPI compliance window breached.`
      });
    } else if (dqRoll < 0.08) {
      // Financial vs Physical mismatch issue
      financialProgress = Math.min(96, physicalProgress + 32);
      dataQualityGrade = 'WATCH';
      dataQualityScore = rng.integer(60, 72);
      dqIssues.push({
        type: 'EXPENDITURE_MISMATCH',
        severity: 'WATCH',
        field: 'expenditure_percentage',
        description: `Disproportionate expenditure: Financial progress (${financialProgress}%) outruns physical work (${physicalProgress}%) by >30 points.`
      });
    } else if (dqRoll < 0.10) {
      // Suspicious reporting pattern (e.g. 0% progress reported for 6 consecutive months with active funds)
      dataQualityGrade = 'WATCH';
      dataQualityScore = rng.integer(65, 75);
      dqIssues.push({
        type: 'SUSPICIOUS_REPORTING',
        severity: 'WATCH',
        field: 'reporting_frequency',
        description: 'Zero progress delta recorded across successive reporting quarters despite active budget drawdowns.'
      });
    }

    // Cost math
    const revised_cost = Math.round(approved_cost * (1 + costOverrunPct / 100) * 10) / 10;
    const expenditure_to_date = Math.round(revised_cost * (financialProgress / 100) * 10) / 10;
    const remaining_budget = Math.round((revised_cost - expenditure_to_date) * 10) / 10;
    const cost_variance = Math.round((revised_cost - approved_cost) * 10) / 10;

    // Date math
    const originalCompletionYear = startYear + Math.floor(durationMonths / 12);
    const originalCompletionMonth = ((startMonth + durationMonths) % 12) || 12;
    const originalCompletionDate = `${originalCompletionYear}-${String(originalCompletionMonth).padStart(2, '0')}-28`;

    const revisedDaysOffset = daysDelayed;
    const expectedDelayDays = daysDelayed + (archetype === 'HIGH' || archetype === 'STALLED' ? rng.integer(45, 120) : 0);
    const predictedDelayMonths = Math.round((expectedDelayDays / 30) * 10) / 10;
    const predictedCostOverrunCrores = Math.round(cost_variance * (1 + rng.range(0.05, 0.25)) * 10) / 10;

    // Projected dates
    const revisedYear = originalCompletionYear + Math.floor((revisedDaysOffset + 60) / 365);
    const revisedCompletionDate = `${revisedYear}-11-30`;
    const currentExpectedYear = originalCompletionYear + Math.floor((expectedDelayDays + 60) / 365);
    const currentExpectedDate = `${currentExpectedYear}-12-15`;

    // CUF baseline calculation (traditional 3-variable composite: Progress factor + Cost variance + Delay days)
    const progressDeficit = Math.max(0, financialProgress - physicalProgress);
    const cuf_raw = (progressDeficit * 0.4) + (Math.min(100, costOverrunPct * 2) * 0.35) + (Math.min(100, (daysDelayed / 365) * 60) * 0.25);
    const CUF_score = Math.max(10, Math.min(95, Math.round(cuf_raw)));

    // CUF+ extended calculation (incorporates contractor risk, regional risk, dependency blockers, land & env, staleness)
    const contractorRiskPenalty = (100 - contractorRating) * 0.25;
    const dependencyPenalty = (landStatus === 'DISPUTED' ? 20 : landStatus === 'PARTIAL' ? 10 : 0) + (envStatus !== 'APPROVED' ? 15 : 0);
    const regionalPenalty = (stateObj.riskIndex / 100) * 15;
    const stalenessPenalty = Math.min(15, (stalenessDays / 45) * 15);
    const cuf_plus_raw = (CUF_score * 0.5) + contractorRiskPenalty + dependencyPenalty + regionalPenalty + stalenessPenalty;
    const CUF_plus_score = Math.max(10, Math.min(98, Math.round(cuf_plus_raw)));

    const overall_risk_score = CUF_plus_score;

    let risk_level: RiskLevel = 'LOW';
    if (overall_risk_score >= 80) risk_level = 'CRITICAL';
    else if (overall_risk_score >= 60) risk_level = 'HIGH';
    else if (overall_risk_score >= 35) risk_level = 'MODERATE';
    else risk_level = 'LOW';

    // Model calibrated probabilities
    const cost_overrun_probability = Math.min(98, Math.max(5, Math.round((overall_risk_score * 0.95 + rng.range(-4, 5)) * 10) / 10));
    const time_overrun_probability = Math.min(99, Math.max(8, Math.round((overall_risk_score * 1.05 + rng.range(-3, 4)) * 10) / 10));
    const model_confidence = Math.round(rng.range(89, 97) * 10) / 10;

    // Milestones
    const milestones_total = rng.integer(6, 12);
    const milestones_completed = Math.max(1, Math.round((physicalProgress / 100) * milestones_total));
    const milestones_delayed = archetype === 'HEALTHY' ? 0 : rng.integer(1, Math.max(1, milestones_total - milestones_completed));

    // Dynamic Project Name
    const templateArr = PROJECT_NAMING_TEMPLATES[ministryObj.sector] || PROJECT_NAMING_TEMPLATES['Railways'];
    const rawTemplate = rng.choice(templateArr);
    const dist1 = stateObj.name + ' Central';
    const dist2 = stateObj.name + ' East';
    const num = rng.integer(12, 98);
    const pkg = rng.integer(1, 9);
    const project_name = rawTemplate
      .replace('{State}', stateObj.name)
      .replace('{Dist1}', dist1)
      .replace('{Dist2}', dist2)
      .replace('{Num}', String(num))
      .replace('{Pkg}', String(pkg));

    // Milestones array
    const milestones: Milestone[] = [];
    const milestoneNames = ['Pre-construction Clearances & RoW', 'Foundations & Primary Substructure', 'Main Civil Works Package', 'Equipment Procurement & Erection', 'Testing, Inspection & Safety Trial'];
    for (let m = 0; m < milestoneNames.length; m++) {
      const isComp = m < Math.floor(physicalProgress / 22);
      const isDel = !isComp && (archetype === 'HIGH' || archetype === 'STALLED');
      milestones.push({
        id: `M${m + 1}`,
        name: `${milestoneNames[m]} (${project_name.slice(0, 18)}...)`,
        target_date: `${startYear + m}-06-30`,
        revised_date: `${startYear + m + (isDel ? 1 : 0)}-11-30`,
        actual_date: isComp ? `${startYear + m}-07-15` : undefined,
        status: isComp ? 'COMPLETED' : isDel ? 'DELAYED' : 'ON_TRACK',
        weightage_percentage: Math.round(100 / milestoneNames.length)
      });
    }

    // Dependencies
    const dependencies: DependencyNode[] = [];
    if (landStatus !== 'FULLY_ACQUIRED') {
      dependencies.push({
        id: `DEP-L-${pid}`,
        name: `Land Acquisition in ${dist1}`,
        category: 'LAND',
        status: landStatus === 'DISPUTED' ? 'CRITICAL_DELAY' : 'IN_PROGRESS',
        daysDelayed: rng.integer(45, 180),
        criticalPath: true,
        impactScore: rng.integer(65, 92),
        notes: 'Competent authority land award pending disbursement'
      });
    }
    if (procurementDelayDays > 30) {
      dependencies.push({
        id: `DEP-P-${pid}`,
        name: 'Critical Equipment & Material Procurement',
        category: 'PROCUREMENT',
        status: procurementDelayDays > 90 ? 'CRITICAL_DELAY' : 'IN_PROGRESS',
        daysDelayed: procurementDelayDays,
        criticalPath: true,
        impactScore: rng.integer(70, 88),
        notes: 'Supply chain lead time extension'
      });
    }

    // Risk drivers
    const risk_drivers: RiskFactorContribution[] = [];
    if (progressDeficit > 10) {
      risk_drivers.push({
        factor: 'Physical vs Financial Divergence',
        category: 'FINANCIAL',
        contribution: Math.round(progressDeficit * 0.9),
        evidence: `Financial spend (${financialProgress}%) outruns verified physical progress (${physicalProgress}%) by ${progressDeficit}%`,
        severity: progressDeficit > 20 ? 'CRITICAL' : 'HIGH',
        benchmarkComparison: 'Sector median variance ±5%'
      });
    }
    if (daysDelayed > 60) {
      risk_drivers.push({
        factor: 'Cumulative Schedule Variance',
        category: 'PROGRESS',
        contribution: Math.min(35, Math.round((daysDelayed / 365) * 25)),
        evidence: `Project has accrued ${daysDelayed} days of cumulative timeline slippage`,
        severity: daysDelayed > 200 ? 'CRITICAL' : 'HIGH',
        benchmarkComparison: 'Threshold for escalation: 180 days'
      });
    }
    if (contractorRating < 65) {
      risk_drivers.push({
        factor: 'Contractor Performance Deficit',
        category: 'CONTRACTOR',
        contribution: Math.round((100 - contractorRating) * 0.3),
        evidence: `Implementing partner contractor rating scored ${contractorRating}/100`,
        severity: contractorRating < 45 ? 'CRITICAL' : 'HIGH',
        benchmarkComparison: 'National average contractor score 74/100'
      });
    }
    if (stalenessDays > 30) {
      risk_drivers.push({
        factor: 'Monitoring Data Staleness',
        category: 'DATA',
        contribution: 15,
        evidence: `No update submitted for ${stalenessDays} days; breaches reporting mandate`,
        severity: 'MEDIUM',
        benchmarkComparison: 'Mandated reporting interval is 15-30 days'
      });
    }

    // Interventions
    const recommended_interventions: string[] = [];
    if (progressDeficit > 15) {
      recommended_interventions.push('Depute specialized audit team for physical-financial reconciliation before releasing subsequent milestone tranches.');
    }
    if (landStatus === 'DISPUTED') {
      recommended_interventions.push(`Escalate land acquisition dispute to ${stateObj.name} State Apex Infrastructure Committee for fast-track resolution.`);
    }
    if (contractorRating < 55) {
      recommended_interventions.push('Serve formal contractual cure notice; consider splitting remaining work package or enlisting standby agency.');
    }
    if (stalenessDays > 30) {
      recommended_interventions.push('Issue direct non-compliance notice to implementing agency requiring digital geo-tagged milestone upload within 7 days.');
    }
    if (recommended_interventions.length === 0) {
      recommended_interventions.push('Maintain regular fortnightly review cadence; ensure timely vendor bill settlements.');
    }

    projects.push({
      project_id: pid,
      project_name,
      ministry: ministryObj.name,
      department: ministryObj.dept,
      sector: ministryObj.sector,
      state: stateObj.name,
      district: dist1,
      implementing_agency: agency,
      project_type: ministryObj.sector === 'Health and Family Welfare' ? 'SOCIAL' : ministryObj.sector === 'Power' || ministryObj.sector === 'Petroleum and Natural Gas' ? 'ENERGY' : 'INFRASTRUCTURE',
      project_category,
      project_status: projectStatus,
      approved_cost,
      revised_cost,
      expenditure_to_date,
      remaining_budget,
      expenditure_percentage: financialProgress,
      cost_variance,
      cost_overrun_percentage: costOverrunPct,
      approval_date: approvalDateStr,
      original_start_date: startDateStr,
      original_completion_date: originalCompletionDate,
      revised_completion_date: revisedCompletionDate,
      current_expected_completion_date: currentExpectedDate,
      physical_progress_percentage: physicalProgress,
      financial_progress_percentage: financialProgress,
      schedule_variance_days: expectedDelayDays,
      days_delayed: daysDelayed,
      expected_delay_days: expectedDelayDays,
      milestones_total,
      milestones_completed,
      milestones_delayed,
      contractor_status: contractorStatus,
      tender_status: archetype === 'STALLED' ? 'RE-TENDERED' : 'AWARDED',
      land_acquisition_status: landStatus,
      environmental_clearance: envStatus,
      utility_shift_status: archetype === 'HIGH' || archetype === 'STALLED' ? 'IN_PROGRESS' : 'COMPLETED',
      manpower_availability: contractorRating < 50 ? 'DEFICIT_SEVERE' : contractorRating < 70 ? 'DEFICIT_MILD' : 'ADEQUATE',
      material_availability: procurementDelayDays > 60 ? 'SHORTAGE' : 'NORMAL',
      procurement_delay_days: procurementDelayDays,
      payment_delay_days: rng.integer(10, 45),
      historical_delay_rate: Math.round(rng.range(0.15, 0.75) * 100) / 100,
      contractor_performance_score: contractorRating,
      regional_risk_index: stateObj.riskIndex,
      dependency_count: dependencies.length,
      unresolved_issues_count: rng.integer(1, 8),
      complaint_count: rng.integer(0, 10),
      inspection_findings_count: rng.integer(0, 6),
      previous_revision_count: archetype === 'HIGH' || archetype === 'STALLED' ? rng.integer(1, 3) : 0,
      data_staleness_days: stalenessDays,
      reporting_frequency_days: 30,
      last_update_date: `2026-09-${String(Math.max(1, 28 - stalenessDays)).padStart(2, '0')}`,
      last_inspection_date: '2026-08-15',
      monitoring_frequency: 'MONTHLY',
      data_quality_score: dataQualityScore,
      data_quality_grade: dataQualityGrade,
      data_quality_issues: dqIssues,
      CUF_score,
      CUF_plus_score,
      overall_risk_score,
      risk_level,
      cost_overrun_probability,
      time_overrun_probability,
      model_confidence,
      predicted_delay_months: predictedDelayMonths,
      predicted_cost_overrun_crores: predictedCostOverrunCrores,
      milestones,
      dependencies,
      risk_drivers,
      recommended_interventions
    });
  }

  return projects;
}
