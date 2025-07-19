'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Download, BarChart, PieChart, LineChart, FileText,
  File, FileSpreadsheet, ChevronDown, Leaf, Trophy,
  Zap, Check, Loader2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { getMonthlyReports, generateReport } from '@/actions/report';

interface ReportData {
  month: string;
  energy: number;
  co2: number;
  waste: number;
  energyReduction: number;
  co2Reduction: number;
}

interface ReportBlob {
  data: string;
  type: string;
  extension: string;
}

export default function ReportsPage() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'csv' | 'excel'>('pdf');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [latestReport, setLatestReport] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setIsLoading(true);
        const data = await getMonthlyReports();
        if (!data || data.length === 0) {
          throw new Error('No report data available');
        }
        setReportData(data);
        setLatestReport(data[0]);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Unknown error occurred.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchReportData();
  }, []);

  const achievements = latestReport ? [
    {
      title: "Energy Reduction",
      value: `${latestReport.energyReduction}%`,
      description: "Compared to last year",
    },
    {
      title: "CO2 Savings",
      value: `${latestReport.co2} kg`,
      description: `Equivalent to ${Math.round(latestReport.co2 / 24)} tree seedlings`,
    },
    {
      title: "Waste Diverted",
      value: `${latestReport.waste} kg`,
      description: "From landfills",
    },
  ] : [];

  const co2Progress = latestReport
    ? Math.round((latestReport.co2Reduction / 40) * 100)
    : 70;

  const chartData = reportData.map(report => ({
    month: report.month,
    energy: report.energy,
    co2: report.co2,
    waste: report.waste,
  })).reverse();

  const formatOptions = [
    { id: 'pdf', name: 'PDF Report', icon: <FileText size={18} /> },
    { id: 'csv', name: 'CSV Data', icon: <FileSpreadsheet size={18} /> },
    { id: 'excel', name: 'Excel File', icon: <File size={18} /> },
  ];

  const handleDownload = async () => {
    if (!latestReport) return;

    setIsDownloading(true);
    setError(null);

    try {
      const result: ReportBlob = await generateReport(selectedFormat, latestReport);

      const blob = selectedFormat === 'csv'
        ? new Blob([result.data], { type: result.type })
        : new Blob(
            [Uint8Array.from(atob(result.data), c => c.charCodeAt(0))],
            { type: result.type }
          );

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `impact-report-${latestReport.month}.${result.extension}`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      setDownloadComplete(true);
      setTimeout(() => setDownloadComplete(false), 3000);
    } catch (err) {
      setError('Failed to generate report. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-b from-indigo-50 to-white">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mx-auto mb-4"
          >
            <Loader2 className="text-indigo-600 h-12 w-12" />
          </motion.div>
          <h2 className="text-xl font-bold text-indigo-800">Loading your impact data...</h2>
          <p className="text-indigo-600 mt-2">We're crunching the numbers</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-b from-indigo-50 to-white">
        <div className="bg-white p-6 rounded-xl shadow-md text-center max-w-md">
          <div className="text-red-500 mb-4">
            <Zap size={48} className="mx-auto" />
          </div>
          <h2 className="text-xl font-bold text-indigo-800 mb-2">Error Loading Reports</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-800 flex items-center gap-3">
            <BarChart className="text-indigo-600" size={32} />
            Impact Reports
            <span className="block text-lg font-normal text-indigo-600 mt-1">
              Track and analyze your environmental impact
            </span>
          </h1>
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
            <Trophy size={20} />
            <span className="font-bold">Top 15% Eco Score</span>
          </div>
        </div>

        {/* Report Download Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-indigo-100">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-indigo-800">Monthly Impact Report</h2>
              <span className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded-md text-sm">
                {latestReport?.month} {new Date().getFullYear()}
              </span>
            </div>

            <p className="text-indigo-700 mb-6">
              Your facility used {latestReport?.energy} kWh of energy this month,
              with a {latestReport?.energyReduction}% reduction from last year.
            </p>

            {/* Format Selection */}
            <h3 className="text-indigo-700 mb-3 font-medium">Select Format</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {formatOptions.map((format) => (
                <button
                  key={format.id}
                  className={`px-4 py-3 rounded-xl flex items-center gap-2 transition-all ${
                    selectedFormat === format.id
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                      : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                  }`}
                  onClick={() => setSelectedFormat(format.id as any)}
                >
                  {format.icon}
                  {format.name}
                </button>
              ))}
            </div>

            {/* Download Button */}
            <button
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg ${
                isDownloading || downloadComplete
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600'
              } text-white`}
              onClick={handleDownload}
              disabled={isDownloading || downloadComplete || !latestReport}
            >
              {isDownloading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Download size={20} />
                  </motion.div>
                  Preparing Report...
                </>
              ) : downloadComplete ? (
                <>
                  <Check size={20} />
                  Download Complete!
                </>
              ) : (
                <>
                  <Download size={20} />
                  Download Report
                </>
              )}
            </button>

            {/* Expand Preview */}
            <div 
              className="mt-8 pt-6 border-t border-indigo-100 cursor-pointer"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-indigo-800">Preview Upcoming Visual Features</h3>
                <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                  <ChevronDown className="text-indigo-600" />
                </motion.div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mt-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      {[PieChart, BarChart, LineChart, Leaf].map((Icon, i) => (
                        <div key={i} className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl p-4 h-32 flex flex-col items-center justify-center">
                          <Icon className="text-indigo-600 mb-2" />
                          <span className="text-indigo-700 font-medium">Coming Soon</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Achievements + CO2 */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
            <h2 className="text-xl font-bold mb-2">{latestReport?.month} Highlights</h2>
            <p className="opacity-90 mb-6">Your environmental impact at a glance</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {achievements.map((a, i) => (
                <div key={i} className="bg-indigo-400/20 p-4 rounded-xl border border-indigo-300/30">
                  <h3 className="text-lg font-bold">{a.value}</h3>
                  <p className="text-sm">{a.title}</p>
                  <p className="text-xs opacity-75 mt-1">{a.description}</p>
                </div>
              ))}
            </div>

            <div className="bg-indigo-400/20 rounded-xl p-4">
              <h3 className="font-bold mb-3">CO2 Reduction Progress</h3>
              <div className="flex items-center justify-between">
                <div 
                  className="w-24 h-24 rounded-full border-4 border-indigo-300 border-t-cyan-400 border-r-cyan-400 flex items-center justify-center"
                  style={{
                    background: `conic-gradient(#67e8f9 ${co2Progress}%, transparent ${co2Progress}% 100%)`
                  }}
                >
                  <span className="text-xl font-bold">{latestReport?.co2Reduction}%</span>
                </div>
                <div>
                  <p className="text-sm mb-1"><span className="w-3 h-3 bg-cyan-400 inline-block rounded-full mr-2" />Current</p>
                  <p className="text-sm"><span className="w-3 h-3 bg-indigo-300 inline-block rounded-full mr-2" />Target: 40%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
