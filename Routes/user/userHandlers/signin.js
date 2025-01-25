const jwt = require("jsonwebtoken");
const User = require("../../../models/user"); // Ensure consistent naming (capitalized for models)

const signin = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" }); // Generic message for security
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" }); // Generic message for security
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set token in a cookie with expiry time
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: false, // Set to false for local development
      expires: new Date(Date.now() + 3600000), // 1 hour expiry
    });

    // Respond with token and user data
    res.status(200).json({ token, user }); // Include user data in the response
  } catch (error) {
    console.error("Signin error:", error); // Log the error for debugging
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = signin;
