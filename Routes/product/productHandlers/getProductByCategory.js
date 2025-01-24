const Product = require('../../../models/product');

/**
 * Get products by category
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getProductByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        // Validate input
        if (!category) {
            return res.status(400).json({ message: 'Category is required' });
        }

        // Find products by category
        const products = await Product.find({ category });

        // Check if products exist for the given category
        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found for this category' });
        }

        // Respond with the list of products
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = getProductByCategory;