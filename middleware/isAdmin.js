// src/middleware/isAdmin.js
const jwt = require("jsonwebtoken");

const isAdmin = (req, res, next) => {
  console.log("salve", req);

  const token = req.headers["authorization"]?.split(" ")[1]; // Get the token from the Authorization header
  console.log("salve", token);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Verify the token
    console.log("decode", decoded);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied" }); // Forbidden if not admin
    }
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    console.log("no123");
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = isAdmin;
