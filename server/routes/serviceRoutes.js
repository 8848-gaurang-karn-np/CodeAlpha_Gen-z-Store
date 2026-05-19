const express = require("express");
const router = express.Router();
const { verifyRole } = require("../middleware/authMiddleware");
const User = require("../models/User");
const Wishlist = require("../models/Wishlist");

// 👤 GET: Fetch User Profile Metadata
router.get("/profile", verifyRole("consumer"), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "Profile parameters not found." });
    
    // Inject mock metric metadata matching your premium loyalty UI structures
    res.json({
      user,
      plusMember: true,
      coinBalance: 350,
      giftCards: [{ code: "NEO-2K26-SAVE10", balance: 50.00 }]
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📝 PUT: Update User Profile Data
router.put("/profile", verifyRole("consumer"), async (req, res) => {
  try {
    const { name, phone, age, address } = req.body;
    
    // Find the user and update their details
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { 
        $set: { 
          name, 
          phone, 
          age, 
          address 
        } 
      },
      { new: true, runValidators: true } // Returns the updated document
    ).select("-password");

    res.json({ message: "Profile successfully updated!", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Profile update failed: " + err.message });
  }
});

// ❤️ GET: Fetch User Wishlist Array
router.get("/wishlist", verifyRole("consumer"), async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id }).populate("products");
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, products: [] });
    }
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ❤️ POST: Add/Remove Item From Wishlist Matrix
router.post("/wishlist/toggle", verifyRole("consumer"), async (req, res) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user.id });
    
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, products: [] });
    }

    const index = wishlist.products.indexOf(productId);
    if (index === -1) {
      wishlist.products.push(productId);
      await wishlist.save();
      return res.json({ message: "Product added to wishlist!", active: true });
    } else {
      wishlist.products.splice(index, 1);
      await wishlist.save();
      return res.json({ message: "Product removed from wishlist.", active: false });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;