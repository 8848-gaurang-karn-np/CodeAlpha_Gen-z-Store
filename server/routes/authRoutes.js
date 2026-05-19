const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); 
const User = require("../models/User");

const router = express.Router();
let temporaryVerificationCache = {};

const evaluatePassword = (password) => {
  if (!password) return { isValid: false, error: "Password field is required." };
  if (password.length < 8) return { isValid: false, error: "Password must be at least 8 characters long." };
  if (!/[A-Z]/.test(password)) return { isValid: false, error: "Password must contain an uppercase letter." };
  if (!/[a-z]/.test(password)) return { isValid: false, error: "Password must contain a lowercase letter." };
  if (!/\d/.test(password)) return { isValid: false, error: "Password must contain a number." };
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return { isValid: false, error: "Password must contain a special symbol (!@#$%)." };
  return { isValid: true };
};

router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, role, authMethod } = req.body;

    const passwordCheck = evaluatePassword(password);
    if (!passwordCheck.isValid) {
      return res.status(400).json({ message: passwordCheck.error });
    }

    if (authMethod === "email" && email) {
      const emailExists = await User.findOne({ email: email.toLowerCase().trim() });
      if (emailExists) return res.status(400).json({ message: "This email address is already registered!" });
    }
    if (authMethod === "phone" && phone) {
      const phoneExists = await User.findOne({ phone: phone.trim() });
      if (phoneExists) return res.status(400).json({ message: "This phone number is already registered!" });
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const trackingKey = authMethod === "email" ? email.toLowerCase().trim() : phone.trim();

    temporaryVerificationCache[trackingKey] = {
      name,
      email: authMethod === "email" ? email.toLowerCase().trim() : undefined,
      phone: authMethod === "phone" ? phone.trim() : undefined,
      password, 
      role: role || "consumer",
      otpCode: generatedOtp,
      expiresAt: Date.now() + 10 * 60 * 1000 
    };

    console.log(`\n📬 --- [Gen Z Store OTP SIMULATOR DISPATCH] ---`);
    console.log(`Target Destination: ${trackingKey}`);
    console.log(`Your 6-Digit Verification Pin Code is: [ ${generatedOtp} ]`);
    console.log(`--------------------------------------------\n`);

    return res.json({ message: `Code dispatched via ${authMethod}! Check your backend terminal.` });
  } catch (error) {
    res.status(500).json({ message: "Registration failed: " + error.message });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, phone, otpCode, authMethod } = req.body;
    const trackingKey = authMethod === "email" ? email.toLowerCase().trim() : phone.trim();

    const record = temporaryVerificationCache[trackingKey];
    if (!record || record.otpCode !== otpCode) {
      return res.status(400).json({ message: "Invalid or expired verification code." });
    }

    const hashedPassword = await bcrypt.hash(record.password, 10);
    const user = await User.create({
      name: record.name,
      email: record.email,
      phone: record.phone,
      password: hashedPassword,
      role: record.role
    });

    delete temporaryVerificationCache[trackingKey];
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "neo_secret_key_2k26", { expiresIn: "7d" });

    res.status(201).json({
      message: "Account verified successfully!",
      token,
      role: user.role,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: "OTP Verification failed: " + error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;
    const cleanIdentifier = emailOrPhone.trim();

    const user = await User.findOne({
      $or: [
        { email: cleanIdentifier.toLowerCase() },
        { phone: cleanIdentifier }
      ]
    });

    if (!user) return res.status(400).json({ message: "Account identifier not found." });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Incorrect security credentials." });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "neo_secret_key_2k26", { expiresIn: "7d" });
    res.json({ token, role: user.role, user: { id: user._id, name: user.name } });
  } catch (error) {
    res.status(500).json({ message: "Login failed: " + error.message });
  }
});

router.get("/suggest-password", (req, res) => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+=-";
  let pass = ["A", "a", "7", "#"];
  const bytes = crypto.randomBytes(12);
  for (let i = 0; i < bytes.length; i++) pass.push(chars[bytes[i] % chars.length]);
  const suggestedPassword = pass.sort(() => 0.5 - Math.random()).join('');
  res.json({ suggestedPassword });
});

router.post("/google-login", async (req, res) => {
  try {
    const { googleId, email, name } = req.body;
    let user = await User.findOne({ googleId });
    if (!user) {
      user = await User.findOne({ email });
      if (user) { user.googleId = googleId; await user.save(); }
      else { user = await User.create({ name, email, googleId, role: "consumer" }); }
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "neo_secret_key_2k26", { expiresIn: "7d" });
    res.json({ token, role: user.role, user: { id: user._id, name: user.name } });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post("/facebook-login", async (req, res) => {
  try {
    const { facebookId, email, name } = req.body;
    let user = await User.findOne({ facebookId });
    if (!user) {
      user = await User.findOne({ email });
      if (user) { user.facebookId = facebookId; await user.save(); }
      else { user = await User.create({ name, email: email || `${facebookId}@fb.local`, facebookId, role: "consumer" }); }
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "neo_secret_key_2k26", { expiresIn: "7d" });
    res.json({ token, role: user.role, user: { id: user._id, name: user.name } });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;