export interface Supplier {
    _id?: string;
    name: string;
    contact: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    certification: string[]; // e.g., ['FSC', 'ISO 14001', 'Green Star']
    rating: number; // 1-5 stars
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface SustainableMaterial {
    _id?: string;
    name: string;
    category: 'brick' | 'concrete' | 'steel' | 'wood' | 'insulation' | 'finishes' | 'other';
    description: string;
    supplierId: string;
    supplier?: Supplier; // Populated from backend
    ecoImpact: {
      carbonFootprint: number; // kg CO₂ per unit
      waterUsage: number; // liters per unit
      recyclability: number; // percentage
      renewable: boolean;
      local: boolean; // sourced locally in Kenya
    };
    unit: string; // e.g., 'kg', 'ton', 'm²', 'm³'
    price: number; // KES per unit
    availability: 'high' | 'medium' | 'low';
    images?: string[];
    certification: string[];
    createdAt?: Date;
    updatedAt?: Date;
    rating?: number;
  }
  
  export interface MaterialRating {
    materialId: string;
    userId: string;
    rating: number; // 1-5
    comment?: string;
    createdAt: Date;
  }