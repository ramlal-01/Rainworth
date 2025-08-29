import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  deleteProject,
} from "../controllers/ProjectController.js";

const router = express.Router();

// POST /api/projects
router.post("/", createProject);

// GET /api/projects
router.get("/", getProjects);

// GET /api/projects/:id
router.get("/:id", getProjectById);

// DELETE /api/projects/:id
router.delete("/:id", deleteProject);

export default router;
