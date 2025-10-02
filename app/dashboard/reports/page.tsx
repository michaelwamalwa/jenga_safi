// app/generate-report/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  CheckCircle2, 
  Loader2, 
  AlertTriangle, 
  Download,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Building,
  Leaf,
  Zap,
  Recycle,
  Eye
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface ReportFormData {
  siteId: string;
  reportPeriod: string;
  startDate: string;
  endDate: string;
  reportType: "comprehensive" | "executive" | "compliance" | "sustainability";
  includeCharts: boolean;
  includeForecast: boolean;
  compareToPrevious: boolean;
}

interface Site {
  _id: string;
  name: string;
  location: string;
}

interface CarbonData {
  totalEmissions: number;
  totalSavings: number;
  netEmissions: number;
  activities: any[];
  trend: any[];
}

export default function GenerateReportPage() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [formData, setFormData] = useState<ReportFormData>({
    siteId: "",
    reportPeriod: "last-30-days",
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    reportType: "comprehensive",
    includeCharts: true,
    includeForecast: true,
    compareToPrevious: true,
  });

  const [sites, setSites] = useState<Site[]>([]);
  const [carbonData, setCarbonData] = useState<CarbonData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportPreview, setReportPreview] = useState<any>(null);

  // Fetch user's sites on component mount
  useEffect(() => {
    fetchSites();
  }, []);

  // Fetch carbon data when site or date range changes
  useEffect(() => {
    if (formData.siteId) {
      fetchCarbonData();
    }
  }, [formData.siteId, formData.startDate, formData.endDate]);

  const fetchSites = async () => {
    try {
      const response = await fetch('/api/sites');
      const data = await response.json();
  
      // since API returns array directly
      setSites(data || []);
  
      if (data?.length > 0) {
        setFormData(prev => ({ ...prev, siteId: data[0]._id }));
      }
    } catch (error) {
      console.error("Error fetching sites:", error);
      setError("Failed to load your sites");
    } finally {
      setIsLoading(false);
    }
  };
  

  const fetchCarbonData = async () => {
    try {
      const response = await fetch(
        `/api/carbon-trends?siteId=${formData.siteId}&startDate=${formData.startDate}&endDate=${formData.endDate}`
      );
      const data = await response.json();
      setCarbonData(data);
      generatePreview(data);
    } catch (error) {
      console.error("Error fetching carbon data:", error);
    }
  };

  const generatePreview = (data: CarbonData) => {
    if (!data) return;

    const totalActivities = data.activities?.length || 0;
    const emissionsActivities = data.activities?.filter(a => 
      ['energy', 'transport', 'machinery', 'waste', 'water'].includes(a.type)
    ).length || 0;
    const savingsActivities = data.activities?.filter(a => 
      ['renewable', 'material', 'recycling', 'waterReuse'].includes(a.type)
    ).length || 0;

    setReportPreview({
      totalEmissions: data.totalEmissions,
      totalSavings: data.totalSavings,
      netEmissions: data.netEmissions,
      totalActivities,
      emissionsActivities,
      savingsActivities,
      efficiency: data.totalSavings > 0 ? (data.totalSavings / (data.totalEmissions + data.totalSavings)) * 100 : 0,
      period: formData.reportPeriod,
      site: sites.find(s => s._id === formData.siteId)?.name || 'Unknown Site'
    });
  };

  const handleChange = (field: keyof ReportFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePeriodChange = (period: string) => {
    const today = new Date();
    let startDate = new Date();

    switch (period) {
      case "last-7-days":
        startDate.setDate(today.getDate() - 7);
        break;
      case "last-30-days":
        startDate.setDate(today.getDate() - 30);
        break;
      case "last-90-days":
        startDate.setDate(today.getDate() - 90);
        break;
      case "last-year":
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      default:
        startDate = today;
    }

    setFormData(prev => ({
      ...prev,
      reportPeriod: period,
      startDate: startDate.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          carbonData,
          generatedBy: session?.user?.email,
          generatedAt: new Date().toISOString()
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `carbon-report-${formData.siteId}-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
      } else {
        throw new Error('Failed to generate report');
      }
    } catch (err) {
      setError("Failed to generate report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getReportTypeDescription = (type: string) => {
    switch (type) {
      case "comprehensive":
        return "Detailed analysis with all metrics, charts, and recommendations";
      case "executive":
        return "High-level summary for management and stakeholders";
      case "compliance":
        return "Formatted for regulatory compliance and auditing";
      case "sustainability":
        return "Focus on environmental impact and sustainability goals";
      default:
        return "";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your sites and data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="p-3 bg-white rounded-2xl shadow-lg border border-blue-200">
              <FileText className="text-blue-600" size={32} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                Carbon Footprint Reports
              </h1>
              <p className="text-gray-600 mt-2">
                Generate comprehensive environmental impact reports for your construction sites
              </p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Report Configuration */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-blue-200/50 p-6"
            >
              {/* Error / Success */}
              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl flex items-center gap-2 mb-6 border border-red-200">
                  <AlertTriangle size={18} />
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div className="bg-emerald-50 text-emerald-600 px-4 py-3 rounded-xl flex items-center gap-2 mb-6 border border-emerald-200">
                  <CheckCircle2 size={18} />
                  <span>Report generated and downloaded successfully!</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Site Selection */}
                <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-200">
                  <label className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Building className="w-4 h-4 text-blue-600" />
                    Construction Site
                  </label>
                  <select
                    value={formData.siteId}
                    onChange={(e) => handleChange('siteId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a site</option>
                    {sites.map((site) => (
                      <option key={site._id} value={site._id}>
                        {site.name} - {site.location}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Report Period */}
                <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-200">
                  <label className=" text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    Report Period
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                    {[
                      { value: "last-7-days", label: "Last 7 Days" },
                      { value: "last-30-days", label: "Last 30 Days" },
                      { value: "last-90-days", label: "Last 90 Days" },
                      { value: "last-year", label: "Last Year" },
                    ].map((period) => (
                      <button
                        key={period.value}
                        type="button"
                        onClick={() => handlePeriodChange(period.value)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          formData.reportPeriod === period.value
                            ? 'bg-blue-500 text-white shadow-sm'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {period.label}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleChange('startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">End Date</label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleChange('endDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Report Type */}
                <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-200">
                  <label className=" text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    Report Type
                  </label>
                  <select
                    value={formData.reportType}
                    onChange={(e) => handleChange('reportType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                  >
                    <option value="comprehensive">Comprehensive Report</option>
                    <option value="executive">Executive Summary</option>
                    <option value="compliance">Compliance Report</option>
                    <option value="sustainability">Sustainability Report</option>
                  </select>
                  <p className="text-xs text-gray-600">
                    {getReportTypeDescription(formData.reportType)}
                  </p>
                </div>

                {/* Report Options */}
                <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-200">
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Report Options
                  </label>
                  <div className="space-y-3">
                    {[
                      { id: 'includeCharts', label: 'Include Charts & Visualizations', icon: BarChart3 },
                      { id: 'includeForecast', label: 'Include AI Forecast & Trends', icon: TrendingUp },
                      { id: 'compareToPrevious', label: 'Compare to Previous Period', icon: TrendingDown },
                    ].map((option) => (
                      <label key={option.id} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData[option.id as keyof ReportFormData] as boolean}
                          onChange={(e) => handleChange(option.id as keyof ReportFormData, e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <option.icon className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.siteId}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader2 size={20} />
                      </motion.div>
                      Generating Report...
                    </>
                  ) : (
                    <>
                      <Download size={20} />
                      Generate & Download Report
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>

          {/* Report Preview */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-blue-200/50 p-6 sticky top-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-800">Report Preview</h3>
              </div>

              {reportPreview ? (
                <div className="space-y-4">
                  {/* Site Info */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-600">Site</div>
                    <div className="font-semibold text-gray-800">{reportPreview.site}</div>
                    <div className="text-xs text-gray-500 capitalize">{reportPreview.period.replace(/-/g, ' ')}</div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                      <div className="text-xs text-red-600 font-medium">Emissions</div>
                      <div className="text-lg font-bold text-red-700">{reportPreview.totalEmissions.toFixed(0)}</div>
                      <div className="text-xs text-red-600">kg CO₂</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                      <div className="text-xs text-green-600 font-medium">Savings</div>
                      <div className="text-lg font-bold text-green-700">{reportPreview.totalSavings.toFixed(0)}</div>
                      <div className="text-xs text-green-600">kg CO₂</div>
                    </div>
                  </div>

                  {/* Net Emissions */}
                  <div className={`rounded-lg p-3 border ${
                    reportPreview.netEmissions < 0 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-yellow-50 border-yellow-200'
                  }`}>
                    <div className="text-xs font-medium mb-1">
                      {reportPreview.netEmissions < 0 ? 'Net Carbon Savings' : 'Net Emissions'}
                    </div>
                    <div className={`text-xl font-bold ${
                      reportPreview.netEmissions < 0 ? 'text-green-700' : 'text-yellow-700'
                    }`}>
                      {Math.abs(reportPreview.netEmissions).toFixed(0)} kg CO₂
                      {reportPreview.netEmissions < 0 && (
                        <Leaf className="w-4 h-4 inline ml-1" />
                      )}
                    </div>
                  </div>

                  {/* Activity Summary */}
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <div className="text-xs text-blue-600 font-medium mb-2">Activity Summary</div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Activities</span>
                        <span className="font-semibold">{reportPreview.totalActivities}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-red-600">Emissions Activities</span>
                        <span className="font-semibold">{reportPreview.emissionsActivities}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600">Savings Activities</span>
                        <span className="font-semibold">{reportPreview.savingsActivities}</span>
                      </div>
                    </div>
                  </div>

                  {/* Efficiency Score */}
                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                    <div className="text-xs text-purple-600 font-medium mb-1">Efficiency Score</div>
                    <div className="text-xl font-bold text-purple-700">
                      {reportPreview.efficiency.toFixed(1)}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(reportPreview.efficiency, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Select a site to preview report data</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Recent Reports Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-white rounded-2xl shadow-xl border border-blue-200/50 p-6"
        >
          <h3 className="font-semibold text-gray-800 mb-4">Recent Reports</h3>
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Your generated reports will appear here</p>
            <p className="text-sm text-gray-400 mt-1">Generate your first report to get started</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}