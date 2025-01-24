const create_admin = require("./Admin-handlers/create-admin");
const admin_login = require("./Admin-handlers/admin-login");
const update_admin = require("./Admin-handlers/update-admin");
const delete_admin = require("./Admin-handlers/delete-admin");
const forgot_admin_password = require("./Admin-handlers/forgot-password-admin");

module.exports = {
  create_admin,
  admin_login,
  update_admin,
  delete_admin,
  forgot_admin_password,
};
