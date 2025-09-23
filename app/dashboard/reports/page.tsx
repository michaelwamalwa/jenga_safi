// app/generate-report/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, CheckCircle2, Loader2, AlertTriangle } from "lucide-react";
import { generateReport } from "@/actions/report";

interface ReportFormData {
  month: string;
  energy: number;
  co2: number;
  waste: number;
}

export default function GenerateReportPage() {
  const [formData, setFormData] = useState<ReportFormData>({
    month: "",
    energy: 0,
    co2: 0,
    waste: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "month" ? value : Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Call server action — you can extend it to save to DB
      await generateReport("pdf", formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError("Failed to generate report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-10 bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-indigo-100 p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <FileText className="text-indigo-600" size={32} />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-indigo-800">
              Generate New Report
            </h1>
            <p className="text-indigo-600 text-sm">
              Enter your monthly environmental impact data
            </p>
          </div>
        </div>

        {/* Error / Success */}
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-md flex items-center gap-2 mb-6">
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-emerald-50 text-emerald-600 px-4 py-3 rounded-md flex items-center gap-2 mb-6">
            <CheckCircle2 size={18} />
            <span>Report generated successfully!</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Month */}
          <div>
            <label className="block text-sm font-medium text-indigo-800 mb-1">
              Report Month
            </label>
            <input
              type="text"
              name="month"
              value={formData.month}
              onChange={handleChange}
              placeholder="e.g., January"
              className="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
              required
            />
          </div>

          {/* Energy */}
          <div>
            <label className="block text-sm font-medium text-indigo-800 mb-1">
              Energy Usage (kWh)
            </label>
            <input
              type="number"
              name="energy"
              value={formData.energy}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
              required
            />
          </div>

          {/* CO2 */}
          <div>
            <label className="block text-sm font-medium text-indigo-800 mb-1">
              CO₂ Emissions (kg)
            </label>
            <input
              type="number"
              name="co2"
              value={formData.co2}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
              required
            />
          </div>

          {/* Waste */}
          <div>
            <label className="block text-sm font-medium text-indigo-800 mb-1">
              Waste Generated (kg)
            </label>
            <input
              type="number"
              name="waste"
              value={formData.waste}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg text-white transition-all ${
              isSubmitting
                ? "bg-gradient-to-r from-indigo-400 to-purple-400"
                : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            }`}
          >
            {isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 size={20} />
                </motion.div>
                Generating...
              </>
            ) : (
              "Generate Report"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
