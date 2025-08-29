import { Project } from "../models/Project.js";

/* ------------------- Constants & Lookups ------------------- */
const RUNOFF = { concrete: 0.85, tile: 0.65, sheet: 0.75 }; 
// NOTE: These are averages. Future upgrade: allow min–max ranges.

const COST_LOOKUP = {
  storage_tank: { min: 15000, max: 60000 },
  recharge_pit: { min: 5000, max: 10000 },
  recharge_trench: { min: 20000, max: 40000 },
  recharge_shaft: { min: 50000, max: 120000 },
};

const CAPACITY_LOOKUP = {
  storage_tank: { min: 10000, max: 30000 },  // tank volumes vary
  recharge_pit: { min: 3000, max: 10000 },
  recharge_trench: { min: 20000, max: 50000 },
  recharge_shaft: { min: 100000, max: 200000 }, // shaft usually 100k+
};

const STRUCTURE_LABEL = {
  storage_tank: "Storage Tank",
  recharge_pit: "Recharge Pit",
  recharge_trench: "Recharge Trench",
  recharge_shaft: "Recharge Shaft",
};

const FEASIBILITY_THRESHOLD_L = 20000;
const TANKER_L = 5000;
const PER_CAPITA_DAY = 135;

/* ------------------- Helpers ------------------- */
const pickStructure = (openSpace) => {
  if (openSpace <= 0) return "storage_tank";
  if (openSpace <= 5) return "storage_tank";
  if (openSpace <= 25) return "recharge_pit";
  if (openSpace <= 100) return "recharge_trench";
  return "recharge_shaft";
};

const suggestDimensions = (structure) => {
  switch (structure) {
    case "recharge_pit": return { type: "pit", diameter_m: 1.5, depth_m: 2.5 };
    case "recharge_trench": return { type: "trench", width_m: 0.6, depth_m: 1.5, length_m: 6 };
    case "recharge_shaft": return { type: "shaft", diameter_m: 0.9, depth_m: 8 };
    case "storage_tank": default: return { type: "tank", volume_l: 10000 };
  }
};

const computeHarvest = (area, rainfall, coeff) => {
  const year = area * rainfall * coeff;
  return { year: Math.round(year), month: Math.round(year / 12) };
};

const computeBenefits = (yearLitres, dwellers) => {
  const tankersPerYear = +(yearLitres / TANKER_L).toFixed(2);
  const peopleServedPerYear = +(yearLitres / (PER_CAPITA_DAY * 365)).toFixed(2);
  const perFlatLitresYear = dwellers > 1 ? Math.round(yearLitres / dwellers) : null;
  return { tankersPerYear, peopleServedPerYear, perFlatLitresYear };
};

/* ------------------- Controllers ------------------- */

// POST /api/projects
export const createProject = async (req, res) => {
  try {
    const input = req.body;

    // Rainfall (fallback 800 mm if not provided)
    let annualRainfallMm = input.annualRainfallMm || 800;
    if (Array.isArray(input.monthlyRainfall) && input.monthlyRainfall.length === 12) {
      annualRainfallMm = input.monthlyRainfall.reduce((a, b) => a + b, 0);
    }

    const runoffCoeff = input.runoffCoeffOverride || RUNOFF[input.roofType] || 0.75;
    const { year, month } = computeHarvest(input.roofArea, annualRainfallMm, runoffCoeff);

    const structureKey = pickStructure(input.openSpace);
    const suggestedStructure = STRUCTURE_LABEL[structureKey];
    const dimensions = suggestDimensions(structureKey);
    const costEstimateInr = COST_LOOKUP[structureKey];
    const capacityRangeLitres = CAPACITY_LOOKUP[structureKey];

    const feasible = year >= FEASIBILITY_THRESHOLD_L || structureKey !== "none";
    const benefits = computeBenefits(year, input.dwellersOrFlats || 1);

    const notes = [];
    if (input.openSpace <= 0) notes.push("Open space is 0 → Storage tank recommended.");
    if (input.residenceType === "apartment_individual") notes.push("Individual flat: advise society-level solution.");
    if (year < FEASIBILITY_THRESHOLD_L) notes.push("Low yield: limited viability.");

    // ---------------- Optional Extra Fields ----------------
    const soilType = input.soilType || "medium"; // default placeholder
    const infiltrationRateMmHr = input.infiltrationRateMmHr || 20; // avg 20 mm/hr
    const groundwaterDepthM = input.groundwaterDepthM || null; // optional, can be integrated later

    // ---------------- Save to DB ----------------
    const newProject = await Project.create({
      ...input,
      annualRainfallMm,
      runoffCoeff,
      harvestLitresYear: year,
      harvestLitresMonth: month,
      feasible,
      suggestedStructure,
      dimensions,
      costEstimateInr,
      capacityRangeLitres,
      benefits,
      notes,
      soilType,
      infiltrationRateMmHr,
      groundwaterDepthM,
    });

    res.status(201).json(newProject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
