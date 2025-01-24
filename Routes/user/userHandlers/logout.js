const logout = async (req, res) => {
  try {
    await req.session.destroy((err) => {
      if (err) {
        throw err;
      }
    });
    res.clearCookie("auth_token"); // Replace "authToken" with your cookie name
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ message: "Error logging out" });
  }
};

module.exports = logout;
