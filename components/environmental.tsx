// app/components/environmental.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import KPICard from "./environment/kpi";
import RealTimeChart from "./environment/real";
import AlertFeed from "./environment/alert";
import SiteSelector from "./environment/site";
import TimeRangePicker from "./environment/time";
import ConnectionStatus from "./environment/connection";
import NEMAComplianceStatus from "./environment/nema";
import CarbonVisualization from "./environment/carbonnew";

// --- Types ---
interface Site {
  _id: string;
  name: string;
  location: string;
}

interface EnvironmentalDataPoint {
  timestamp: string;
  carbonEmissions: number;
  airQuality: number;
  noiseLevel: number;
  waterUsage: number;
  wasteGeneration: number;
}

interface Alert {
  _id: string;
  message: string;
  acknowledged: boolean;
  severity: "low" | "medium" | "high";
  timestamp: string;
}

interface Project {
  _id: string;
  name: string;
}

interface EcoTask {
  _id: string;
  title: string;
  description: string;
  site: string;
  materials: string[];
  deadline: string;
  priority: "low" | "medium" | "high";
  ecoImpact: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed";
  assignedTo: string;
  estimatedCarbonSavings: number;
  actualCarbonSavings: number;
  projectId: string;
}

interface KPI {
  title: string;
  value: number | string;
  unit: string;
  status: string;
  trend: number;
  icon: string;
  threshold: string;
  lastUpdate: string;
}

interface NEMACompliance {
  status: string;
  score: number;
  nextReport: string;
  violations: number;
}

