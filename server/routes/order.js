const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const jwt = require("jsonwebtoken");

// 🛡️ Simple inline security middleware to extract user from token session
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized token payload missing" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret_key");
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid session validation parameters" });
  }
};

// 📥 POST: Save a newly processed order
router.post("/", verifyToken, async (req, res) => {
  try {
    const { items, total, shippingAddress } = req.body;
    const newOrder = new Order({
      user: req.userId,
      items,
      total,
      shippingAddress
    });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: "Database write failure during order logging", error: err.message });
  }
});

// 📤 GET: Fetch all active orders for the logged-in user
router.get("/my-orders", verifyToken, async (req, res) => {
  try {
    const userOrders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(userOrders);
  } catch (err) {
    res.status(500).json({ message: "Database search retrieval crash log", error: err.message });
  }
});

module.exports = router;