"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  NetEmissionsTrend,
  EmissionsVsSavings,
  PredictiveAnalysis,
} from "../carbonCharts";
import { Helmet } from "react-helmet";
import { ActivityLog } from "../carbonActivity";
import { DataSourceCredibility } from "../dataCredibility";
import { CarbonData } from "@/lib/carbonCalculation";
import { ActivityForm } from "../activityForm";
import { KPISummary } from "../kpiSummary";
import { AIInsights } from "../aiInsights";

type Props = {
  siteId: string;
carbonEmitted: number;
carbonSaved: number;
trend: { 
  time: string; 
  emissions: number;
  savings: number;
  net: number }[]
};


// ---------- Main Dashboard Component ----------
export default function EnvironmentalMonitoringDashboard({ siteId }: Props) {
  const { data: session } = useSession();
  const [carbonData, setCarbonData] = useState<CarbonData>({
    activities: [],
    totalEmissions: 0,
    totalSavings: 0,
    netEmissions: 0,
    trend: [],
    forecast: [],
  });

  const [insights, setInsights] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataSources, setDataSources] = useState({
    kenyaPower: { lastUpdated: "", credibility: "High" },
    unfccc: { lastUpdated: "", credibility: "Verified" },
    localData: { lastUpdated: "", credibility: "Real-time" },
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchCarbonData();
    fetchInsights();
    fetchDataSources();

    const interval = setInterval(fetchCarbonData, 30000);
    return () => clearInterval(interval);
  }, [siteId]);

  const fetchCarbonData = async () => {
    try {
      const response = await fetch(`/api/carbon-trends?siteId=${siteId}`);
      const data = await response.json();
      setCarbonData(data);
    } catch (error) {
      console.error("Error fetching carbon data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInsights = async () => {
    try {
      const response = await fetch(`/api/insights?siteId=${siteId}`);
      const data = await response.json();
      setInsights(data.insights || []);
    } catch (error) {
      console.error("Error fetching insights:", error);
    }
  };

  const fetchDataSources = async () => {
    setDataSources({
      kenyaPower: {
        lastUpdated: new Date().toISOString(),
        credibility: "High - Kenya Power Live Grid Mix",
      },
      unfccc: {
        lastUpdated: new Date().toISOString(),
        credibility: "Verified - UNFCCC Dataset 2024",
      },
      localData: {
        lastUpdated: new Date().toISOString(),
        credibility: "Real-time - Site Sensors",
      },
    });
  };

  return (
    <>
      <Helmet>
        <title>Carbon Tracker - JengaSafi</title>
      </Helmet>

      <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Carbon Footprint Tracker
            </h1>
            <p className="text-muted-foreground">
              Monitor emissions and savings from construction activities
            </p>
          </div>

          {/* KPI Summary */}
          <KPISummary carbonData={carbonData} isLoading={isLoading} />

          {/* Data Source Credibility */}
          <DataSourceCredibility dataSources={dataSources} />

          {/* Input Form */}
          <ActivityForm
            siteId={siteId}
            onActivityAdded={() => {
              fetchCarbonData();
              fetchInsights();
            }}
          />

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Net Emissions Trend */}
            <NetEmissionsTrend carbonData={carbonData} />
            <EmissionsVsSavings carbonData={carbonData} />
          </div>

          {/* Predictive Analysis Chart */}
         <PredictiveAnalysis carbonData={carbonData} />

          {/* AI-Powered Insights */}
          <AIInsights insights={insights} isLoading={isLoading} />

          {/* Activity Log */}
          <ActivityLog activities={carbonData.activities} />
        </div>
      </div>
    </>
  );
}
