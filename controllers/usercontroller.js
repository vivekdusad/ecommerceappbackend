const BigPromise = require("../middlewares/bigpromise");
const User = require('../models/user');
const cookieToken = require('../utils/cookietoken');
exports.signup = BigPromise(async(req,res,next)=>{
    const {name,email,password} = req.body;
    if(!(email&&password&&name)){
        return res.send("name password and email is required");
    }
    console.log(email+" "+password+" "+name);
    const user = await User.create({
        name:"vivek khandelwal",
        email:"vivekdusad55@gmail.com",
        password:"vivekdusad"
    });
    const token = user.getjwtToken();
    console.log(token);
    var options = {
        expires:Date(
            Date.now()+3*60*60*24*1000
        ),
        httpOnly:true
    }
    res.cookie('token',token,options).json({
        success:true,
        user
    });
    next();
})