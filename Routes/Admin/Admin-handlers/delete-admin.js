const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const Admin = require("../../../models/Admin");

const delete_admin = async (req, res) => {
  try {
    // Ensure the admin_token cookie is present
    const token = req.cookies.admin_token;
    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    // Decode and verify the token
    const secretKey = "your_secret_key"; // Replace with your actual secret key
    const decoded = jwt.verify(token, secretKey);
    console.log("Decoded token:", decoded);

    // Find the admin making the request
    const admin = await Admin.findById(decoded.id);
    console.log("Admin fetched:", admin);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    if (admin.title !== "Manager") {
      return res
        .status(403)
        .json({ message: "Only Managers can delete other admins" });
    }

    // Validate input
    const { employeeId, password } = req.body;
    console.log("Request body:", req.body);

    if (!employeeId || !password) {
      return res
        .status(400)
        .json({ message: "Employee ID and password are required" });
    }

    // Verify the manager's password
    const isPasswordMatch = await bcrypt.compare(password, admin.password);
    console.log("Password match result:", isPasswordMatch);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Attempt to delete the specified admin
    const employeeToDelete = await Admin.findOneAndDelete({ employeeId });
    console.log("Employee to delete:", employeeToDelete);

    if (!employeeToDelete) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error.message);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    return res.status(500).json({ message: "An unexpected error occurred" });
  }
};

module.exports = delete_admin;
