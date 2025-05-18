const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Get the token from the Authorization header
  console.log("salve token", token);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Verify the token
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = isAuth;
