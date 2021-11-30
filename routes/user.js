const express = require("express");
const {
  signup,
  login,
  forgotpassword,
  resetpassword,
  loggedInUserDashboard,
  changePassword,
  userdashboardUpdate,
} = require("../controllers/usercontroller");
const { isLoggedIn } = require("../middlewares/user");
const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/forgotpassword").post(forgotpassword);
router.route(`/password/reset/:token`).post(resetpassword);
router.route(`/userdashboard`).get(isLoggedIn, loggedInUserDashboard);
router.route(`/password/update`).post(isLoggedIn, changePassword);
router.route(`/userdashboard/update`).post(isLoggedIn, userdashboardUpdate);
module.exports = router;
