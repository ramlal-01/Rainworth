import express from "express";
import {
  generateReport,
  getReports,
  downloadReport,
} from "../controllers/ReportController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// POST /api/reports/:projectId
router.post("/:projectId", auth, generateReport);

// GET /api/reports
router.get("/", auth, getReports);

// GET /api/reports/:id/download
router.get("/:id/download", auth, downloadReport);

export default router;
