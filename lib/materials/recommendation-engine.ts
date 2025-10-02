import { SustainableMaterial, UserCarbonMetrics } from './types';
import { getIndustryAverageCarbon } from './data-sources';

export class RecommendationEngine {
  static calculateRecommendationScore(
    material: SustainableMaterial, 
    userMetrics: UserCarbonMetrics | null,
    industryAverages: Record<string, number>
  ): number {
    if (!userMetrics) return 50;

    let score = 0;
    
    try {
      // Carbon savings potential (40% weight)
      const industryAvg = industryAverages[material.category] || getIndustryAverageCarbon(material.category);
      const carbonFootprint = material.ecoImpact.carbonFootprint;
      const carbonSavings = Number(industryAvg) - carbonFootprint;
      const carbonScore = Math.max(0, (carbonSavings / Number(industryAvg)) * 40);
      score += carbonScore;
      
      // Match with user's high-impact categories (30% weight)
      if (userMetrics.highImpactCategories.includes(material.category)) {
        score += 30;
      }
      
      // Supplier reliability (20% weight)
      score += (material.supplier?.rating || 3) * 4;
      
      // Local sourcing bonus (10% weight)
      if (material.ecoImpact.local) {
        score += 10;
      }
    } catch (error) {
      console.error("Error calculating recommendation score:", error);
      score = 50;
    }
    
    return Math.min(100, Math.max(0, score));
  }

  static getRecommendationBadge(score: number) {
    if (score >= 80) return { text: "Highly Recommended", color: "bg-emerald-500 text-white" };
    if (score >= 60) return { text: "Recommended", color: "bg-blue-500 text-white" };
    return { text: "Good Option", color: "bg-gray-500 text-white" };
  }

  static getEcoImpactColor(carbonFootprint: number) {
    if (carbonFootprint < 50) return "bg-emerald-100 text-emerald-800";
    if (carbonFootprint < 150) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  }
}