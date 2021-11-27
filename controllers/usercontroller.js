const BigPromise = require("../middlewares/bigpromise");
const User = require("../models/user");
const { cookieToken } = require("../utils/cookietoken");
const crypto = require('crypto');
const sendmail = require("../utils/mailhelper");
exports.signup = BigPromise(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!(email && password && name)) {
    return res.send("name password and email is required");
  }
  console.log(email + " " + password + " " + name);
  const user = await User.create({
    name: name,
    email: email,
    password: password,
  });
  await cookieToken(user, res);
  next();
});
exports.login = BigPromise(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send("email and password is required");
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    res.status(404).send("user not found");
  }
  const isPasswordValidated = await user.isPasswordValidated(password);
  console.log(isPasswordValidated);
  if (!isPasswordValidated) {
    res.status(404).send("email and password does not match");
  }
  await cookieToken(user, res);
  next();
});
exports.forgotpassword = BigPromise(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).send("email is required");
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(404).send("email is not found");
  }
  const forgotPasswordToken = await user.getForgotPasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${forgotPasswordToken}`;
  try {
    const options = {
      email: email,
      subject: "Password Verification",
      text: resetPasswordUrl,
    };
    await sendmail(options);
    return res.status(200).send("Email Sent Succesfully");
  } catch {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    return res.status(501).send(Error("Error Occured"));
  }
});
exports.resetpassword = BigPromise(async (req, res, next) => {
  const {token}  = req.params;
  if (!token) {
    return res.status(400).send("token is required");
  }
  const encrtToken = crypto.createHash("sha256").digest("hex");
  const user = await User.findOne({
    encrtToken,
    forgotPasswordExpiry:{$gt:Date.now()}
  });
  if (!user) {
    return res.status(404).send("token is invalid or expired");
  }
  const password = req.body.password;
  const confirmpassword = req.body.confirmpassword;
  if(password != confirmpassword){
    return res.send(400).send("Password Does Not Match");
  }
  user.password = password;
  user.forgotPasswordExpiry=undefined;
  user.forgotPasswordToken=undefined;
  await user.save();
  await cookieToken(user,res);
  next();
});
