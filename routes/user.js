const express = require('express');
const { signup, login } = require('../controllers/usercontroller');
const router = express.Router();

router.route("/signup").post(signup); 
router.route('/login').post(login);
module.exports = router;