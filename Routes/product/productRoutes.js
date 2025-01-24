const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const productHandlers = require("./productHandlers/productIndex");
const multer = require("multer");

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 1000000 }, // 1MB file size limit
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image file"));
    }
    cb(undefined, true);
  },
});

// Public Routes
router.get("api/v1/get-products/", productHandlers.getProducts); // Get all products
router.get("api/v1/product/:id", productHandlers.getProductById); // Get product by ID
router.get("api/v1/products/:category", productHandlers.getProductByCategory); // Get product by category

// Protected Routes (require authentication)
router.post(
  "/api/v1/create-product",

  upload.single("image"),
  authMiddleware,
  productHandlers.createProduct
); // Create a product
router.put(
  "api/v1/updateProduct/:id",
  authMiddleware,
  productHandlers.updateProduct
); // Update a product
router.delete(
  "api/v1/deleteProduct/:id",
  authMiddleware,
  productHandlers.deleteProduct
); // Delete a product

module.exports = router;
