import PDFDocument from "pdfkit";
import { Report } from "../models/Report.js";
import { Project } from "../models/Project.js";
import { Calculation } from "../models/calculation.js";

/* ------------------- Generate Report ------------------- */
export const generateReport = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: "Project not found" });

    const calculation = await Calculation.findOne({ projectId });
    if (!calculation) return res.status(404).json({ error: "Calculation not found" });

    // create PDF stream
    const doc = new PDFDocument({ margin: 50 });
    let buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", async () => {
      const pdfData = Buffer.concat(buffers);

      // Save in DB
      const newReport = await Report.create({
        projectId,
        userId: req.user?.id || null,
        pdfBuffer: pdfData,
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="rainwater-report-${projectId.slice(-6)}.pdf"`);
      res.send(pdfData);
    });

    // Helper function to add section headers
    const addSectionHeader = (title) => {
      doc.fontSize(16).fillColor('#2563eb').text(title, { underline: true });
      doc.moveDown(0.5);
      doc.fillColor('#000000');
    };

    // Helper function to add key-value pairs
    const addKeyValue = (key, value, unit = '') => {
      doc.fontSize(11).text(`${key}: `, { continued: true, width: 200 });
      doc.font('Helvetica-Bold').text(`${value}${unit}`);
      doc.font('Helvetica');
      doc.moveDown(0.3);
    };

    // PDF Header
    doc.fontSize(24).fillColor('#1e40af').text("🌧️ Rainwater Harvesting Analysis Report", { align: "center" });
    doc.fontSize(12).fillColor('#6b7280').text(`Generated on ${new Date().toLocaleDateString()}`, { align: "center" });
    doc.fillColor('#000000');
    doc.moveDown(2);

    // Project Information Section
    addSectionHeader("PROJECT INFORMATION");
    addKeyValue("Project Name", project.name);
    addKeyValue("Location", project.location);
    addKeyValue("Residence Type", project.residenceType);
    addKeyValue("Number of Dwellers", project.numberOfDwellers);
    if (project.numberOfFlats) {
      addKeyValue("Number of Flats", project.numberOfFlats);
    }
    addKeyValue("Open Space Area", project.openSpaceArea, " sq.m");
    addKeyValue("Roof Type", project.roofType);
    addKeyValue("Roof Area", project.roofArea, " sq.m");
    addKeyValue("Report ID", `RH-${projectId.slice(-6)}`);
    doc.moveDown(1);

    // Monthly Data Section
    addSectionHeader("MONTHLY ANALYSIS");
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    
    // Table headers
    doc.fontSize(10).font('Helvetica-Bold');
    const startX = 50;
    const colWidth = 40;
    let currentY = doc.y;
    
    doc.text("Month", startX, currentY, { width: colWidth });
    doc.text("Rainfall", startX + colWidth, currentY, { width: colWidth });
    doc.text("Harvest", startX + colWidth * 2, currentY, { width: colWidth });
    doc.text("Consumption", startX + colWidth * 3, currentY, { width: colWidth });
    doc.text("Surplus", startX + colWidth * 4, currentY, { width: colWidth });
    
    doc.text("(mm)", startX + colWidth, doc.y, { width: colWidth });
    doc.text("(L)", startX + colWidth * 2, doc.y, { width: colWidth });
    doc.text("(L)", startX + colWidth * 3, doc.y, { width: colWidth });
    doc.text("(L)", startX + colWidth * 4, doc.y, { width: colWidth });
    
    currentY = doc.y + 10;
    
    // Draw line under headers
    doc.moveTo(startX, currentY).lineTo(startX + colWidth * 5, currentY).stroke();
    currentY += 10;
    
    // Table data
    doc.font('Helvetica').fontSize(9);
    const rainfallMap = calculation.monthlyRainfall instanceof Map ? Object.fromEntries(calculation.monthlyRainfall) : calculation.monthlyRainfall;
    const harvestMap = calculation.monthlyHarvest instanceof Map ? Object.fromEntries(calculation.monthlyHarvest) : calculation.monthlyHarvest;
    const consumptionMap = calculation.monthlyConsumption instanceof Map ? Object.fromEntries(calculation.monthlyConsumption) : calculation.monthlyConsumption;
    const surplusMap = calculation.monthlySurplus instanceof Map ? Object.fromEntries(calculation.monthlySurplus) : calculation.monthlySurplus;
    
    months.forEach(month => {
      doc.text(month, startX, currentY, { width: colWidth });
      doc.text((rainfallMap[month] || 0).toFixed(1), startX + colWidth, currentY, { width: colWidth });
      doc.text(Math.round(harvestMap[month] || 0).toLocaleString(), startX + colWidth * 2, currentY, { width: colWidth });
      doc.text(Math.round(consumptionMap[month] || 0).toLocaleString(), startX + colWidth * 3, currentY, { width: colWidth });
      doc.text(Math.round(surplusMap[month] || 0).toLocaleString(), startX + colWidth * 4, currentY, { width: colWidth });
      currentY += 15;
    });
    
    doc.y = currentY + 20;

    // Annual Summary Section
    addSectionHeader("ANNUAL SUMMARY");
    addKeyValue("Total Annual Rainfall Harvested", Math.round(calculation.annualHarvest).toLocaleString(), " L");
    addKeyValue("Total Annual Water Consumption", Math.round(calculation.annualConsumption).toLocaleString(), " L");
    addKeyValue("Total Annual Surplus for Recharge", Math.round(calculation.annualSurplus).toLocaleString(), " L");
    addKeyValue("Water Sustainability", ((calculation.annualHarvest / calculation.annualConsumption) * 10).toFixed(1), " months/year");
    addKeyValue("Per Person Water Potential", Math.round(calculation.annualHarvest / project.numberOfDwellers).toLocaleString(), " L/year");
    addKeyValue("Runoff Coefficient", (calculation.runoffCoeff * 100).toFixed(1), "%");
    doc.moveDown(1);

    // System Recommendations Section
    addSectionHeader("SYSTEM RECOMMENDATIONS");
    addKeyValue("Recommended Structure Type", calculation.structureType);
    addKeyValue("Estimated Structure Cost", `₹${calculation.structureCost.toLocaleString()}`);
    addKeyValue("Recharge Frequency", calculation.rechargeFrequency, " times/year");
    
    // Cost breakdown
    const tankCost = Math.round(calculation.structureCost * 0.6);
    const filtrationCost = Math.round(calculation.structureCost * 0.2);
    const pipingCost = Math.round(calculation.structureCost * 0.2);
    const paybackPeriod = (calculation.structureCost / (calculation.annualHarvest * 0.05)).toFixed(1);
    
    doc.moveDown(0.5);
    doc.fontSize(12).text("Cost Breakdown:", { underline: true });
    doc.moveDown(0.3);
    addKeyValue("  Tank & Installation", `₹${tankCost.toLocaleString()}`);
    addKeyValue("  Filtration System", `₹${filtrationCost.toLocaleString()}`);
    addKeyValue("  Piping & Labor", `₹${pipingCost.toLocaleString()}`);
    addKeyValue("  Estimated Payback Period", paybackPeriod, " years");
    doc.moveDown(1);

    // Environmental Impact Section
    addSectionHeader("ENVIRONMENTAL IMPACT");
    const waterSaved = Math.round(calculation.annualHarvest);
    const co2Saved = Math.round(waterSaved * 0.0003); // Rough estimate: 0.3g CO2 per liter
    addKeyValue("Annual Water Savings", waterSaved.toLocaleString(), " L");
    addKeyValue("Estimated CO2 Reduction", co2Saved, " kg/year");
    addKeyValue("Groundwater Recharge Potential", Math.round(calculation.annualSurplus).toLocaleString(), " L/year");
    doc.moveDown(1);

    // Footer
    doc.fontSize(10).fillColor('#6b7280');
    doc.text("This report is generated based on your inputs and estimated calculations.", { align: "center" });
    doc.text("© 2023 RainWorth - Rainwater Harvesting Analysis Tool", { align: "center" });
    
    doc.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ------------------- Get Reports ------------------- */
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user?.id }).sort({ createdAt: -1 });
    res.json(reports.map(r => ({ id: r._id, projectId: r.projectId, createdAt: r.createdAt })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ------------------- Download Report ------------------- */
export const downloadReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: "Report not found" });

    res.setHeader("Content-Type", "application/pdf");
    res.send(report.pdfBuffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};