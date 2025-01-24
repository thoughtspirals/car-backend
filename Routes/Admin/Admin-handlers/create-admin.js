const Admin = require("../../../models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const create_admin = async (req, res) => {
  const { username, name, title, email, password, phone } = req.body;

  // Validate input
  if (!name || !username || !title || !email || !password || !phone) {
    return res.status(400).json({
      message: "Name, email, title, username, phone and password are required",
    });
  }

  try {
    // Check if user already exists
    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({
        message: "Admin with this email already exists",
      });
    } else {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      // Create new admin
      admin = new Admin({
        username,
        name,
        title,
        email,
        password: hashedPassword,
        phone,
      });
      await admin.save();

      // Generate JWT token
      const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.json({ token, admin });
    }
  } catch (error) {
    console.error("Error in /create-admin:", error.message);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
module.exports = create_admin;
