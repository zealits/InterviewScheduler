const jwt = require("jsonwebtoken");

// Function to verify token and check the user role
const verifyToken = (req, res, next, role) => {
  const authHeader = req.header("Authorization");

  // Check if the token is provided and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  // Extract the token from the "Bearer <token>" header
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using the secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded token to the request

    // If the required role is "admin", check if the user has admin privileges
    if (role === "admin" && !decoded.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // If no specific role is required, pass the request to the next middleware
    if (role === "user" && !decoded.isUser) {
      return res.status(403).json({ message: "Access denied. Users only." });
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Middleware to authenticate Admin using the token
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token

    req.admin = decoded; // Attach decoded admin info to the request

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(400).json({ error: "Invalid token" });
  }
};

module.exports = { verifyToken, authenticateAdmin };
