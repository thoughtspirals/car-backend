const express = require("express");
const Product = require("../../../models/product");

// ...

const getProductByName = async (req, res) => {
  try {
    const name = req.query.name;
    console.log(`Query Name: ${name}`);

    if (!name) {
      return res.status(400).json({ message: "Product name is required" });
    }

    const product = await Product.findOne({ name });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching product" });
  }
};

module.exports = getProductByName; // Use module.exports for CommonJS
