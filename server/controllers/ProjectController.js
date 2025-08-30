import { Project } from "../models/Project.js";
import { Calculation } from "../models/calculation.js";
import { getCoordinates, getMonthlyRainfall } from "../utils/rainfall.js";
import { calculateHarvest, recommendStructure, calculateRechargeFrequency, calculateConsumption, calculateSurplus, ROOF_RUNOFF } from "../utils/harvest.js";

export const createProject = async (req, res) => {
  try {
    const { name, location, residenceType, numberOfDwellers, numberOfFlats, openSpaceArea, roofType, roofArea } = req.body;

    // 1️⃣ Save project basic info
    const project = await Project.create({
      name,
      location,
      residenceType,
      numberOfDwellers,
      numberOfFlats,
      openSpaceArea,
      roofType,
      roofArea
    });

    // 2️⃣ Fetch coordinates & rainfall
    const coords = await getCoordinates(location, process.env.OPENWEATHERMAP_API_KEY);
    const monthlyRainfall = await getMonthlyRainfall(coords.lat, coords.lon);

    // 3️⃣ Calculate harvest, consumption, surplus
    const { monthlyHarvest, annualHarvest, runoffCoeff } = calculateHarvest(monthlyRainfall, roofArea, roofType);
    const { monthlyConsumption, annualConsumption } = calculateConsumption(numberOfDwellers);
    const { monthlySurplus, annualSurplus } = calculateSurplus(monthlyHarvest, monthlyConsumption);

    // 4️⃣ Recommend structure & recharge frequency
    const structure = recommendStructure(annualHarvest);
    const rechargeFreq = calculateRechargeFrequency(annualHarvest);

    // 5️⃣ Save calculation
    const calculation = await Calculation.create({
    projectId: project._id,
    monthlyRainfall,
    monthlyHarvest,
    monthlyConsumption,
    monthlySurplus,
    annualHarvest,
    annualConsumption,
    annualSurplus,
    structureType: structure.type,
    structureCost: structure.cost,
    rechargeFrequency: rechargeFreq,
    runoffCoeff
  });


    res.status(201).json({
      project,
      calculation,
      monthlyConsumption,
      annualConsumption,
      monthlySurplus,
      annualSurplus
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getProjectCalculation = async (req, res) => {
  try {
    const { projectId } = req.params;
    const calculation = await Calculation.findOne({ projectId });
    if (!calculation) return res.status(404).json({ message: "Calculation not found" });
    res.json(calculation);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};