const jwt = require("jsonwebtoken");
const Admin = require("../../../models/Admin");

const admin_login = async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Check if user exists
    const user = await Admin.findOne({ username });
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

    // Set token in a cookie
    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: false, // Set to false for local development
    });

    // Respond with token and user data
    res.status(200).json({ token, user }); // Include user data in the response
  } catch (error) {
    console.error("Signin error:", error); // Log the error for debugging
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = admin_login;
