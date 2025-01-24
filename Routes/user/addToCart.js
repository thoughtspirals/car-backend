const express = require("express");
const mongoose = require("mongoose");
const Product = require("../../models/product");
const Cart = require("../../models/cart");

const addToCart = async (req, res) => {
  console.log("addToCart function called"); // Add this line to log the function call
  console.log("req.body data:", req.body); // Add this line to log the req.body data
  try {
    const { productId, quantity } = req.body;
    const user = req.user;
    let cart = await Cart.findOne({ owner: user._id });
    console.log("Cart found:", cart); // Add this line to log the cart data
    if (!cart) {
      cart = new Cart({ owner: user._id, items: [] });
    }
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
    await cart.save();
    res.json({ message: "Product added to cart successfully" });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = addToCart;
