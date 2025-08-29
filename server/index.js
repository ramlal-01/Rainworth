import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();

// connect to MongoDB
connectDB();

const app = express();
app.use(express.json());

// basic test route
app.get("/", (req, res) => {
  res.send("RainWorth backend running 🌧️");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
