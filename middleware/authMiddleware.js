const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.auth_token;

    console.log("Auth Middleware: Token received:", token);

    if (req.url === "/reset-password") {
      return next();
    }

    if (!token) {
      console.error("No token provided");
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        console.error("User not found");
        return res.status(401).json({ message: "User not found" });
      }
      console.log("Current user is ", user);
      req.user = user;
      next();
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        console.error("Invalid token");
        return res.status(401).json({ message: "Invalid token" });
      } else if (error.name === "TokenExpiredError") {
        console.error("Token has expired");
        return res.status(401).json({ message: "Token has expired" });
      } else {
        console.error("Error verifying token:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    }
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = authMiddleware;
