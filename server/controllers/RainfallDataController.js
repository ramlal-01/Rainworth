import { RainfallData } from "../models/RainfallData.js";

/* ------------------- Add Rainfall Entry ------------------- */
export const addRainfall = async (req, res) => {
  try {
    const { city, state, monthlyRainfall } = req.body;

    // Validation
    if (!city || !state) {
      return res.status(400).json({ error: "City and State are required" });
    }
    if (!monthlyRainfall || monthlyRainfall.length !== 12) {
      return res.status(400).json({ error: "Monthly rainfall data must have 12 values" });
    }

    // Calculate annual
    const annualRainfall = monthlyRainfall.reduce((a, b) => a + b, 0);

    const newEntry = await RainfallData.create({
      city,
      state,
      monthlyRainfall,
      annualRainfall,
    });

    res.status(201).json(newEntry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ------------------- Get Rainfall by City ------------------- */
export const getRainfallByCity = async (req, res) => {
  try {
    const { city } = req.params;
    const data = await RainfallData.findOne({ city: new RegExp(`^${city}$`, "i") }); // case-insensitive
    if (!data) return res.status(404).json({ error: "City data not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ------------------- Update Rainfall ------------------- */
export const updateRainfall = async (req, res) => {
  try {
    const { city } = req.params;
    const { monthlyRainfall, state } = req.body;

    const update = {};
    if (state) update.state = state;
    if (monthlyRainfall && monthlyRainfall.length === 12) {
      update.monthlyRainfall = monthlyRainfall;
      update.annualRainfall = monthlyRainfall.reduce((a, b) => a + b, 0);
    }

    const data = await RainfallData.findOneAndUpdate(
      { city: new RegExp(`^${city}$`, "i") },
      update,
      { new: true }
    );

    if (!data) return res.status(404).json({ error: "City data not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ------------------- Get All Rainfall Entries ------------------- */
export const getAllRainfall = async (req, res) => {
  try {
    const all = await RainfallData.find().sort({ state: 1, city: 1 });
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
