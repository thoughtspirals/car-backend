const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // _id: {
    //   type: Number,
    //   required: true,
    //   unique: true,
    // },
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
    },
    image: {
      type: String,
      trim: true,
    },
    productId: {
      type: Number,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
