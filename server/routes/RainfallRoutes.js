import express from "express";
import {
  addRainfall,
  getRainfallByCity,
  updateRainfall,
  getAllRainfall,
} from "../controllers/RainfallDataController.js";

const router = express.Router();

// POST /api/rainfall
router.post("/", addRainfall);

// GET /api/rainfall
router.get("/", getAllRainfall);

// GET /api/rainfall/:city
router.get("/:city", getRainfallByCity);

// PUT /api/rainfall/:city
router.put("/:city", updateRainfall);

export default router;
