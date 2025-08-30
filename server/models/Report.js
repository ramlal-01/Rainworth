import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",   // link to the Project for which report is generated
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",   // which user generated it
      required: false, // Allow null for demo reports
    },

    // Store the PDF buffer directly
    pdfBuffer: {
      type: Buffer,
      required: true,
    },

    // Store important calculated values (quick access without recomputation)
    summary: {
      catchmentArea: { type: Number }, // m²
      annualRainfall: { type: Number }, // mm
      harvestingPotential: { type: Number }, // liters/year
      recommendedStructure: { type: String },
      estimatedCost: { type: Number },
      sustainabilityScore: { type: Number }, // optional nice-to-have
    },

    // To track if report has been modified or regenerated
    version: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true, // createdAt = generation time
  }
);

const Report = mongoose.model("Report", reportSchema);

export default Report;
