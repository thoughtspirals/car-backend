const jwt = require("jsonwebtoken");
const Admin = require("../../../models/Admin");

const admin_login = async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    // Check if user exists
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set token in a cookie
    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure in production
      sameSite: "Strict", // Strict cookie sharing
      expires: new Date(Date.now() + 3600000), // Expires in 1 hour
    });

    // Exclude password field and send the admin data (excluding sensitive fields)
    const { password: passwordField, ...safeUserData } = admin._doc; // Exclude password from the response
    res.status(200).json({ token, admin: safeUserData });
  } catch (error) {
    console.error(`[Admin Login Error]: ${error.message}`, error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = admin_login;
