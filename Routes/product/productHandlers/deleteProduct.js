const Product = require("../../../models/product");

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    //Validate Input
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    //Find and delete product
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Log product deletion
    console.log(`Product deleted successfully: ${productId}`);

    // Respond with success message
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = deleteProduct;
