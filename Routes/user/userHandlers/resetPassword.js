const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../../models/user");

const resetPassword = async (req, res) => {
  const { newPassword, confirmPassword } = req.body;

  const resetToken = req.cookies.resetToken; // Read the reset_token from the cookies
  const token = resetToken; // Define the token variable

  // Validate input
  if (!token || !newPassword || !confirmPassword) {
    return res.status(400).json({
      message: "Token, new password, and confirm password are required",
    });
  }

  if (newPassword.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters long" });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);

    // Find the user by the decoded ID and check if the token is valid
    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() }, // Ensure the token is not expired
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear the reset token fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // Save the updated user
    await user.save();

    // Respond with success message
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.log("Error:", error);
    console.log("Error Message:", error.message);
    console.log("Error Stack:", error.stack);

    // Handle specific JWT errors
    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({ message: "Invalid token" });
    } else if (error.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Token has expired" });
    }

    // Handle other unexpected errors
    res
      .status(500)
      .json({ message: "An error occurred while resetting the password" });
  }
};

module.exports = resetPassword;
