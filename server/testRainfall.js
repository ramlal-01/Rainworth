import dotenv from "dotenv";
dotenv.config();

import { getCoordinates, getMonthlyRainfall } from "./utils/rainfall.js";
import { 
  calculateHarvest, 
  recommendStructure, 
  calculateRechargeFrequency,
  calculateConsumption,
  calculateSurplus
} from "./utils/harvest.js";

const test = async () => {
  const location = "Mathura, India"; // Change this to any city
  const roofArea = 50;               // in m²
  const roofType = "Concrete";       // "Concrete", "Tile", "Sheet"
  const numDwellers = 4;             // Number of people in the house
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;

  console.log("Fetching coordinates for:", location);
  const coords = await getCoordinates(location, apiKey);
  if (!coords) {
    console.log("Failed to get coordinates. Exiting...");
    return;
  }
  console.log("Coordinates:", coords);

  console.log("Fetching monthly rainfall from NASA POWER...");
  const monthlyRainfall = await getMonthlyRainfall(coords.lat, coords.lon);
  if (!monthlyRainfall) {
    console.log("Failed to get rainfall data. Exiting...");
    return;
  }
  console.log("Monthly rainfall (mm):", monthlyRainfall);

  // Calculate monthly & annual harvest
  const { monthlyHarvest, annualHarvest, runoffCoeff } = calculateHarvest(monthlyRainfall, roofArea, roofType);
  console.log(`Runoff coefficient for ${roofType}:`, runoffCoeff);
  console.log("Monthly harvest (L):", monthlyHarvest);
  console.log("Annual harvest (L):", annualHarvest.toFixed(2));

  // Calculate consumption
  const { monthlyConsumption, annualConsumption } = calculateConsumption(numDwellers);
  console.log("Monthly consumption (L):", monthlyConsumption);
  console.log("Annual consumption (L):", annualConsumption.toFixed(2));

  // Calculate surplus for recharge
  const { monthlySurplus, annualSurplus } = calculateSurplus(monthlyHarvest, monthlyConsumption);
  console.log("Monthly surplus for recharge (L):", monthlySurplus);
  console.log("Annual surplus for recharge (L):", annualSurplus.toFixed(2));

  // Recommend structure
  const structure = recommendStructure(annualHarvest);
  console.log("Recommended structure:", structure);

  // Calculate recharge frequency
  const rechargeFreq = calculateRechargeFrequency(annualHarvest, 5000); // default 5000 L tank
  console.log("Recharge frequency (times/year):", rechargeFreq);
};

test();
