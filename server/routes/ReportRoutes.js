import express from "express";
import {
  generateReport,
  getReports,
  downloadReport,
} from "../controllers/ReportController.js";
import { auth, optionalAuth } from "../middleware/auth.js";

const router = express.Router();

// POST /api/reports/:projectId
router.post("/:projectId", optionalAuth, generateReport);

// GET /api/reports
router.get("/", auth, getReports);

// GET /api/reports/:id/download
router.get("/:id/download", downloadReport);

export default router;
