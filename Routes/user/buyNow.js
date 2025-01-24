const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../../models/product');
const Order = require('../../models/order');

// Buy Now API Endpoint
const buyNow = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Validate input
    if (!productId || !quantity) {
      return res.status(400).json({ message: 'Product ID and quantity are required' });
    }

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Calculate total cost
    const totalCost = product.price * quantity;

    // Create a new order
    const order = new Order({
      productId,
      quantity,
      paymentMethod: req.body.paymentMethod,
  userId: req.body.userId,
      totalCost,
    });

    // Save the order
    await order.save();

    // Respond with success message and order details
    res.status(201).json({
      message: 'Order placed successfully',
      orderId: order._id,
      orderDetails: {
        productId,
        productName: product.name,
        quantity,
        totalCost,
      },
    });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = buyNow;