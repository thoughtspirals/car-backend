const Product = require('../../../models/product');

/**
 * Update a product by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const { name, description, price, category, stock, image } = req.body;

        // Validate input
        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        // Check if at least one field is provided for update
        if (!name && !description && !price && !category && !stock && !image) {
            return res.status(400).json({ message: 'At least one field is required to update' });
        }

        // Find the product by ID
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Update the product fields if provided
        if (name) product.name = name;
        if (description) product.description = description;
        if (price) product.price = price;
        if (category) product.category = category;
        if (stock) product.stock = stock;
        if (image) product.image = image;

        // Save the updated product
        await product.save();

        // Respond with the updated product
        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = updateProduct;