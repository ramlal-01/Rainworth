import express from "express";
import { createProject, getAllProjects, getProjectCalculation } from "../controllers/ProjectController.js";

const router = express.Router();

// Create new project + run calculations
router.post("/", createProject);

// Get all projects
router.get("/", getAllProjects);

// Get calculation of a project
router.get("/:projectId/calculation", getProjectCalculation);

export default router;
