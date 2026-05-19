const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ["Fashion", "Mobiles", "Beauty", "Electronics", "Home", "Appliances", "Toys", "Food & Health", "Auto Accessories", "2 Wheelers"]
  },
  image: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);