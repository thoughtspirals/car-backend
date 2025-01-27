const Product = require("../../../models/product");

const updateProduct = async (req, res) => {
  try {
    const { _id, name, description, price, category, image } = req.body;

    // Validate input
    if (!_id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Find the product by ID
    const product = await Product.findById(_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update the product fields if provided
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (category) product.category = category;
    if (image) product.image = image;

    // Save the updated product
    await product.save();

    // Respond with the updated product
    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = updateProduct;
