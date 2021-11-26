const BigPromise = require("../middlewares/bigpromise");
const User = require("../models/user");
const { cookieToken } = require("../utils/cookietoken");
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
    res.status(400).send("email is required");
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    res.status(404).send("email is not found");
  }
  const forgotPasswordToken = await user.getForgotPasswordToken();
  const resetPasswordUrl = `${res.protocol}://${res.get(
    "host"
  )}/reset/password/${forgotPasswordToken}`;
  try {
    //!send email here
    const options = {
      email: email,
      subject: "Password Verification",
      text: resetPasswordUrl,
    };
    await sendmail(options);
  } catch {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    res.status(500).send("Error Occured");
  }
});
