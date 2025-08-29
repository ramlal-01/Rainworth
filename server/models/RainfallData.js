import mongoose from "mongoose";

const rainfallDataSchema = new mongoose.Schema(
  {
    location: {
      district: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },

    year: {
      type: Number,
      required: true,
    },

    // Monthly rainfall in mm
    monthlyRainfall: {
      jan: { type: Number, default: 0 },
      feb: { type: Number, default: 0 },
      mar: { type: Number, default: 0 },
      apr: { type: Number, default: 0 },
      may: { type: Number, default: 0 },
      jun: { type: Number, default: 0 },
      jul: { type: Number, default: 0 },
      aug: { type: Number, default: 0 },
      sep: { type: Number, default: 0 },
      oct: { type: Number, default: 0 },
      nov: { type: Number, default: 0 },
      dec: { type: Number, default: 0 },
    },

    // Source of data → so team knows if it came from API, manual input, or DB
    source: {
      type: String,
      enum: ["API", "manual", "database"],
      default: "API",
    },
  },
  {
    timestamps: true,
  }
);

const RainfallData = mongoose.model("RainfallData", rainfallDataSchema);

export default RainfallData;