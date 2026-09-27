export interface StateMetric {
  code: string;
  name: string;
  zone: 'North' | 'South' | 'East' | 'West' | 'Central' | 'North-East';
  activeProjects: number;
  criticalProjects: number;
  avgDelayDays: number;
  avgCostOverrunPct: number;
  totalApprovedCostCr: number;
  riskIndex: number; // 0 - 100
  coordinates: { x: number; y: number }; // Relative SVG map positioning
}

export const INDIA_STATES_DATA: StateMetric[] = [
  { code: 'DL', name: 'Delhi', zone: 'North', activeProjects: 58, criticalProjects: 6, avgDelayDays: 142, avgCostOverrunPct: 8.4, totalApprovedCostCr: 42100, riskIndex: 44, coordinates: { x: 38, y: 31 } },
  { code: 'MH', name: 'Maharashtra', zone: 'West', activeProjects: 142, criticalProjects: 22, avgDelayDays: 220, avgCostOverrunPct: 14.8, totalApprovedCostCr: 124500, riskIndex: 62, coordinates: { x: 32, y: 55 } },
  { code: 'UP', name: 'Uttar Pradesh', zone: 'North', activeProjects: 174, criticalProjects: 28, avgDelayDays: 245, avgCostOverrunPct: 16.2, totalApprovedCostCr: 138900, riskIndex: 68, coordinates: { x: 48, y: 36 } },
  { code: 'GJ', name: 'Gujarat', zone: 'West', activeProjects: 96, criticalProjects: 8, avgDelayDays: 98, avgCostOverrunPct: 5.6, totalApprovedCostCr: 88400, riskIndex: 32, coordinates: { x: 22, y: 46 } },
  { code: 'KA', name: 'Karnataka', zone: 'South', activeProjects: 88, criticalProjects: 11, avgDelayDays: 165, avgCostOverrunPct: 11.2, totalApprovedCostCr: 71200, riskIndex: 48, coordinates: { x: 36, y: 72 } },
  { code: 'TN', name: 'Tamil Nadu', zone: 'South', activeProjects: 92, criticalProjects: 9, avgDelayDays: 130, avgCostOverrunPct: 7.9, totalApprovedCostCr: 76800, riskIndex: 39, coordinates: { x: 42, y: 84 } },
  { code: 'WB', name: 'West Bengal', zone: 'East', activeProjects: 78, criticalProjects: 19, avgDelayDays: 290, avgCostOverrunPct: 22.4, totalApprovedCostCr: 59300, riskIndex: 74, coordinates: { x: 74, y: 48 } },
  { code: 'RJ', name: 'Rajasthan', zone: 'West', activeProjects: 82, criticalProjects: 10, avgDelayDays: 155, avgCostOverrunPct: 9.8, totalApprovedCostCr: 64100, riskIndex: 45, coordinates: { x: 28, y: 35 } },
  { code: 'MP', name: 'Madhya Pradesh', zone: 'Central', activeProjects: 98, criticalProjects: 14, avgDelayDays: 185, avgCostOverrunPct: 12.1, totalApprovedCostCr: 69500, riskIndex: 53, coordinates: { x: 44, y: 48 } },
  { code: 'AP', name: 'Andhra Pradesh', zone: 'South', activeProjects: 66, criticalProjects: 12, avgDelayDays: 205, avgCostOverrunPct: 15.3, totalApprovedCostCr: 51200, riskIndex: 58, coordinates: { x: 48, y: 68 } },
  { code: 'TS', name: 'Telangana', zone: 'South', activeProjects: 64, criticalProjects: 7, avgDelayDays: 125, avgCostOverrunPct: 8.1, totalApprovedCostCr: 49800, riskIndex: 40, coordinates: { x: 45, y: 61 } },
  { code: 'BR', name: 'Bihar', zone: 'East', activeProjects: 84, criticalProjects: 24, avgDelayDays: 310, avgCostOverrunPct: 24.5, totalApprovedCostCr: 58900, riskIndex: 78, coordinates: { x: 65, y: 38 } },
  { code: 'OR', name: 'Odisha', zone: 'East', activeProjects: 68, criticalProjects: 10, avgDelayDays: 175, avgCostOverrunPct: 10.9, totalApprovedCostCr: 48500, riskIndex: 49, coordinates: { x: 62, y: 55 } },
  { code: 'JH', name: 'Jharkhand', zone: 'East', activeProjects: 52, criticalProjects: 13, avgDelayDays: 240, avgCostOverrunPct: 18.2, totalApprovedCostCr: 39400, riskIndex: 65, coordinates: { x: 64, y: 46 } },
  { code: 'KL', name: 'Kerala', zone: 'South', activeProjects: 45, criticalProjects: 8, avgDelayDays: 195, avgCostOverrunPct: 13.8, totalApprovedCostCr: 32400, riskIndex: 52, coordinates: { x: 37, y: 88 } },
  { code: 'PB', name: 'Punjab', zone: 'North', activeProjects: 42, criticalProjects: 5, avgDelayDays: 135, avgCostOverrunPct: 7.2, totalApprovedCostCr: 29500, riskIndex: 38, coordinates: { x: 33, y: 24 } },
  { code: 'HR', name: 'Haryana', zone: 'North', activeProjects: 48, criticalProjects: 5, avgDelayDays: 115, avgCostOverrunPct: 6.8, totalApprovedCostCr: 36200, riskIndex: 36, coordinates: { x: 35, y: 29 } },
  { code: 'AS', name: 'Assam', zone: 'North-East', activeProjects: 46, criticalProjects: 14, avgDelayDays: 320, avgCostOverrunPct: 23.8, totalApprovedCostCr: 34100, riskIndex: 76, coordinates: { x: 86, y: 37 } },
  { code: 'CG', name: 'Chhattisgarh', zone: 'Central', activeProjects: 44, criticalProjects: 8, avgDelayDays: 180, avgCostOverrunPct: 11.5, totalApprovedCostCr: 31000, riskIndex: 51, coordinates: { x: 53, y: 52 } },
  { code: 'UT', name: 'Uttarakhand', zone: 'North', activeProjects: 38, criticalProjects: 9, avgDelayDays: 260, avgCostOverrunPct: 19.5, totalApprovedCostCr: 28400, riskIndex: 67, coordinates: { x: 44, y: 25 } },
  { code: 'HP', name: 'Himachal Pradesh', zone: 'North', activeProjects: 34, criticalProjects: 8, avgDelayDays: 275, avgCostOverrunPct: 21.0, totalApprovedCostCr: 24200, riskIndex: 69, coordinates: { x: 38, y: 20 } },
  { code: 'JK', name: 'Jammu & Kashmir', zone: 'North', activeProjects: 40, criticalProjects: 11, avgDelayDays: 340, avgCostOverrunPct: 26.2, totalApprovedCostCr: 38500, riskIndex: 79, coordinates: { x: 32, y: 14 } },
  { code: 'NE', name: 'Other NE States', zone: 'North-East', activeProjects: 52, criticalProjects: 18, avgDelayDays: 360, avgCostOverrunPct: 27.5, totalApprovedCostCr: 36800, riskIndex: 82, coordinates: { x: 92, y: 40 } },
  { code: 'GA', name: 'Goa', zone: 'West', activeProjects: 14, criticalProjects: 1, avgDelayDays: 85, avgCostOverrunPct: 4.5, totalApprovedCostCr: 9800, riskIndex: 28, coordinates: { x: 31, y: 66 } }
];
