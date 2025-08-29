import PDFDocument from "pdfkit";
import { Report } from "../models/Report.js";
import { Project } from "../models/Project.js";

/* ------------------- Generate Report ------------------- */
export const generateReport = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: "Project not found" });

    // create PDF stream
    const doc = new PDFDocument();
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
      res.send(pdfData);
    });

    // PDF Content
    doc.fontSize(20).text("RainWorth Project Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Project ID: ${project._id}`);
    doc.text(`Suggested Structure: ${project.suggestedStructure}`);
    doc.text(`Harvest (Yearly): ${project.harvestLitresYear} L`);
    doc.text(`Cost Estimate: ₹${project.costEstimateInr.min} - ₹${project.costEstimateInr.max}`);
    doc.text(`Feasible: ${project.feasible ? "Yes" : "No"}`);
    doc.text(`Notes: ${project.notes.join(", ")}`);
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
