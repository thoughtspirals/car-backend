const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const adminMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.admin_token;

    console.log("Admin Middleware: Token received:", token);

    if (!token) {
      console.error("No token provided");
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const admin = await Admin.findById(decoded.id).select("-password");
      if (!admin) {
        console.error("Admin not found");
        return res.status(401).json({ message: "admin not found" });
      }
      console.log("Current admin is ", admin);
      req.admin = admin; // Set the current admin on the request object
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
    console.error("Error during token verification:", error);
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
};

module.exports = adminMiddleware;
