"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { Helmet } from "react-helmet";

// ---------- Emission Factors (kg CO₂ per unit) - These can be configurable later ----------
const emissionFactors = {
  energyGrid: 0.5, // kg CO₂ per kWh (Kenyan grid average)
  energyDiesel: 2.7, // kg CO₂ per kWh (from diesel generator)
  transport: 0.17, // kg CO₂ per km (for an average truck)
  fuelDiesel: 2.68, // kg CO₂ per liter (for diesel)
  wasteLandfill: 0.5, // kg CO₂ per kg of waste
  water: 0.34, // kg CO₂ per m³ of water
};

// ---------- Carbon Calculation Functions ----------
const calculateEmissions = (activity: any) => {
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

const calculateSavings = (activity: any) => {
  switch (activity.type) {
    case "renewable":
      // Savings equal to the emissions avoided from the grid
      return activity.value * emissionFactors.energyGrid;
    case "material":
      // Savings based on the difference in emission factors
      return activity.value * (activity.standardEF - activity.sustainableEF);
    case "recycling":
      // Savings from avoiding landfill
      return activity.value * emissionFactors.wasteLandfill;
    case "waterReuse":
      // Savings from avoiding water treatment/pumping
      return activity.value * emissionFactors.water;
    default:
      return 0;
  }
};

// ---------- Interfaces ----------
interface CarbonActivity {
  id: string;
  timestamp: string;
  description: string;
  type: string;
  value: number;
  // For savings
  sustainableEF?: number;
  standardEF?: number;
  fuelType?: string;
}

interface CarbonData {
  activities: CarbonActivity[];
  totalEmissions: number;
  totalSavings: number;
  netEmissions: number;
  trend: { time: string; emissions: number; savings: number; net: number }[];
}
type Props = {
  siteId: string;
  carbonEmitted: number;
  carbonSaved: number;
  trend: { time: string; emissions: number; savings: number; net: number }[];
}
// ---------- Main Dashboard Component ----------
export default function EnvironmentalMonitoringDashboard({
  }: Props) {
  const [carbonData, setCarbonData] = useState<CarbonData>({
    activities: [],
    totalEmissions: 0,
    totalSavings: 0,
    netEmissions: 0,
    trend: [],
  });

  const [newActivity, setNewActivity] = useState({
    type: "energy",
    value: "",
    description: "",
    fuelType: "grid",
    sustainableEF: "",
    standardEF: "",
  });

  // Calculate totals whenever activities change
  useEffect(() => {
    let totalE = 0;
    let totalS = 0;

    carbonData.activities.forEach((activity) => {
      if (activity.type === "renewable" || activity.type === "material" || activity.type === "recycling" || activity.type === "waterReuse") {
        totalS += calculateSavings(activity);
      } else {
        totalE += calculateEmissions(activity);
      }
    });

    const net = totalE - totalS;

    // Build trend data for the chart (simplified: just adds a new point for the latest net)
    const newTrendPoint = {
      time: new Date().toISOString(),
      emissions: totalE,
      savings: totalS,
      net: net,
    };

    setCarbonData((prev) => ({
      ...prev,
      totalEmissions: totalE,
      totalSavings: totalS,
      netEmissions: net,
      trend: [...prev.trend, newTrendPoint].slice(-10), // Keep last 10 data points
    }));
  }, [carbonData.activities]); // Recalculate when activities change

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();

    const baseActivity = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      description: newActivity.description || `Carbon ${newActivity.type === 'renewable' ? 'Saving' : 'Emission'}`,
      value: Number(newActivity.value),
    };

    let activityToAdd: CarbonActivity;

    if (newActivity.type === "energy" || newActivity.type === "machinery") {
      activityToAdd = {
        ...baseActivity,
        type: newActivity.type,
        fuelType: newActivity.fuelType,
      };
    } else if (newActivity.type === "material") {
      activityToAdd = {
        ...baseActivity,
        type: newActivity.type,
        sustainableEF: Number(newActivity.sustainableEF),
        standardEF: Number(newActivity.standardEF),
      };
    } else {
      activityToAdd = {
        ...baseActivity,
        type: newActivity.type,
      };
    }

    setCarbonData((prev) => ({
      ...prev,
      activities: [...prev.activities, activityToAdd],
    }));

    // Reset form
    setNewActivity({
      type: "energy",
      value: "",
      description: "",
      fuelType: "grid",
      sustainableEF: "",
      standardEF: "",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setNewActivity((prev) => ({ ...prev, [field]: value }));
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
            <h1 className="text-3xl font-bold text-foreground">Carbon Footprint Tracker</h1>
            <p className="text-muted-foreground">Monitor emissions and savings from construction activities</p>
          </div>

          {/* KPI Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-2">Total Emissions</h3>
              <p className="text-3xl font-bold text-destructive">{carbonData.totalEmissions.toFixed(2)} kg CO₂</p>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-2">Total Savings</h3>
              <p className="text-3xl font-bold text-emerald-600">{carbonData.totalSavings.toFixed(2)} kg CO₂</p>
            </div>
            <div className={`bg-card p-6 rounded-lg border border-border shadow-sm ${carbonData.netEmissions >= 0 ? 'border-destructive/20' : 'border-emerald-500/20'}`}>
              <h3 className="text-lg font-semibold text-foreground mb-2">Net Emissions</h3>
              <p className={`text-3xl font-bold ${carbonData.netEmissions >= 0 ? 'text-destructive' : 'text-emerald-600'}`}>
                {carbonData.netEmissions.toFixed(2)} kg CO₂
              </p>
            </div>
          </div>

          {/* Input Form */}
          <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
            <h2 className="text-xl font-semibold text-foreground mb-4">Log New Activity</h2>
            <form onSubmit={handleAddActivity} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Activity Type */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Activity Type</label>
                  <select
                    value={newActivity.type}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                    required
                  >
                    <optgroup label="Emissions">
                      <option value="energy">Energy Consumption</option>
                      <option value="transport">Material Transport</option>
                      <option value="machinery">Machinery Fuel</option>
                      <option value="waste">Waste to Landfill</option>
                      <option value="water">Water Consumption</option>
                    </optgroup>
                    <optgroup label="Savings">
                      <option value="renewable">Renewable Energy</option>
                      <option value="material">Sustainable Material</option>
                      <option value="recycling">Waste Recycled</option>
                      <option value="waterReuse">Water Reused</option>
                    </optgroup>
                  </select>
                </div>

                {/* Value */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    {newActivity.type === "energy" || newActivity.type === "renewable" ? "Energy (kWh)" :
                     newActivity.type === "transport" ? "Distance (km)" :
                     newActivity.type === "machinery" ? "Fuel (Liters)" :
                     (newActivity.type === "waste" || newActivity.type === "recycling") ? "Weight (kg)" :
                     (newActivity.type === "water" || newActivity.type === "waterReuse") ? "Volume (m³)" :
                     newActivity.type === "material" ? "Quantity (tons)" : "Value"}
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={newActivity.value}
                    onChange={(e) => handleInputChange("value", e.target.value)}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                    required
                  />
                </div>
              </div>

              {/* Conditional Fields */}
              {newActivity.type === "energy" || newActivity.type === "machinery" ? (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Fuel Source</label>
                  <select
                    value={newActivity.fuelType}
                    onChange={(e) => handleInputChange("fuelType", e.target.value)}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                    required
                  >
                    <option value="grid">Grid Electricity</option>
                    <option value="diesel">Diesel</option>
                  </select>
                </div>
              ) : null}

              {newActivity.type === "material" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Standard Material EF (kg CO₂/unit)</label>
                    <input
                      type="number"
                      step="any"
                      value={newActivity.standardEF}
                      onChange={(e) => handleInputChange("standardEF", e.target.value)}
                      className="w-full px-3 py-2 border rounded-md bg-background"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Sustainable Material EF (kg CO₂/unit)</label>
                    <input
                      type="number"
                      step="any"
                      value={newActivity.sustainableEF}
                      onChange={(e) => handleInputChange("sustainableEF", e.target.value)}
                      className="w-full px-3 py-2 border rounded-md bg-background"
                      required
                    />
                  </div>
                </div>
              ) : null}

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Description (Optional)</label>
                <input
                  type="text"
                  value={newActivity.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="e.g., Concrete delivery, Solar panel output"
                  className="w-full px-3 py-2 border rounded-md bg-background"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2 bg-primary text-primary-foreground rounded-md shadow hover:bg-primary/90"
              >
                Add Activity
              </button>
            </form>
          </div>

         {/* Charts */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Net Emissions Trend */}
  <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
    <h3 className="text-lg font-semibold text-foreground mb-4">Net Emissions Trend</h3>
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={carbonData.trend}>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0 0)" />
          <XAxis
            dataKey="time"
            tickFormatter={(t) => new Date(t).toLocaleTimeString()}
            tick={{ fill: 'oklch(0.5 0 0)', fontSize: 12 }}
          />
          <YAxis
            tick={{ fill: 'oklch(0.5 0 0)', fontSize: 12 }}
            // Optional: Label for the Y-axis
            label={{ value: 'kg CO₂', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              borderColor: 'hsl(var(--border))',
              borderRadius: '8px',
            }}
            formatter={(value) => [`${Number(value).toFixed(2)} kg CO₂`]}
            labelFormatter={(label) => new Date(label).toLocaleString()}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="net"
            stroke="#3b82f6" // Tailwind blue-500
            strokeWidth={2}
            dot={{ r: 4, fill: "#3b82f6" }}
            activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2, fill: "#fff" }}
            name="Net Emissions"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>

  {/* Emissions vs Savings Breakdown */}
  <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
    <h3 className="text-lg font-semibold text-foreground mb-4">Emissions vs Savings</h3>
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={carbonData.trend.slice(-5)}> {/* Last 5 points */}
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0 0)" />
          <XAxis
            dataKey="time"
            tickFormatter={(t) => new Date(t).toLocaleTimeString()}
            tick={{ fill: 'oklch(0.5 0 0)', fontSize: 12 }}
          />
          <YAxis
            tick={{ fill: 'oklch(0.5 0 0)', fontSize: 12 }}
            // Optional: Label for the Y-axis
            label={{ value: 'kg CO₂', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              borderColor: 'hsl(var(--border))',
              borderRadius: '8px',
            }}
            formatter={(value, name) => {
              const formattedValue = `${Number(value).toFixed(2)} kg CO₂`;
              // Customize tooltip name for clarity
              if (name === 'Emissions') return [formattedValue, 'Total Emissions'];
              if (name === 'Savings') return [formattedValue, 'Carbon Savings'];
              return [formattedValue, name];
            }}
            labelFormatter={(label) => new Date(label).toLocaleString()}
          />
          <Legend />
          {/* Use explicit colors for clear distinction */}
          <Bar dataKey="emissions" fill="#ef4444" name="Emissions" /> {/* red-500 */}
          <Bar dataKey="savings" fill="#22c55e" name="Savings" />     {/* green-500 */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
</div>

          {/* Activity Log */}
          <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activities</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Time</th>
                    <th className="text-left py-2">Type</th>
                    <th className="text-left py-2">Description</th>
                    <th className="text-right py-2">Value</th>
                    <th className="text-right py-2">Impact (kg CO₂)</th>
                  </tr>
                </thead>
                <tbody>
                  {[...carbonData.activities].reverse().map((activity) => {
                    const impact = activity.type === "renewable" || activity.type === "material" || activity.type === "recycling" || activity.type === "waterReuse"
                      ? calculateSavings(activity)
                      : calculateEmissions(activity);
                    return (
                      <tr key={activity.id} className="border-b">
                        <td className="py-2">{new Date(activity.timestamp).toLocaleTimeString()}</td>
                        <td className="py-2 capitalize">{activity.type}</td>
                        <td className="py-2">{activity.description}</td>
                        <td className="py-2 text-right">{activity.value}</td>
                        <td className={`py-2 text-right font-medium ${impact < 0 ? 'text-emerald-600' : 'text-destructive'}`}>
                          {impact.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}