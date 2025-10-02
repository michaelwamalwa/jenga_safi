"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Building, 
  Target, 
  Award,
  X,
  Save,
  BarChart3,
  Leaf,
  Zap,
  Recycle
} from "lucide-react";

interface ProfileFormProps {
  initialData?: any;
  onSave: (updated: any) => void;
  onCancel: () => void;
}

export default function ProfileForm({
  initialData,
  onSave,
  onCancel,
}: ProfileFormProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    sustainabilityGoals: "",
    reductionTarget: 25,
    focusAreas: [] as string[]
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const focusAreas = [
    { id: "energy", label: "Energy Efficiency", icon: Zap },
    { id: "materials", label: "Sustainable Materials", icon: Leaf },
    { id: "waste", label: "Waste Management", icon: Recycle },
    { id: "water", label: "Water Conservation", icon: "💧" },
    { id: "transport", label: "Transport & Logistics", icon: "🚚" },
    { id: "biodiversity", label: "Biodiversity", icon: "🌿" }
  ];

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        email: initialData.email || "",
        company: initialData.company || "",
        role: initialData.role || "",
        sustainabilityGoals: initialData.sustainabilityGoals || "",
        reductionTarget: initialData.reductionTarget || 25,
        focusAreas: initialData.focusAreas || []
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === "reductionTarget" ? Number(value) : value,
    }));
  };

  const toggleFocusArea = (areaId: string) => {
    setForm(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(areaId)
        ? prev.focusAreas.filter(id => id !== areaId)
        : [...prev.focusAreas, areaId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save profile");
      }

      const updated = await res.json();
      onSave(updated);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <User className="w-6 h-6" />
              Edit Profile
            </h2>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Your company name"
                />
              </div>

              <div>
                <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Role
                </label>
                <input
                  type="text"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="e.g., Project Manager"
                />
              </div>
            </div>

            {/* Carbon Reduction Target */}
            <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
              <label className=" text-sm font-medium text-orange-800 mb-3 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Carbon Reduction Target
              </label>
              <div className="flex items-center gap-4 mb-2">
                <input
                  type="range"
                  name="reductionTarget"
                  min="10"
                  max="50"
                  step="5"
                  value={form.reductionTarget}
                  onChange={handleChange}
                  className="flex-1"
                />
                <span className="text-2xl font-bold text-orange-600 min-w-16">
                  {form.reductionTarget}%
                </span>
              </div>
              <p className="text-xs text-orange-600">
                Target carbon emissions reduction compared to baseline
              </p>
            </div>

            {/* Focus Areas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Focus Areas (Select up to 3)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {focusAreas.map((area) => {
                  const isSelected = form.focusAreas.includes(area.id);

                  return (
                    <button
                      key={area.id}
                      type="button"
                      onClick={() => toggleFocusArea(area.id)}
                      disabled={!isSelected && form.focusAreas.length >= 3}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      } ${!isSelected && form.focusAreas.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {typeof area.icon === "string" ? (
                          <span className="text-lg">{area.icon}</span>
                        ) : (
                          <area.icon className="w-4 h-4" />
                        )}
                        <span className="text-sm font-medium">{area.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sustainability Goals */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sustainability Goals & Objectives
              </label>
              <textarea
                name="sustainabilityGoals"
                value={form.sustainabilityGoals}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Describe your key sustainability objectives, certifications you're targeting (LEED, BREEAM, etc.), and any specific environmental commitments..."
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
          </form>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}