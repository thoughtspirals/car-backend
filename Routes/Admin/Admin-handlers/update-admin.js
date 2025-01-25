const express = require("express");
const router = express.Router();
const adminMiddleware = require("../../../middleware/adminMiddleware");
const Admin = require("../../../models/Admin");

const update_admin = async (req, res) => {
  try {
    const { username, name, title, email, phone } = req.body;

    if (!name && !email && !phone && !title && !username) {
      return res
        .status(400)
        .json({ message: "At least one field is required to update" });
    }

    const admin = await Admin.findById(req.admin._id);

    // Update fields
    if (name) admin.name = name;
    if (username) admin.username = username;
    if (title) admin.title = title;
    if (email) admin.email = email;
    if (phone) admin.phone = phone;

    await admin.save();

    res.status(200).json({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating profile" });
  }
};

module.exports = update_admin;
