const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["consumer", "client"], default: "consumer" },
  isVerified: { type: Boolean, default: false },
  verificationCode: { type: String },
  
  // 👥 Extensive Parameters
  // REMoved: any unique: true rules that cause verification collisions
  phone: { type: String, default: "" }, 
  age: { type: Number, default: null },
  address: {
    street: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    zipCode: { type: String, default: "" }
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);