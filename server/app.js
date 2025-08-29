import express from "express";
import morgan from "morgan";

// Import all routes
import projectRoutes from "./routes/ProjectRoutes.js";
import rainfallRoutes from "./routes/RainfallRoutes.js";
import reportRoutes from "./routes/ReportRoutes.js";
import userRoutes from "./routes/UserRoutes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(morgan("dev"));

// API Routes
app.use("/api/projects", projectRoutes);
app.use("/api/rainfall", rainfallRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/users", userRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("🌧 RainWorth backend is running...");
});

export default app;
