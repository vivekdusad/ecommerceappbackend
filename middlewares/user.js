const User = require("../models/user");
const BigPromise = require("../middlewares/bigpromise");
const jwt= require('jsonwebtoken');

exports.isLoggedIn = BigPromise(async(req,res,next)=>{
    const token = req.cookies.token||req.header("Authorization").replace("Bearer ","");
    console.log(token);
    if(!token){
        next(Error("please send token"),);
    }
    console.log("reached herer");
    const decoded =jwt.verify(token,process.env.JWT_SECRAT_KEY);
    req.user = await User.findById(decoded.id);
    next();
});
