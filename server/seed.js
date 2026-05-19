require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

// Connect to your local database exactly like your server does
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/genz_store";

// The exact categories from your frontend ribbon enum
const categories = [
  "Fashion", "Mobiles", "Beauty", "Electronics", "Home", 
  "Appliances", "Toys", "Food & Health", "Auto Accessories", "2 Wheelers"
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("🚀 Connected to MongoDB Database cluster successfully!");
    
    // Optional: Uncomment the line below if you want to wipe the database clean before adding the 200 items. 
    // Otherwise, it will just add them alongside the items you already created.
    // await Product.deleteMany({}); 
    // console.log("🧹 Cleared old inventory.");

    let productsToInsert = [];

    // Loop through every category
    categories.forEach(category => {
      // Create 20 items per category
      for (let i = 1; i <= 20; i++) {
        productsToInsert.push({
          name: `Premium ${category} Item V${i}`,
          description: `Experience the best in our ${category} lineup. This is a high-quality product designed to meet all your daily needs with cutting-edge manufacturing. Model iteration ${i}.`,
          price: Number((Math.random() * 490 + 10).toFixed(2)), // Random price between $10.00 and $500.00
          stock: Math.floor(Math.random() * 150) + 5, // Random stock between 5 and 155
          category: category,
          // Generates a unique, real placeholder photograph for every single item
          image: `https://picsum.photos/seed/${category.replace(/\s/g, "")}${i}/400/300` 
        });
      }
    });

    console.log(`📦 Generating ${productsToInsert.length} products...`);
    
    // Bulk insert all 200 items into the database at once
    await Product.insertMany(productsToInsert);
    
    console.log("✅ Successfully deployed 200 items to the storefront catalog!");
    process.exit(); // Closes the script
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
};

// Run the function
seedDatabase();