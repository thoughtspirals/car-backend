const signupHandler = require("./signup");
const signinHandler = require("./signin");
const profileHandler = require("./profile");
const updateProfile = require("./updateProfile");
const deleteProfile = require("./deleteProfile");
const passwordUpdate = require("./passwordUpdate");
const forgotPassword = require("./forgotPassword");
const resetPassword = require("./resetPassword");
const logoutHandler = require("./logout");

module.exports = {
  signupHandler,
  signinHandler,
  profileHandler,
  updateProfile,
  deleteProfile,
  passwordUpdate,
  forgotPassword,
  resetPassword,
  logoutHandler,
};
