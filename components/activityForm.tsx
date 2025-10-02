// components/activity-form.tsx
"use client";

import React, { useState, useMemo } from "react";
import { 
  Calculator, 
  Info, 
  Zap, 
  Car, 
  Leaf, 
  Factory, 
  Recycle, 
  Droplets,
  Fuel,
  TrendingUp,
  TrendingDown,
  Sparkles,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface ActivityFormProps {
  siteId: string;
  onActivityAdded: () => void;
}

interface NewActivityState {
  type: string;
  value: string;
  description: string;
  fuelType: string;
  sustainableEF: string;
  standardEF: string;
}

// Emission factors (kg CO₂ per unit)
const EMISSION_FACTORS = {
  energy: {
    grid: 0.85, // kg CO₂ per kWh (Kenya grid average)
    diesel: 2.68 // kg CO₂ per liter
  },
  transport: {
    truck: 0.21, // kg CO₂ per km (average truck)
    van: 0.18    // kg CO₂ per km (average van)
  },
  machinery: {
    diesel: 2.68 // kg CO₂ per liter
  },
  waste: 0.5,    // kg CO₂ per kg (landfill emissions)
  water: 0.34,   // kg CO₂ per m³ (water treatment)
  material: {
    standard: 300, // kg CO₂ per ton (average concrete)
    sustainable: 150 // kg CO₂ per ton (sustainable concrete)
  }
};

export function ActivityForm({ siteId, onActivityAdded }: ActivityFormProps) {
  const [newActivity, setNewActivity] = useState<NewActivityState>({
    type: "energy",
    value: "",
    description: "",
    fuelType: "grid",
    sustainableEF: "",
    standardEF: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCalculation, setShowCalculation] = useState(false);

  // Helper functions defined before useMemo
  const getValueLabel = (): string => {
    switch (newActivity.type) {
      case "energy":
      case "renewable":
        return "Energy (kWh)";
      case "transport":
        return "Distance (km)";
      case "machinery":
        return "Fuel (Liters)";
      case "waste":
      case "recycling":
        return "Weight (kg)";
      case "water":
      case "waterReuse":
        return "Volume (m³)";
      case "material":
        return "Quantity (tons)";
      default:
        return "Value";
    }
  };

  const getUnit = (): string => {
    return getValueLabel().split('(')[1]?.replace(')', '') || 'unit';
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "energy":
        return <Zap className="w-4 h-4" />;
      case "transport":
        return <Car className="w-4 h-4" />;
      case "machinery":
        return <Fuel className="w-4 h-4" />;
      case "renewable":
        return <Leaf className="w-4 h-4" />;
      case "material":
        return <Factory className="w-4 h-4" />;
      case "recycling":
        return <Recycle className="w-4 h-4" />;
      case "water":
      case "waterReuse":
        return <Droplets className="w-4 h-4" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    const isEmission = ['energy', 'transport', 'machinery', 'waste', 'water'].includes(type);
    return isEmission ? 'text-red-600' : 'text-green-600';
  };

  // Calculate real-time emissions/savings
  const calculation = useMemo(() => {
    if (!newActivity.value || isNaN(Number(newActivity.value))) {
      return null;
    }

    const value = Number(newActivity.value);
    let emissions = 0;
    let savings = 0;
    let calculationText = "";
    let formula = "";
    const unit = getUnit();

    switch (newActivity.type) {
      case "energy":
        const energyEF = EMISSION_FACTORS.energy[newActivity.fuelType as keyof typeof EMISSION_FACTORS.energy] || 0;
        emissions = value * energyEF;
        calculationText = `Energy consumption × Emission factor`;
        formula = `${value} ${unit} × ${energyEF} kg CO₂/${unit} = ${emissions.toFixed(2)} kg CO₂`;
        break;

      case "transport":
        const transportEF = EMISSION_FACTORS.transport.truck;
        emissions = value * transportEF;
        calculationText = `Distance traveled × Transport emission factor`;
        formula = `${value} ${unit} × ${transportEF} kg CO₂/${unit} = ${emissions.toFixed(2)} kg CO₂`;
        break;

      case "machinery":
        const machineryEF = EMISSION_FACTORS.machinery.diesel;
        emissions = value * machineryEF;
        calculationText = `Fuel consumed × Diesel emission factor`;
        formula = `${value} ${unit} × ${machineryEF} kg CO₂/${unit} = ${emissions.toFixed(2)} kg CO₂`;
        break;

      case "renewable":
        const gridEF = EMISSION_FACTORS.energy.grid;
        savings = value * gridEF;
        calculationText = `Renewable energy × Grid emission factor avoided`;
        formula = `${value} ${unit} × ${gridEF} kg CO₂/${unit} = ${savings.toFixed(2)} kg CO₂ saved`;
        break;

      case "material":
        if (newActivity.standardEF && newActivity.sustainableEF) {
          const standardEF = Number(newActivity.standardEF);
          const sustainableEF = Number(newActivity.sustainableEF);
          savings = value * (standardEF - sustainableEF);
          calculationText = `Material quantity × (Standard EF - Sustainable EF)`;
          formula = `${value} ${unit} × (${standardEF} - ${sustainableEF}) kg CO₂/${unit} = ${savings.toFixed(2)} kg CO₂ saved`;
        }
        break;

      case "recycling":
        savings = value * EMISSION_FACTORS.waste;
        calculationText = `Waste recycled × Landfill emissions avoided`;
        formula = `${value} ${unit} × ${EMISSION_FACTORS.waste} kg CO₂/${unit} = ${savings.toFixed(2)} kg CO₂ saved`;
        break;

      case "waterReuse":
        savings = value * EMISSION_FACTORS.water;
        calculationText = `Water reused × Water treatment emissions avoided`;
        formula = `${value} ${unit} × ${EMISSION_FACTORS.water} kg CO₂/${unit} = ${savings.toFixed(2)} kg CO₂ saved`;
        break;

      case "waste":
        emissions = value * EMISSION_FACTORS.waste;
        calculationText = `Waste to landfill × Landfill emission factor`;
        formula = `${value} ${unit} × ${EMISSION_FACTORS.waste} kg CO₂/${unit} = ${emissions.toFixed(2)} kg CO₂`;
        break;

      case "water":
        emissions = value * EMISSION_FACTORS.water;
        calculationText = `Water consumed × Water treatment emission factor`;
        formula = `${value} ${unit} × ${EMISSION_FACTORS.water} kg CO₂/${unit} = ${emissions.toFixed(2)} kg CO₂`;
        break;
    }

    return {
      emissions,
      savings,
      calculationText,
      formula,
      isSaving: savings > 0
    };
  }, [newActivity]);

  const handleInputChange = (field: keyof NewActivityState, value: string) => {
    setNewActivity((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const baseActivity = {
      siteId,
      timestamp: new Date().toISOString(),
      description: newActivity.description || `Carbon ${['renewable', 'material', 'recycling', 'waterReuse'].includes(newActivity.type) ? 'Saving' : 'Emission'}`,
      value: Number(newActivity.value),
    };

    const activityToAdd: any = { ...baseActivity, type: newActivity.type };

    if (newActivity.type === "energy" || newActivity.type === "machinery") {
      activityToAdd.fuelType = newActivity.fuelType;
    } else if (newActivity.type === "material") {
      activityToAdd.sustainableEF = Number(newActivity.sustainableEF);
      activityToAdd.standardEF = Number(newActivity.standardEF);
    }

    try {
      const response = await fetch('/api/carbon-trends/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activityToAdd),
      });

      if (response.ok) {
        onActivityAdded();
        
        // Reset form
        setNewActivity({
          type: "energy",
          value: "",
          description: "",
          fuelType: "grid",
          sustainableEF: "",
          standardEF: "",
        });
        
        setShowCalculation(false);
      }
    } catch (error) {
      console.error('Failed to add activity:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-blue-50/30 p-6 rounded-2xl border border-blue-200/60 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            Log Carbon Activity
            <Sparkles className="w-5 h-5 text-blue-500" />
          </h2>
          <p className="text-sm text-gray-600 mt-1">Track emissions and savings with real-time calculations</p>
        </div>
        
        <button
          type="button"
          onClick={() => setShowCalculation(!showCalculation)}
          className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
        >
          <Calculator className="w-4 h-4" />
          {showCalculation ? 'Hide Math' : 'Show Math'}
        </button>
      </div>

      <form onSubmit={handleAddActivity} className="space-y-6">
        {/* Activity Type */}
        <div className="bg-white/60 rounded-xl p-4 border border-gray-200/40">
          <label className=" text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Activity Type
            <div className="tooltip" data-tip="Choose the type of carbon activity">
              <Info className="w-3 h-3 text-gray-400" />
            </div>
          </label>
          <select
            value={newActivity.type}
            onChange={(e) => handleInputChange("type", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <optgroup label="📈 Emissions Activities">
              <option value="energy">Energy Consumption</option>
              <option value="transport">Material Transport</option>
              <option value="machinery">Machinery Fuel</option>
              <option value="waste">Waste to Landfill</option>
              <option value="water">Water Consumption</option>
            </optgroup>
            <optgroup label="📉 Savings Activities">
              <option value="renewable">Renewable Energy</option>
              <option value="material">Sustainable Material</option>
              <option value="recycling">Waste Recycled</option>
              <option value="waterReuse">Water Reused</option>
            </optgroup>
          </select>
          <p className="text-xs text-gray-500 mt-2">
            {['energy', 'transport', 'machinery', 'waste', 'water'].includes(newActivity.type) 
              ? "This activity will add to your carbon emissions"
              : "This activity will reduce your carbon footprint through savings"
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Value Input */}
          <div className="bg-white/60 rounded-xl p-4 border border-gray-200/40">
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              {getValueLabel()}
            </label>
            <input
              type="number"
              step="any"
              value={newActivity.value}
              onChange={(e) => handleInputChange("value", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isSubmitting}
              placeholder="Enter amount..."
            />
            <p className="text-xs text-gray-500 mt-2">
              Enter the quantity for this activity
            </p>
          </div>

          {/* Conditional Fields */}
          {(newActivity.type === "energy" || newActivity.type === "machinery") && (
            <div className="bg-white/60 rounded-xl p-4 border border-gray-200/40">
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Fuel / Energy Source
              </label>
              <select
                value={newActivity.fuelType}
                onChange={(e) => handleInputChange("fuelType", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isSubmitting}
              >
                <option value="grid">⚡ Grid Electricity</option>
                <option value="diesel">⛽ Diesel Fuel</option>
              </select>
              <p className="text-xs text-gray-500 mt-2">
                Different sources have different emission factors
              </p>
            </div>
          )}

          {newActivity.type === "material" && (
            <>
              <div className="bg-white/60 rounded-xl p-4 border border-gray-200/40">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Standard Material EF (kg CO₂/ton)
                </label>
                <input
                  type="number"
                  step="any"
                  value={newActivity.standardEF}
                  onChange={(e) => handleInputChange("standardEF", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={isSubmitting}
                  placeholder="e.g., 300 for concrete"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Emission factor for conventional material
                </p>
              </div>
              <div className="bg-white/60 rounded-xl p-4 border border-gray-200/40">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Sustainable Material EF (kg CO₂/ton)
                </label>
                <input
                  type="number"
                  step="any"
                  value={newActivity.sustainableEF}
                  onChange={(e) => handleInputChange("sustainableEF", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={isSubmitting}
                  placeholder="e.g., 150 for sustainable concrete"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Emission factor for sustainable alternative
                </p>
              </div>
            </>
          )}
        </div>

        {/* Description */}
        <div className="bg-white/60 rounded-xl p-4 border border-gray-200/40">
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            Description (Optional)
          </label>
          <input
            type="text"
            value={newActivity.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="e.g., Concrete delivery, Solar panel output, Equipment fuel consumption..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting}
          />
          <p className="text-xs text-gray-500 mt-2">
            Add context to help identify this activity later
          </p>
        </div>

        {/* Real-time Calculation Display */}
        {calculation && newActivity.value && (
          <div className={`bg-gradient-to-r ${
            calculation.isSaving 
              ? 'from-green-50 to-emerald-50 border-green-200' 
              : 'from-blue-50 to-cyan-50 border-blue-200'
          } rounded-xl p-4 border`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-800">Real-time Calculation</h3>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                calculation.isSaving 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {calculation.isSaving ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                <span className="font-semibold">
                  {calculation.isSaving 
                    ? `Saving ${calculation.savings.toFixed(2)} kg CO₂`
                    : `Emitting ${calculation.emissions.toFixed(2)} kg CO₂`
                  }
                </span>
              </div>
            </div>

            {showCalculation && (
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">{calculation.calculationText}</p>
                <div className="bg-white rounded-lg p-3 border font-mono">
                  {calculation.formula}
                </div>
                <p className="text-xs text-gray-500">
                  Based on standard emission factors from Kenya Power and UNFCCC data
                </p>
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-500" />
            All calculations follow UNFCCC standards
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting || !newActivity.value}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Adding Activity...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Add Carbon Activity
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}