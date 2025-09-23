// utils/carbon.ts
export function calculateCarbonSaved({
    paperUsage,
    energyUsage,
    travelFrequency,
  }: {
    paperUsage: number;
    energyUsage: number;
    travelFrequency: "low" | "medium" | "high";
  }): number {
    const paperFactor = 0.01; // kg CO₂ saved per sheet of paper
    const energyFactor = 0.5; // kg CO₂ saved per kWh reduced
    const travelFactors = { low: 10, medium: 30, high: 60 }; // monthly kg CO₂ saved
  
    return (
      paperUsage * paperFactor +
      energyUsage * energyFactor +
      travelFactors[travelFrequency]
    );
  }
  