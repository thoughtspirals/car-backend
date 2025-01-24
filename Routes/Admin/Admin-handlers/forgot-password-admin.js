const express = require("express");
const router = express.Router();
const adminMiddleware = require("../../../middleware/adminMiddleware");
const Admin = require("../../../models/Admin");
const bcrypt = require("bcryptjs");

const forgot_admin_password = async (req, res) => {
  const { employeeId, username, newPassword, confirmNewPassword } = req.body;
  try {
    const admin = await Admin.findOne({ employeeId: employeeId });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);
    admin.password = hashedNewPassword;
    await admin.save();
    return res
      .status(200)
      .json({ message: "Admin password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating password" });
  }
};

module.exports = forgot_admin_password;
