const express = require("express");
const router = express.Router();
const User = require("../models/user"); // Adjust the path as needed
const Cart = require("../models/cart");
const authMiddleware = require("../middleware/authMiddleware"); // Corrected path
const { body, validationResult } = require("express-validator");

// Import user-related handlers
const {
  signupHandler,
  signinHandler,
  profileHandler,
  updateProfile,
  deleteProfile,
  passwordUpdate,
  forgotPassword,
  resetPassword,
  logoutHandler,
} = require("./user/userHandlers");

const currentUser = require("./user/currentUser");

const addToCart = require("./user/addToCart");
const buyNow = require("./user/buyNow");

router.get("/api/v1/user", authMiddleware, currentUser);

// Public Routes
router.post(
  "/api/v1/user/signup",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  signupHandler
); // User signup
router.post(
  "/api/v1/user/signin",
  [
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  signinHandler
); // User signin
router.post(
  "/api/v1/user/password-update",
  [
    body("email").isEmail().withMessage("Invalid email address"),
    body("oldPassword").notEmpty().withMessage("Old password is required"),
    body("newPassword")
      .isLength({ min: 8 })
      .withMessage("New password must be at least 6 characters long"),
  ],
  passwordUpdate
); // Password update request
router.post(
  "/api/v1/user/forgot-password",
  [body("email").isEmail().withMessage("Invalid email address")],
  forgotPassword
);
router.post("/api/v1/user/reset-password", authMiddleware, resetPassword); //reset password request

// Protected Routes (require authentication)
router.get("/api/v1/user/profile", authMiddleware, profileHandler); // Get user profile
router.post("/api/v1/user/logout", authMiddleware, logoutHandler); // Logout user
router.put(
  "/api/v1/user/updateProfile",
  authMiddleware,
  [
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("email").optional().isEmail().withMessage("Invalid email address"),
  ],
  updateProfile
); // Update user profile
router.delete("/api/v1/user/profile-delete", authMiddleware, deleteProfile); // Delete user profile
// Add item to cart
router.post(
  "/api/v1/user/add-to-cart",
  authMiddleware,
  [
    body("productId").notEmpty().withMessage("Product ID is required"),
    body("quantity")
      .isInt({ gt: 0 })
      .withMessage("Quantity must be a positive integer"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    await addToCart(req, res);
  }
);

router.post("/api/v1/user/buy-now", authMiddleware, buyNow);

router.get("/api/v1/user/cart", authMiddleware, async (req, res) => {
  console.log("Fetching cart for user:", req.user); // Log user data
  try {
    const cart = await Cart.findOne({ owner: req.user._id });
    console.log("Cart found:", cart);
    res.json({ cartItems: cart ? cart.items : [] });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
