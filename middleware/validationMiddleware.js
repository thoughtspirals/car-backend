const { body, validationResult } = require("express-validator");

// User validation middleware
const userValidationRules = () => {
  return [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("phone").notEmpty().withMessage("Phone number is required"),
  ];
};

// Product validation middleware
const productValidationRules = () => {
  return [
    body("name").notEmpty().withMessage("Product name is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("price")
      .isNumeric()
      .withMessage("Price must be a number")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
    body("category").notEmpty().withMessage("Category is required"),
    body("stock")
      .isNumeric()
      .withMessage("Stock must be a number")
      .isInt({ gt: -1 })
      .withMessage("Stock cannot be negative"),
  ];
};

// Middleware to check for validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  userValidationRules,
  productValidationRules,
  validate,
};
