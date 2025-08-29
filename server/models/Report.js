import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",   // link to the Project for which report is generated
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",   // which user generated it
      required: true,
    },

    // Store important calculated values (quick access without recomputation)
    summary: {
      catchmentArea: { type: Number, required: true }, // m²
      annualRainfall: { type: Number, required: true }, // mm
      harvestingPotential: { type: Number, required: true }, // liters/year
      recommendedStructure: { type: String },
      estimatedCost: { type: Number },
      sustainabilityScore: { type: Number }, // optional nice-to-have
    },

    // Store file reference if we generate PDF
    reportFile: {
      fileName: { type: String },
      fileUrl: { type: String }, // Path to server or cloud (S3, GDrive, local storage)
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
