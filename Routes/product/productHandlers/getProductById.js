const Product = require('../../../models/product');

/**
 * Get a product by its ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;

        // Validate input
        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        // Find the product by ID
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Respond with the product details
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = getProductById;