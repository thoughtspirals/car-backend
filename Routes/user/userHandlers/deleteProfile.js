const express = require("express");
const router = express.Router();
const authMiddleware = require("../../../middleware/authMiddleware");
const User = require("../../../models/user");

const deleteProfile = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      console.error("User not found");
      return res.status(404).json({ message: "User not found" });
    }
    // if (!user.password) {
    //   console.error("Password is not set");
    //   return res.status(401).json({ message: "Password is not set" });
    // }
    const isValidPassword = await user.matchPassword(password);
    if (!isValidPassword) {
      console.error("Invalid password");
      return res.status(401).json({ message: "Invalid password" });
    }
    await User.findByIdAndDelete(req.user._id);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting user" });
  }
};

module.exports = deleteProfile;
