require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet"); 
const rateLimit = require("express-rate-limit"); 

// 1. IMPORT ALL ROUTES (Must match your folder filenames exactly)
const authRoutes = require("./routes/authRoutes"); 
const productRoutes = require("./routes/productRoutes"); 
const orderRoutes = require("./routes/order");
const serviceRoutes = require("./routes/serviceRoutes"); 

// 2. INITIALIZE EXPRESS APP (This MUST happen before using app.use!)
const app = express();

// 3. GLOBAL MIDDLEWARE
app.use(helmet()); 
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Global rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests from this network. Try again later." }
});
app.use("/api/", limiter);

// 4. MOUNT ROUTE IMPLEMENTATIONS
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/services", serviceRoutes); // 👈 FIXED: Safely placed below app initialization


// 5. DATABASE CONNECTION & SERVER BOOTSTRAP
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/genz_store";

mongoose.connect(MONGO_URI)
  .then(() => console.log("🚀 Connected to MongoDB Database cluster successfully!"))
  .catch(err => console.error("❌ MongoDB connection error on startup:", err.message));

app.listen(PORT, () => {
  console.log(`📡 Active full-stack server execution pipeline listening on port ${PORT}`);
});