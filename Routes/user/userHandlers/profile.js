const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../middleware/authMiddleware');
const User = require('../../../models/user');

// Protected route to get user profile
const profileHandler = async (req, res) => {
    try {
        // Check if req.user is undefined
        if (!req.user) {
            return res.status(401).json({ message: 'User   not found' });
        }

        // Fetch the user profile from the request object (attached by authMiddleware)
        const user = req.user;

        // Respond with the user profile (excluding the password)
        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Export the profileHandler function
module.exports = profileHandler;