const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const currentUser = async (req, res) => {
  try {
    const user = req.user;
    console.log("Current user retrieved:", user);
    res.status(200).json({
      status: "success",
      message: "Successful",
      user,
    });
  } catch (error) {
    // Internal server error
    console.error("Error retrieving current user:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      error,
    });
  }
};

module.exports = currentUser;