// --- Component ---
const EnvironmentalMonitoringCommandCenter: React.FC = () => {
  // Filters & Controls
  const [selectedSite, setSelectedSite] = useState<string>("all");
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>("1hour");
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Data States
  const [sites, setSites] = useState<Site[]>([]);
  const [environmentalData, setEnvironmentalData] = useState<EnvironmentalDataPoint[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [kpiData, setKpiData] = useState<KPI[]>([]);
  const [nemaComplianceData, setNemaComplianceData] = useState<NEMACompliance>({
    status: "unknown",
    score: 0,
    nextReport: "",
    violations: 0,
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [ecoTasks, setEcoTasks] = useState<EcoTask[]>([]);

  // --- Data Fetching ---
  useEffect(() => {
    fetchSites();
    fetchAlerts();
    fetchNEMACompliance();
    fetchProjectsAndTasks();
  }, []);

  useEffect(() => {
    if (sites.length > 0) fetchEnvironmentalData();
  }, [selectedSite, selectedTimeRange, sites]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setLastUpdate(new Date());
      fetchEnvironmentalData();
      fetchAlerts();
      setIsConnected(Math.random() > 0.1); // Simulate connection
    }, 15000);

    return () => clearInterval(interval);
  }, [autoRefresh, selectedSite, selectedTimeRange]);

  // --- Fetch functions ---
  const fetchSites = async () => {
    try {
      const res = await fetch("/api/sites");
      const result = await res.json();
      if (result.success) setSites(result.data);
    } catch (err) {
      console.error("Error fetching sites:", err);
    }
  };

  const fetchEnvironmentalData = async () => {
    try {
      const params = new URLSearchParams({
        siteId: selectedSite,
        timeRange: selectedTimeRange,
      });
      const res = await fetch(`/api/environmental-data?${params}`);
      const result = await res.json();
      if (result.success) {
        setEnvironmentalData(result.data);
        updateKpiData(result.data);
      }
    } catch (err) {
      console.error("Error fetching environmental data:", err);
    }
  };

  const fetchAlerts = async () => {
    try {
      const res = await fetch("/api/alerts?acknowledged=false");
      const result = await res.json();
      if (result.success) setAlerts(result.data);
    } catch (err) {
      console.error("Error fetching alerts:", err);
    }
  };

  const fetchNEMACompliance = async () => {
    try {
      const mockNemaData: NEMACompliance = {
        status: "warning",
        score: 78,
        nextReport: "2025-01-25",
        violations: 2,
      };
      setNemaComplianceData(mockNemaData);
    } catch (err) {
      console.error("Error fetching NEMA compliance:", err);
    }
  };

  const fetchProjectsAndTasks = async () => {
    try {
      const [projectsRes, tasksRes] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/ecotasks"),
      ]);
      const projectsData = await projectsRes.json();
      const tasksData = await tasksRes.json();

      if (projectsData.success) setProjects(projectsData.data);
      if (tasksData.success) setEcoTasks(tasksData.data);
    } catch (err) {
      console.error("Error fetching projects and tasks:", err);
    }
  };

  // --- KPI Update ---
  const updateKpiData = (data: EnvironmentalDataPoint[]) => {
    if (data.length === 0) return;

    const latest = data[0];
    const newKpis: KPI[] = [
      {
        title: "Carbon Emissions",
        value: (latest.carbonEmissions / 1000).toFixed(1),
        unit: "tons CO₂/day",
        status: latest.carbonEmissions > 2000 ? "warning" : "good",
        trend: 12,
        icon: "Zap",
        threshold: "2.0 tons",
        lastUpdate: "2 min ago",
      },
      {
        title: "Air Quality Index",
        value: latest.airQuality.toFixed(0),
        unit: "AQI",
        status: latest.airQuality > 100 ? "warning" : "good",
        trend: -5,
        icon: "Wind",
        threshold: "100 AQI",
        lastUpdate: "1 min ago",
      },
      {
        title: "Noise Levels",
        value: latest.noiseLevel.toFixed(0),
        unit: "dB",
        status: latest.noiseLevel > 70 ? "warning" : "good",
        trend: 8,
        icon: "Volume2",
        threshold: "70 dB",
        lastUpdate: "3 min ago",
      },
      {
        title: "Water Usage",
        value: latest.waterUsage.toLocaleString(),
        unit: "L/hour",
        status: latest.waterUsage > 1500 ? "warning" : "good",
        trend: -3,
        icon: "Droplets",
        threshold: "1,500 L/hour",
        lastUpdate: "5 min ago",
      },
      {
        title: "Waste Generation",
        value: latest.wasteGeneration.toLocaleString(),
        unit: "kg/day",
        status: latest.wasteGeneration > 500 ? "warning" : "good",
        trend: -15,
        icon: "Trash2",
        threshold: "500 kg/day",
        lastUpdate: "10 min ago",
      },
      {
        title: "Environmental Score",
        value: calculateEnvironmentalScore(latest),
        unit: "/100",
        status: "good",
        trend: 4,
        icon: "Leaf",
        threshold: "70/100",
        lastUpdate: "1 min ago",
      },
    ];

    setKpiData(newKpis);
  };

  const calculateEnvironmentalScore = (data: EnvironmentalDataPoint) => {
    let score = 100;
    if (data.carbonEmissions > 2000) score -= 15;
    if (data.airQuality > 100) score -= 10;
    if (data.noiseLevel > 70) score -= 10;
    if (data.waterUsage > 1500) score -= 5;
    if (data.wasteGeneration > 500) score -= 10;
    return Math.max(0, Math.min(100, score));
  };

  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      const res = await fetch("/api/alerts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alertId }),
      });
      const result = await res.json();
      if (result.success) setAlerts(prev => prev.filter(a => a._id !== alertId));
    } catch (err) {
      console.error("Error acknowledging alert:", err);
    }
  };

  const handleToggleAutoRefresh = () => setAutoRefresh(!autoRefresh);
  const activeAlerts = alerts.filter(alert => !alert.acknowledged);

  // --- Render ---
  return (
    <>
      <Helmet>
        <title>Environmental Monitoring Command Center - JengaSafi</title>
        <meta
          name="description"
          content="Real-time environmental monitoring dashboard for construction sites across Nairobi with carbon emissions tracking and NEMA compliance."
        />
      </Helmet>

      <div className="min-h-screen bg-background pt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header Controls */}
          <div className="bg-card rounded-lg border border-border p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <SiteSelector
                  sites={sites}
                  selectedSite={selectedSite}
                  onSiteChange={setSelectedSite}
                />
                <TimeRangePicker
                  selectedRange={selectedTimeRange}
                  onRangeChange={setSelectedTimeRange}
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <ConnectionStatus
                  isConnected={isConnected}
                  lastUpdate={lastUpdate}
                  autoRefresh={autoRefresh}
                  onToggleAutoRefresh={handleToggleAutoRefresh}
                />
              </div>
            </div>
            <div className="mt-4">
              <NEMAComplianceStatus complianceData={nemaComplianceData} />
            </div>
          </div>

    

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
            {kpiData.map((kpi, index) => (
              <KPICard key={index} {...kpi} />
            ))}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-6">
              <RealTimeChart
                data={environmentalData}
                title="Carbon Emissions Trend"
                dataKey="carbonEmissions"
                color="error"
                threshold={2000}
                unit="kg CO₂"
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RealTimeChart
                  data={environmentalData}
                  title="Air Quality Index"
                  dataKey="airQuality"
                  color="primary"
                  threshold={100}
                  unit="AQI"
                />
                <RealTimeChart
                  data={environmentalData}
                  title="Noise Levels"
                  dataKey="noiseLevel"
                  color="warning"
                  threshold={70}
                  unit="dB"
                />
              </div>
            </div>

            <div className="xl:col-span-1">
              <AlertFeed alerts={activeAlerts} onAcknowledge={handleAcknowledgeAlert} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EnvironmentalMonitoringCommandCenter;
