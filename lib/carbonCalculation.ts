// lib/carbon-calculations.ts

// ---------- Emission Factors (kg CO₂ per unit) ----------
export const emissionFactors = {
    energyGrid: 0.5, // kg CO₂ per kWh (Kenyan grid average)
    energyDiesel: 2.7, // kg CO₂ per kWh (from diesel generator)
    transport: 0.17, // kg CO₂ per km (for an average truck)
    fuelDiesel: 2.68, // kg CO₂ per liter (for diesel)
    wasteLandfill: 0.5, // kg CO₂ per kg of waste
    water: 0.34, // kg CO₂ per m³ of water
  };
  
  export interface CarbonActivity {
    id: string;
    timestamp: string;
    description: string;
    type: string;
    value: number;
    sustainableEF?: number;
    standardEF?: number;
    fuelType?: string;
    unit?: string;
  }
  
  export interface CarbonData {
    activities: CarbonActivity[];
    totalEmissions: number;
    totalSavings: number;
    netEmissions: number;
    trend: { time: string; emissions: number; savings: number; net: number }[];
    forecast?: { time: string; emissions: number; savings: number; net: number }[];
  }
  
  // ---------- Carbon Calculation Functions ----------
  export const calculateEmissions = (activity: CarbonActivity): number => {
    switch (activity.type) {
      case "energy":
        return activity.fuelType === "diesel"
          ? activity.value * emissionFactors.energyDiesel
          : activity.value * emissionFactors.energyGrid;
      case "transport":
        return activity.value * emissionFactors.transport;
      case "machinery":
        return activity.value * emissionFactors.fuelDiesel;
      case "waste":
        return activity.value * emissionFactors.wasteLandfill;
      case "water":
        return activity.value * emissionFactors.water;
      default:
        return 0;
    }
  };
  
  export const calculateSavings = (activity: CarbonActivity): number => {
    switch (activity.type) {
      case "renewable":
        return activity.value * emissionFactors.energyGrid;
      case "material":
        return activity.value * ((activity.standardEF || 0) - (activity.sustainableEF || 0));
      case "recycling":
        return activity.value * emissionFactors.wasteLandfill;
      case "waterReuse":
        return activity.value * emissionFactors.water;
      default:
        return 0;
    }
  };
  
  export const calculateEfficiencyScore = (data: CarbonData): string => {
    if (data.totalEmissions === 0) return 'A+';
    const efficiency = (data.totalSavings / data.totalEmissions) * 100;
    if (efficiency >= 50) return 'A';
    if (efficiency >= 30) return 'B';
    if (efficiency >= 10) return 'C';
    return 'D';
  };