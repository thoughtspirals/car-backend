const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../middleware/authMiddleware');
const User = require('../../../models/user');

// Update user profile
const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;

        // Validate input
        if (!name && !email) {
            return res.status(400).json({ message: 'At least one field is required to update' });
        }

        // Find user and update profile
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields
        if (name) user.name = name;
        if (email) user.email = email;

        await user.save();

        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            message: 'Profile updated successfully',
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Export the updateProfile function
module.exports = updateProfile;
