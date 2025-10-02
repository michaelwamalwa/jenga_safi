// lib/emissions.ts
// Fetches emission factors from authoritative sources (Kenya Power, UNFCCC, etc)

type EmissionFactors = {
    energyGrid: number;       // kg CO2 per kWh (Kenya Power grid average)
    energyDiesel: number;     // kg CO2 per liter of diesel used in gensets
    transport: number;        // kg CO2 per ton-km (road transport baseline)
    fuelDiesel: number;       // kg CO2 per liter of diesel (machinery/transport)
    wasteLandfill: number;    // kg CO2 per ton of waste sent to landfill
    water: number;            // kg CO2 per m³ treated/pumped water
    materialStandard: number; // baseline kg CO2 per ton of conventional material
    materialSustainable: number; // kg CO2 per ton of sustainable material
  };
  
  // In production, you’d fetch or cache this from APIs or live datasets.
  // For now, we return hardwired factors but from this central point only.
  // 🔴 These must always be updated with *real values* – no mock placeholders.
  export async function fetchEmissionFactors(): Promise<EmissionFactors> {
    // Example factors (these should be synced with Kenya Power/UNFCCC publications)
    return {
      energyGrid: 0.43,            // Kenya avg grid intensity ~0.43 kgCO2/kWh
      energyDiesel: 2.68,          // ~2.68 kgCO2/liter diesel
      transport: 0.12,             // ~0.12 kgCO2/ton-km (road freight)
      fuelDiesel: 2.68,            // same as above for machinery
      wasteLandfill: 1.90,         // ~1.9 kgCO2/kg mixed waste landfilled
      water: 0.34,                 // ~0.34 kgCO2/m³ treated/pumped water
      materialStandard: 800,       // e.g., conventional cement ~800 kgCO2/ton
      materialSustainable: 350,    // e.g., fly-ash cement blend ~350 kgCO2/ton
    };
  }
  