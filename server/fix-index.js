require("dotenv").config();
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/genz_store";

mongoose.connect(MONGO_URI).then(async () => {
  console.log("🔌 Connected to database...");
  try {
    // This specifically targets and destroys the broken rule
    await mongoose.connection.db.collection('users').dropIndex('phone_1');
    console.log("✅ SUCCESS: The stubborn 'phone_1' duplicate rule has been completely destroyed!");
  } catch (err) {
    console.log("⚠️ Note: Index might already be deleted or couldn't be found.", err.message);
  }
  process.exit();
});