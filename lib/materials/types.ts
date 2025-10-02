export interface EcoImpact {
  carbonFootprint: number; // kg CO₂ per unit
  waterUsage?: number; // liters per unit
  energyConsumption?: number; // kWh per unit
  recyclability?: number; // percentage
  lifespan?: number; // years
  renewable?: boolean;
  local?: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  location: string;
  certifications: string[];
  rating?: number;
}

export interface SustainableMaterial {
  id: string;
  name: string;
  description: string;
  category: 'concrete' | 'steel' | 'wood' | 'insulation' | 'finishes' | 'other';
  cost: number;
  unit: string;
  availability: 'low' | 'medium' | 'high';
  ecoImpact: {
    carbonFootprint: number;
    waterUsage: number;
    energyConsumption?: number;
    recycledContent?: number;
    certifications?: string[];
    recyclability?: number; 
    renewable?: boolean;
    local?: boolean;
  };
  supplier?: Supplier;
  technicalSpecs: Record<string, any>;
  certifications?: string[];
  rating?: number;
  
}


export interface UserMetrics {
  totalSavings: number;
  netEmissions: number;
  materialsUsed: number;
  sustainabilityScore: number;
  budget: number;
  projectType: string;
  location: string;
  totalEmissions?: number;
  reductionTarget?: number;
  highImpactCategories?: string[];
}
export interface UserCarbonMetrics {
  userId: string;
  emissions: number;
  offset: number;
  totalEmissions: number;
  totalSavings: number;
  netEmissions: number;
  reductionTarget: number;
  highImpactCategories: string[];
}

export interface MaterialsHubProps {
  onMaterialSelect?: (material: SustainableMaterial) => void;
  siteId: string;
}

export type SortOption = "carbon" | "price" | "rating" | "recommended";