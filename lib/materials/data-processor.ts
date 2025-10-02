import { SustainableMaterial, Supplier } from './types';

export class MaterialsDataProcessor {
  static validateMaterial(material: any): SustainableMaterial {
    const supplier = MaterialsDataProcessor.getMaterialSupplier(material);
  
    return {
      id: material.id || material._id || `material-${Math.random().toString(36).substr(2, 9)}`, // Use 'id' instead of '_id'
      name: material.name || 'Unnamed Material',
      description: material.description || 'No description available',
      category: MaterialsDataProcessor.getMaterialCategory(material),
      cost: Number(material.cost) || Number(material.price) || 0, // Use 'cost' to match your component
      unit: material.unit || 'unit',
      availability: material.availability || 'medium',
      ecoImpact: {
        carbonFootprint: MaterialsDataProcessor.getMaterialCarbonFootprint(material),
        waterUsage: material?.ecoImpact?.waterUsage || material?.waterUsage || 0,
        energyConsumption: material?.ecoImpact?.energyConsumption || material?.energyConsumption || 0, // Add missing property
        recycledContent: material?.ecoImpact?.recycledContent || material?.recycledContent || 0, // Add missing property
        certifications: material?.ecoImpact?.certifications || material?.certifications || [] // Add missing property
      },
      supplier,
      technicalSpecs: material.technicalSpecs || {} // Add missing property
    };
  }

  static getMaterialCarbonFootprint(material: any): number {
    return material?.ecoImpact?.carbonFootprint ?? 
           material?.carbonFootprint ?? 
           material?.gwpA1A3 ?? 
           200;
  }

  static getMaterialCategory(material: any): SustainableMaterial['category'] {
    const category = material?.category?.toLowerCase() || 'other';
    const allowedCategories: SustainableMaterial['category'][] = ['concrete', 'steel', 'wood', 'insulation', 'finishes', 'other'];
    return allowedCategories.includes(category as any) ? category as SustainableMaterial['category'] : 'other';
  }

  static getMaterialSupplier(material: any): Supplier | undefined {
    if (!material.supplier) return undefined;
    
    return {
      id: material.supplier.id || material.supplier._id || 'unknown', // Use 'id' instead of '_id'
      name: material.supplier.name || 'Unknown Supplier',
      location: material.supplier.location || 'Unknown',
      certifications: material.supplier.certifications || material.supplier.certification || []
    };
  }
}