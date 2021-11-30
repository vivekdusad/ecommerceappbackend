const express = require("express");
const {
  signup,
  login,
  forgotpassword,
  resetpassword,
  loggedInUserDashboard,
  changePassword,
  userdashboardUpdate,
  adminAllUsers,
  adminOneUser
} = require("../controllers/usercontroller");
const { customRole } = require("../middlewares/customrole");
const { isLoggedIn } = require("../middlewares/user");
const router = express.Router();

//Users All Routes
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/forgotpassword").post(forgotpassword);
router.route(`/password/reset/:token`).post(resetpassword);
router.route(`/userdashboard`).get(isLoggedIn, loggedInUserDashboard);
router.route(`/password/update`).post(isLoggedIn, changePassword);
router.route(`/userdashboard/update`).post(isLoggedIn, userdashboardUpdate);


//Admin All Routes
router.route(`/admin/users`).get(isLoggedIn, customRole('admin'),adminAllUsers);
router.route(`/admin/users/:id`).get(isLoggedIn, customRole('admin'),adminOneUser);
module.exports = router;
