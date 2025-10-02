// materialsStats.tsx
import { SustainableMaterial } from "@/lib/materials/types";

interface MaterialsStatsProps {
  materials: SustainableMaterial[];
  userMetrics: any;
  personalizedCount: number;
}

export function MaterialsStats({ materials, userMetrics, personalizedCount }: MaterialsStatsProps) {
  // Calculate statistics from materials data
  const totalMaterials = materials.length;
  
  const categories = [...new Set(materials.map(m => m.category))];
  const suppliers = [...new Set(materials.map(m => m.supplier?.name).filter(Boolean))];
  
  const avgCarbonFootprint = materials.length > 0 
    ? materials.reduce((sum, m) => sum + m.ecoImpact.carbonFootprint, 0) / materials.length
    : 0;

  const lowCarbonMaterials = materials.filter(m => m.ecoImpact.carbonFootprint < avgCarbonFootprint).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 p-4 bg-muted/50 rounded-lg">
      <div className="text-center">
        <div className="text-2xl font-bold text-primary">{totalMaterials}</div>
        <div className="text-sm text-muted-foreground">Total Materials</div>
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold text-green-600">{personalizedCount}</div>
        <div className="text-sm text-muted-foreground">Recommended</div>
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
        <div className="text-sm text-muted-foreground">Categories</div>
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold text-orange-600">{lowCarbonMaterials}</div>
        <div className="text-sm text-muted-foreground">Low Carbon Options</div>
      </div>
    </div>
  );
}