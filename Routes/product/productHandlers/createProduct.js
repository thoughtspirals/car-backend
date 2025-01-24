const Product = require("../../../models/product");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const createProduct = async (req, res) => {
  console.log("Request Body:", req.body); // Log the incoming request body
  const { name, description, price, category, stock } = req.body;
  try {
    // Validate input
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // Create product
    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      image: req.file.path,
    });

    await product.save();

    res.status(201).json({ message: "Product Created Successfully", product });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = createProduct;
