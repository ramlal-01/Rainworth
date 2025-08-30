import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
  location: { type: String, required: true },
  residenceType: { 
    type: String, 
    enum: ["Independent House", "Apartment", "Colony"], 
    required: true 
  },
  numberOfDwellers: { type: Number, required: true },
  numberOfFlats: { type: Number },
  openSpaceArea: { type: Number, required: true },
  roofType: { 
    type: String, 
    enum: ["Concrete", "Tile", "Sheet"], 
    required: true 
  },
  roofArea: { type: Number, required: true },
  roofAreaPolygon: { type: Object } // optional GeoJSON
});

export const Project = mongoose.model("Project", projectSchema);
