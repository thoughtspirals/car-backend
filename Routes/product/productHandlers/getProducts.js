const Product = require('../../../models/product');

/**
 * Get all products
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getProducts = async (req, res) => {
    try {
        // Fetch all products from the database
        const products = await Product.find({});

        // Respond with the list of products
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = getProducts;