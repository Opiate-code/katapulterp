export interface DateRangeOption {
  id: 'month' | 'quarter' | 'year' | 'last_month';
  label: string;
}

export interface FunnelStageMetric {
  stage: string;
  count: number;
  value: number;
  conversionRate: number; // Conversion to this stage
  avgDaysInStage: number;
}

export interface LeadSourceMetric {
  source: string;
  leads: number;
  qualified: number;
  dealsWon: number;
  revenue: number;
  conversionRate: number;
  color: string;
}

export interface RepPerformanceMetric {
  name: string;
  role: string;
  avatar: string;
  dealsWon: number;
  revenueGenerated: number;
  targetQuota: number;
  quotaAttainment: number; // percentage
  activitiesCompleted: number;
  avgDealSize: number;
}

export interface MonthlyTrendData {
  month: string;
  leads: number;
  opportunities: number;
  revenue: number; // in MXN
  mrr: number;
}

export interface PortfolioSegment {
  segment: string;
  clientsCount: number;
  totalValue: number;
  mrrContribution: number;
  percentage: number;
  color: string;
}

export const REPORTS_DATA = {
  summaryKpis: {
    totalLeads: {
      value: 348,
      trend: '+18.4%',
      isPositive: true,
      comparisonText: 'vs mes anterior (294)',
    },
    pipelineValue: {
      value: '$2,374,000 MXN',
      rawValue: 2374000,
      trend: '+24.2%',
      isPositive: true,
      comparisonText: 'vs mes anterior ($1,910,000)',
    },
    weightedForecast: {
      value: '$1,388,400 MXN',
      rawValue: 1388400,
      trend: '+15.8%',
      isPositive: true,
      comparisonText: 'proyección ponderada de cierre',
    },
    portfolioTotalValue: {
      value: '$4,860,000 MXN',
      rawValue: 4860000,
      trend: '+12.6%',
      isPositive: true,
      comparisonText: 'cartera total bajo gestión',
    },
    monthlyRecurringRevenue: {
      value: '$345,000 MXN',
      rawValue: 345000,
      trend: '+8.3%',
      isPositive: true,
      comparisonText: 'MRR contratado recurrente',
    },
    winRate: {
      value: '42.8%',
      trend: '+3.5%',
      isPositive: true,
      comparisonText: 'tasa de cierre comercial',
    },
    salesCycleDays: {
      value: '26 días',
      trend: '-4 días',
      isPositive: true,
      comparisonText: 'velocidad media de cierre',
    },
    operationalActivityIndex: {
      value: '94.2%',
      trend: '+5.1%',
      isPositive: true,
      comparisonText: 'cumplimiento de actividades y SLA',
    },
  },

  funnelStages: [
    {
      stage: '1. Prospección',
      count: 64,
      value: 680000,
      conversionRate: 100,
      avgDaysInStage: 4,
    },
    {
      stage: '2. Calificación (SQL)',
      count: 42,
      value: 590000,
      conversionRate: 65.6,
      avgDaysInStage: 6,
    },
    {
      stage: '3. Presentación Propuesta',
      count: 28,
      value: 780000,
      conversionRate: 66.7,
      avgDaysInStage: 9,
    },
    {
      stage: '4. Negociación / Legal',
      count: 18,
      value: 524000,
      conversionRate: 64.3,
      avgDaysInStage: 7,
    },
    {
      stage: '5. Cerrada Ganada',
      count: 12,
      value: 395000,
      conversionRate: 66.7,
      avgDaysInStage: 0,
    },
  ] as FunnelStageMetric[],

  leadSources: [
    {
      source: 'Google Ads & Búsqueda',
      leads: 124,
      qualified: 58,
      dealsWon: 14,
      revenue: 460000,
      conversionRate: 11.3,
      color: '#3B82F6', // Blue
    },
    {
      source: 'Referidos / Clientes',
      leads: 48,
      qualified: 36,
      dealsWon: 22,
      revenue: 890000,
      conversionRate: 45.8,
      color: '#10B981', // Emerald
    },
    {
      source: 'Meta Ads (LinkedIn & IG)',
      leads: 96,
      qualified: 38,
      dealsWon: 8,
      revenue: 290000,
      conversionRate: 8.3,
      color: '#8B5CF6', // Purple
    },
    {
      source: 'Prospección Comercial Outbound',
      leads: 52,
      qualified: 31,
      dealsWon: 11,
      revenue: 520000,
      conversionRate: 21.1,
      color: '#E11D48', // Katapult Red
    },
    {
      source: 'Eventos & Webinars',
      leads: 28,
      qualified: 15,
      dealsWon: 5,
      revenue: 214000,
      conversionRate: 17.8,
      color: '#F59E0B', // Amber
    },
  ] as LeadSourceMetric[],

  repLeaderboard: [
    {
      name: 'Ana Gómez',
      role: 'Directora Comercial & Key Accounts',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      dealsWon: 18,
      revenueGenerated: 1120000,
      targetQuota: 950000,
      quotaAttainment: 117.9,
      activitiesCompleted: 98,
      avgDealSize: 62200,
    },
    {
      name: 'Mateo Rossi',
      role: 'Senior Sales Representative',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      dealsWon: 14,
      revenueGenerated: 780000,
      targetQuota: 750000,
      quotaAttainment: 104.0,
      activitiesCompleted: 112,
      avgDealSize: 55700,
    },
    {
      name: 'David Benítez',
      role: 'Solutions Architect & Enterprise',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      dealsWon: 8,
      revenueGenerated: 590000,
      targetQuota: 600000,
      quotaAttainment: 98.3,
      activitiesCompleted: 74,
      avgDealSize: 73750,
    },
    {
      name: 'Sofía Castro',
      role: 'Customer Success & Private Wealth',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
      dealsWon: 12,
      revenueGenerated: 420000,
      targetQuota: 400000,
      quotaAttainment: 105.0,
      activitiesCompleted: 89,
      avgDealSize: 35000,
    },
  ] as RepPerformanceMetric[],

  portfolioSegments: [
    {
      segment: 'Corporativo & Enterprise B2B',
      clientsCount: 8,
      totalValue: 2680000,
      mrrContribution: 195000,
      percentage: 55.1,
      color: '#0A1128', // Navy
    },
    {
      segment: 'PYME & Crecimiento B2B',
      clientsCount: 22,
      totalValue: 1420000,
      mrrContribution: 105000,
      percentage: 29.2,
      color: '#E11D48', // Red
    },
    {
      segment: 'Profesionales & Particulares VIP',
      clientsCount: 14,
      totalValue: 760000,
      mrrContribution: 45000,
      percentage: 15.7,
      color: '#3B82F6', // Blue
    },
  ] as PortfolioSegment[],

  monthlyTrends: [
    { month: 'Mayo', leads: 210, opportunities: 32, revenue: 1650000, mrr: 280000 },
    { month: 'Junio', leads: 245, opportunities: 38, revenue: 1820000, mrr: 295000 },
    { month: 'Julio', leads: 260, opportunities: 41, revenue: 1940000, mrr: 310000 },
    { month: 'Agosto', leads: 285, opportunities: 46, revenue: 2050000, mrr: 325000 },
    { month: 'Septiembre', leads: 294, opportunities: 49, revenue: 2180000, mrr: 335000 },
    { month: 'Octubre (MTD)', leads: 348, opportunities: 58, revenue: 2374000, mrr: 345000 },
  ] as MonthlyTrendData[],

  operationalHealth: {
    activitiesByType: [
      { type: 'Reuniones y Demos', count: 142, percentage: 38, color: 'bg-purple-500' },
      { type: 'Llamadas Comerciales', count: 118, percentage: 31, color: 'bg-blue-500' },
      { type: 'Propuestas y Cotizaciones', count: 64, percentage: 17, color: 'bg-rose-500' },
      { type: 'Tareas Operativas & SLAs', count: 52, percentage: 14, color: 'bg-emerald-500' },
    ],
    taskPunctuality: '94.2%',
    avgResponseMinutes: '14 min',
    customerSatisfactionScore: '4.9 / 5.0',
    npsScore: '+72',
  },
};
