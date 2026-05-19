const express = require("express");
const router = express.Router();
const Wishlist = require("../models/Wishlist"); 
const jwt = require("jsonwebtoken");

// Token validation layer
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Session token payload missing" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret_key");
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Session invalid" });
  }
};

// 📤 GET: Fetch User Wishlist (Works for BOTH consumer and client roles)
router.get("/wishlist", verifyToken, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.userId }).populate("products");
    
    // 🛡️ Defensive Check: If this role doesn't have a wishlist yet, initialize an empty one instantly
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.userId, products: [] });
      await wishlist.save();
    }
    
    res.status(200).json(wishlist);
  } catch (err) {
    res.status(500).json({ message: "Failed to read wishlist records", error: err.message });
  }
});

// 📥 POST: Toggle items inside your favorites index mapping
router.post("/wishlist/toggle", verifyToken, async (req, res) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.userId });

    // 🛡️ Defensive Check: Build a wishlist tracker container if it's missing for this user
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.userId, products: [] });
    }

    const itemIndex = wishlist.products.indexOf(productId);
    if (itemIndex > -1) {
      // Item exists, drop it
      wishlist.products.splice(itemIndex, 1);
    } else {
      // Item missing, push it
      wishlist.products.push(productId);
    }

    await wishlist.save();
    res.status(200).json({ message: "Wishlist state altered successfully", products: wishlist.products });
  } catch (err) {
    res.status(500).json({ message: "Wishlist mutation failure", error: err.message });
  }
});

module.exports = router;