const User = require("../../../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const signup = async (req, res) => {
  const { name, email, password, confirmPassword, phone } = req.body;

  // Validate input
  if (!name || !email || !password || !phone || !confirmPassword) {
    return res.status(400).json({
      message: "Name, email, confirmPassword and password are required",
    });
  }

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
      log("User already exists");
    } else {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      user = new User({ name, email, password: hashedPassword, phone });
      await user.save();

      // Generate JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      // Set token in a cookie
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: false, // Set to false for local development
      });

      // Log successful signup
      console.log(`User signed up successfully: ${user.email}`);
    }

    // Respond with token and user data
    res.status(201).json({ token, user }); // Include user data in the response
  } catch (error) {
    console.error("Error in /signup:", error.message);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = signup;
