import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import projectRoutes from "./routes/ProjectRoutes.js";
import reportRoutes from "./routes/ReportRoutes.js";
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); 

// API Routes
app.use("/api/projects", projectRoutes);
app.use("/api/reports", reportRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("🌧 RainWorth backend is running...");
});

export default app;