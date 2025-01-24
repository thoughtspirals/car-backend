const express = require("express");
const router = express.Router();
const Admin = require("../../models/Admin"); // Adjust the path as needed
const adminMiddleware = require("../../middleware/adminMiddleware"); // Corrected path
const { body, validationResult } = require("express-validator");

//current admin
const currentAdmin = require("./currentAdmin");

const { create_admin } = require("../../Routes/Admin/AdminIndex");
const { admin_login } = require("../../Routes/Admin/AdminIndex");
const { update_admin } = require("../../Routes/Admin/AdminIndex");
const { delete_admin } = require("../../Routes/Admin/AdminIndex");
const { forgot_admin_password } = require("../../Routes/Admin/AdminIndex");

// Current Admin
router.get("/api/v1/admin", adminMiddleware, currentAdmin);

// Create Admin

router.post(
  "/api/v1/create-admin",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("username").notEmpty().withMessage("username is required"),
    body("title").notEmpty().withMessage("title is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("phone")
      .notEmpty()
      .withMessage("Phone required")
      .isLength({ min: 10 }),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  create_admin
);

// Admin Login
router.post(
  "/api/v1/admin-login",
  [
    body("username").notEmpty().withMessage("username is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  admin_login
);

// Update Admin
router.put(
  "/api/v1/update-admin",
  adminMiddleware,
  [
    body("name").optional(),
    body("username").optional(),
    body("title").optional(),
    body("email").optional().isEmail().withMessage("Invalid email address"),
    body("phone").optional().isLength({ min: 10 }),
  ],
  update_admin
);

// Delete Admin
router.delete(
  "/api/v1/delete-admin",
  adminMiddleware,
  [
    body("employeeId").notEmpty().withMessage("Employee ID is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  delete_admin
);

//Forgot Admin Pass
router.put(
  "/api/v1/forgot-admin-passsword",
  [
    body("employeeId").notEmpty().withMessage("Employee ID is required"),
    body("username").notEmpty().withMessage("username is required"),
    body("newPassword").notEmpty().withMessage("New Password is required"),
    body("confirmNewPassword")
      .notEmpty()
      .withMessage("Confirm New Password is required"),
  ],
  forgot_admin_password
);

module.exports = router;
