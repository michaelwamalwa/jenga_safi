'use server';

import { connectDB } from '@/lib/db';
import { Report } from '@/app/models/report';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as XLSX from 'xlsx';

// Fetch reports
export const getMonthlyReports = async () => {
  try {
    await connectDB();
    const data = await Report.find().sort({ createdAt: -1 }).limit(6);
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error('Error fetching reports:', error);
    return [];
  }
};

// Generate PDF Report
const generatePDF = async (data: any) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const { width, height } = page.getSize();
  
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  page.drawText('Environmental Impact Report', {
    x: 50,
    y: height - 50,
    size: 20,
    font,
    color: rgb(0, 0, 0),
  });
  
  page.drawText(`Month: ${data.month}`, {
    x: 50,
    y: height - 100,
    size: 14,
    font,
    color: rgb(0, 0, 0),
  });
  
  // Add metrics
  let yPosition = height - 150;
  [
    `Energy Consumption: ${data.energy} kWh (${data.energyReduction}% reduction)`,
    `CO2 Emissions: ${data.co2} kg (${data.co2Reduction}% reduction)`,
    `Waste Generated: ${data.waste} kg`,
    `Water Usage: ${data.waterUsage || 0} liters`,
    `Recycling Rate: ${data.recyclingRate || 0}%`,
    `Eco Score: ${data.ecoScore || 0}/100`
  ].forEach(text => {
    page.drawText(text, { x: 50, y: yPosition, size: 12, font });
    yPosition -= 30;
  });

  return await pdfDoc.save();
};

// Generate CSV
const generateCSV = (data:any) => {
  let csv = 'Metric,Value,Unit\n';
  csv += `Energy Consumption,${data.energy},kWh\n`;
  csv += `Energy Reduction,${data.energyReduction},%\n`;
  csv += `CO2 Emissions,${data.co2},kg\n`;
  csv += `CO2 Reduction,${data.co2Reduction},%\n`;
  csv += `Waste Generated,${data.waste},kg\n`;
  csv += `Water Usage,${data.waterUsage || 0},liters\n`;
  csv += `Recycling Rate,${data.recyclingRate || 0},%\n`;
  csv += `Eco Score,${data.ecoScore || 0},/100\n`;
  return csv;
};

// Generate Excel
const generateExcel = (data:any) => {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet([
    { Metric: 'Energy Consumption', Value: data.energy, Unit: 'kWh' },
    { Metric: 'Energy Reduction', Value: data.energyReduction, Unit: '%' },
    { Metric: 'CO2 Emissions', Value: data.co2, Unit: 'kg' },
    { Metric: 'CO2 Reduction', Value: data.co2Reduction, Unit: '%' },
    { Metric: 'Waste Generated', Value: data.waste, Unit: 'kg' },
    { Metric: 'Water Usage', Value: data.waterUsage || 0, Unit: 'liters' },
    { Metric: 'Recycling Rate', Value: data.recyclingRate || 0, Unit: '%' },
    { Metric: 'Eco Score', Value: data.ecoScore || 0, Unit: '/100' },
  ]);
  
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Impact Report');
  return XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
};

// Generate Report Action
export const generateReport = async (format:any, reportData: any) => {
  try {
    switch (format) {
      case 'pdf':
        const pdfBytes = await generatePDF(reportData);
        return { 
          data: Buffer.from(pdfBytes).toString('base64'), 
          type: 'application/pdf',
          extension: 'pdf'
        };
      case 'csv':
        const csvData = generateCSV(reportData);
        return { 
          data: csvData, 
          type: 'text/csv',
          extension: 'csv'
        };
      case 'excel':
        const excelData = generateExcel(reportData);
        return { 
          data: Buffer.from(excelData).toString('base64'), 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          extension: 'xlsx'
        };
      default:
        throw new Error('Invalid format');
    }
  } catch (error) {
    console.error('Report generation error:', error);
    throw error;
  }
};