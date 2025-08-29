import mongoose from "mongoose";

const calculationSchema = new mongoose.Schema({
  projectId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Project", 
    required: true,
    index: true  // speeds up queries by projectId
  },

  // Monthly data stored as Map of Number for better validation
  monthlyRainfall: { type: Map, of: Number, required: true },   // mm per month
  monthlyHarvest: { type: Map, of: Number, required: true },    // liters per month
  monthlyConsumption: { type: Map, of: Number, required: true }, // liters per month
  monthlySurplus: { type: Map, of: Number, required: true },    // liters per month available for recharge

  // Annual totals
  annualHarvest: { type: Number, required: true },     // total liters
  annualConsumption: { type: Number, required: true }, // total liters
  annualSurplus: { type: Number, required: true },     // total liters for recharge

  // Structure recommendations
  structureType: { type: String, required: true },     // e.g., Storage Tank, Recharge Well
  structureCost: { type: Number, required: true },     // in ₹
  rechargeFrequency: { type: Number, required: true }, // times/year
  runoffCoeff: { type: Number, required: true },       // depends on roof type

  createdAt: { type: Date, default: Date.now }
});

export const Calculation = mongoose.model("Calculation", calculationSchema);
