const jwt = require("jsonwebtoken");

const verifyRole = (allowedRole) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access Denied: Missing authentication token parameters." });
    }

    const token = authHeader.split(" ")[1];
    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET || "neo_secret_key_2k26");
      if (allowedRole && verified.role !== allowedRole) {
        return res.status(403).json({ message: "Forbidden: Insufficient account permissions." });
      }
      req.user = verified;
      next();
    } catch (err) {
      res.status(400).json({ message: "Invalid or expired token parameters: " + err.message });
    }
  };
};

module.exports = { verifyRole };