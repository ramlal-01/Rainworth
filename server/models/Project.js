import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    // ✅ Basic project metadata
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    district: {
      type: String,
      trim: true,
    },

    // ✅ Residence / site details
    residenceType: {
      type: String,
      enum: ["Independent House", "Apartment (Individual)", "Apartment (Entire Building)", "Colony"],
      required: true,
    },
    roofAreaSqM: {
      type: Number,
      required: true,
      min: 1,
    },
    openSpaceAreaSqM: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ✅ Rainfall data
    annualRainfallMm: {
      type: Number,
      required: true,
      min: 0,
    },
    monthlyRainfall: [
      {
        month: {
          type: String,
          enum: [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
          ],
        },
        rainfallMm: {
          type: Number,
          min: 0,
        },
      },
    ],

    // ✅ Calculation results
    harvestingPotentialLiters: {
      type: Number,
      default: 0,
    },
    recommendedStructure: {
      type: String,
      trim: true,
    },
    estimatedCost: {
      type: Number,
      default: 0,
    },
    sustainabilityScore: {
      type: Number, // 0–100
      default: 0,
    },

    // ✅ Report / Export info
    pdfReportUrl: {
      type: String, // link to saved PDF in cloud/local
    },

    // ✅ Metadata
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Optional, only if User schema exists
    },
  },
  {
    timestamps: true, // auto adds createdAt & updatedAt
  }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
