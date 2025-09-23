export type ContractorStatus = 'active' | 'on-hold' | 'archived';

export interface LocationCoords {
  lat: number;
  lng: number;
}

export interface SustainabilityMetrics {
  score: number;
  carbonFootprint: number; // kg CO2/month
  energyUsage: number; // kWh/month
  wasteRecycled: number; // percentage
  waterSaved: number; // liters/month
}

export interface PerformanceMetrics {
  rating: number; // 1-5
  onTimeCompletion: number; // percentage
  budgetAdherence: number; // percentage
  safetyIncidents: number; // count
  responseTime: number; // hours
}

export interface ProjectSummary {
  total: number;
  active: number;
  completed: number;
  delayed: number;
}

export interface Contractor {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  specialization: string;
  location: string;
  locationCoords?: LocationCoords;
  status: ContractorStatus;
  joinedDate: string; // ISO date
  lastActive: string; // ISO date
  sustainability: SustainabilityMetrics;
  performance: PerformanceMetrics;
  projects: ProjectSummary;
  certifications: string[];
  notes?: string;
}

export interface ContractorAnalytics {
  contractors: Contractor[];
  totalCount: number;
  statusDistribution: Record<ContractorStatus, number>;
  avgSustainability: number;
  avgPerformance: number;
  locationDistribution: Record<string, number>;
  specializationDistribution: Record<string, number>;
  recentActivity: {
    date: string;
    active: number;
    new: number;
  }[];
}

export interface ContractorUpdate {
  id: string;
  status?: ContractorStatus;
  notes?: string;
  sustainabilityScore?: number;
  performanceRating?: number;
}