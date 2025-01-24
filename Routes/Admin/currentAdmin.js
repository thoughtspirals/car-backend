const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Admin = require("../../models/Admin");

const currentAdmin = async (req, res) => {
  try {
    const admin = req.Admin;
    console.log("Current admin retrieved:", admin);
    res.status(200).json({
      status: "success",
      message: "Successful",
      user,
    });
  } catch (error) {
    // Internal server error
    console.error("Error retrieving current admin:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      error,
    });
  }
};

module.exports = currentAdmin;
