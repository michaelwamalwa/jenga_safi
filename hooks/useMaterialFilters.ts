import { useState, useMemo } from 'react';
import { SustainableMaterial, SortOption } from '@/lib/materials/types';
import { RecommendationEngine } from '@/lib/materials/recommendation-engine';

interface UseMaterialFiltersProps {
  materials: SustainableMaterial[];
  userMetrics: any;
  industryAverages: Record<string, number>;
}

export const useMaterialFilters = ({
  materials,
  userMetrics,
  industryAverages
}: UseMaterialFiltersProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [estimatedQuantity, setEstimatedQuantity] = useState<number>(1000);

  const filteredMaterials = useMemo(() => {
    return (materials || [])
      .filter((material) => {
        if (!material) return false;
        
        const matchesCategory = selectedCategory === "all" || material.category === selectedCategory;
        const matchesSearch = searchTerm === "" || 
          material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          material.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          material.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesCategory && matchesSearch;
      })
      .map(material => {
        const carbonFootprint = material.ecoImpact.carbonFootprint;
        const industryAvg = industryAverages[material.category] || 200;
        
        return {
          ...material,
          recommendationScore: RecommendationEngine.calculateRecommendationScore(
            material, 
            userMetrics, 
            industryAverages
          ),
          potentialSavings: (industryAvg - carbonFootprint) * estimatedQuantity,
          industryAverage: industryAvg
        };
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "recommended":
            return (b.recommendationScore || 0) - (a.recommendationScore || 0);
          case "carbon":
            return a.ecoImpact.carbonFootprint - b.ecoImpact.carbonFootprint;
          case "price":
            return a.cost - b.cost;
          case "rating":
            return (b.supplier?.rating || 0) - (a.supplier?.rating || 0);
          default:
            return 0;
        }
      });
  }, [materials, selectedCategory, searchTerm, sortBy, estimatedQuantity, userMetrics, industryAverages]);

  const getPersonalizedRecommendations = () => {
    const priorityCategories = userMetrics?.highImpactCategories || ["concrete", "steel", "insulation"];
    return filteredMaterials
      .filter(material => priorityCategories.includes(material.category))
      .slice(0, 3);
  };

  return {
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    estimatedQuantity,
    setEstimatedQuantity,
    filteredMaterials,
    getPersonalizedRecommendations
  };
};