import { SustainableMaterial, UserCarbonMetrics } from './types';

export class MaterialsApiService {
  static async fetchUserMetrics(siteId: string): Promise<UserCarbonMetrics> {
    try {
      const response = await fetch(`/api/carbon-trends?siteId=${siteId}`);
      const carbonData = await response.json();
      
      return {
        totalEmissions: carbonData.totalEmissions || 0,
        totalSavings: carbonData.totalSavings || 0,
        netEmissions: carbonData.netEmissions || 0,
        reductionTarget: 25,
        highImpactCategories: await this.analyzeHighImpactCategories(siteId),
        userId: siteId,
        emissions: 0,
        offset: 0

      };
    } catch (error) {
      return this.getDefaultUserMetrics();
    }
  }

  static async analyzeHighImpactCategories(siteId: string): Promise<string[]> {
    try {
      const response = await fetch(`/api/activities?siteId=${siteId}`);
      const activities = await response.json();
      
      const categoryEmissions: Record<string, number> = {};
      activities.forEach((activity: any) => {
        if (activity.category) {
          categoryEmissions[activity.category] = (categoryEmissions[activity.category] || 0) + (activity.emissions || 0);
        }
      });
      
      return Object.entries(categoryEmissions)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([category]) => category);
    } catch (error) {
      return ["concrete", "steel", "insulation"];
    }
  }

  static async saveCarbonSavings(data: any): Promise<void> {
    await fetch('/api/carbon-trends/new', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }

  private static getDefaultUserMetrics(): UserCarbonMetrics {
    return {
      totalEmissions: 0,
      totalSavings: 0,
      netEmissions: 0,
      reductionTarget: 25,
      highImpactCategories: ["concrete", "steel", "insulation"],
      userId: '',
      emissions: 0,
      offset: 0
    };
  }
}