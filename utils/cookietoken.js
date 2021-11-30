exports.cookieToken =async function (user, res) {
  var options = {
    expire:3*60*60*1000,
    httpOnly: true,
  };
  user.password = undefined;
  const token = await user.getjwtToken();
  res.cookie("token", token, options).json({
    success: true,
    token,
    user,
  });
};
