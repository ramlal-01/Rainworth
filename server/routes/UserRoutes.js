import express from "express";
import { signup, login, getProfile } from "../controllers/UserController.js";
// import { auth } from "../middleware/auth.js";

const router = express.Router();

// POST /api/users/signup
router.post("/signup", signup);

// POST /api/users/login
router.post("/login", login);

// GET /api/users/profile
router.get("/profile", getProfile);

export default router;
