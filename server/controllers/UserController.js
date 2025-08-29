import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "rainworth_secret";

/* ------------------- Signup ------------------- */
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "User already exists" });

    // create user (password will be hashed by model middleware)
    const newUser = await User.create({ name, email, password });
    res.status(201).json({ message: "User created successfully", userId: newUser._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ------------------- Login ------------------- */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ------------------- Get Profile ------------------- */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
