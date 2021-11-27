const express = require('express');
const { signup, login, forgotpassword, resetpassword } = require('../controllers/usercontroller');
const router = express.Router();

router.route("/signup").post(signup); 
router.route('/login').post(login);
router.route('/forgotpassword').post(forgotpassword);
router.route(`/password/reset/:token`).post(resetpassword);
module.exports = router;