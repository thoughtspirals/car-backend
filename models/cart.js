const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // Ensures the cart is linked to a specific user
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true, // Links the cart item to a specific product
      },
      name: {
        type: String,
        required: true, // Stores product name for quick access
      },
      quantity: {
        type: Number,
        default: 1, // Default quantity for new items
        min: 1, // Ensures the quantity is always at least 1
      },
      price: {
        type: Number,
        required: true, // Stores product price for easy calculation
      },
    },
  ],
  totalCost: {
    type: Number,
    default: 0, // Total cost of items in the cart
  },
  createdAt: {
    type: Date,
    default: Date.now, // Timestamp for cart creation
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Timestamp for the last cart update
  },
});

// Calculate total cost of the cart
cartSchema.methods.calculateTotalCost = function () {
  let totalCost = 0;
  this.items.forEach((item) => {
    totalCost += item.price * item.quantity; // Calculates the total cost
  });
  this.totalCost = totalCost;
  return totalCost;
};

// Add or update an item in the cart
cartSchema.methods.addOrUpdateItem = function (product, quantity) {
  const existingItemIndex = this.items.findIndex(
    (item) => item.product.toString() === product._id.toString()
  );

  if (existingItemIndex >= 0) {
    // Update the quantity of an existing item
    this.items[existingItemIndex].quantity += quantity;
  } else {
    // Add a new item to the cart
    this.items.push({
      product: product._id,
      name: product.name,
      quantity,
      price: product.price,
    });
  }

  this.calculateTotalCost(); // Recalculate the total cost
  this.updatedAt = Date.now(); // Update the last updated timestamp
  return this.save(); // Save changes to the database
};

// Remove an item from the cart
cartSchema.methods.removeItem = function (productId) {
  this.items = this.items.filter(
    (item) => item.product.toString() !== productId.toString()
  );
  this.calculateTotalCost(); // Recalculate the total cost
  this.updatedAt = Date.now(); // Update the last updated timestamp
  return this.save(); // Save changes to the database
};

// Clear the cart
cartSchema.methods.clearCart = function () {
  this.items = []; // Remove all items from the cart
  this.totalCost = 0; // Reset the total cost
  this.updatedAt = Date.now(); // Update the last updated timestamp
  return this.save(); // Save changes to the database
};

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
