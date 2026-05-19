const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Inline token verifier to keep things clean and foolproof
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access Denied: Missing Session Token" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret_key");
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Session expired or invalid" });
  }
};

// 📤 GET: Fetch Profile details (Permitted for BOTH consumer and client roles)
router.get("/profile", verifyToken, async (req, res) => {
  try {
    // Look up the user cleanly by their authenticated ID token path
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Identity profile record not found" });
    }
    
    // Return the user directly so the frontend reads the keys correctly
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Internal server error during profile retrieval", error: err.message });
  }
});

// 📥 PUT: Update Profile Workspace parameters (Permitted for BOTH roles)
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const { name, phone, age, address } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { $set: { name, phone, age, address } },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Database update collision occurred", error: err.message });
  }
});

module.exports = router;