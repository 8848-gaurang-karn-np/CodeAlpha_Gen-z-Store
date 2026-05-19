const express = require("express");
const Product = require("../models/Product"); // Now this imports the correct schema!
const { verifyRole } = require("../middleware/authMiddleware");

const router = express.Router();

// 🛍️ GET: Fetch products with Category filters and Search queries
router.get("/", async (req, res) => {
  try {
    const { category, search } = req.query;
    let queryCondition = {};

    if (category) queryCondition.category = category;

    if (search) {
      queryCondition.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const products = await Product.find(queryCondition).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch inventory parameters: " + err.message });
  }
});

// 🏢 POST: Client-only product upload handler
router.post("/", verifyRole("client"), async (req, res) => {
  try {
    const { name, description, price, stock, category, image } = req.body;
    
    if (!name || !description || !price || !stock || !category || !image) {
      return res.status(400).json({ message: "All product specification fields are required." });
    }
    
    const newProduct = await Product.create({ 
      name, 
      description, 
      price: Number(price), 
      stock: Number(stock), 
      category, 
      image 
    });
    
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("Upload crash log:", err);
    res.status(500).json({ message: "Database write error: " + err.message });
  }
});

module.exports = router;