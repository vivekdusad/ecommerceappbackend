const BigPromise = require("../middlewares/bigpromise");
const {User} = require('../models/user');
const cookieToken = require('../utils/cookietoken');
exports.signup = BigPromise(async(req,res,next)=>{
    const {name,email,password} = req.body;
    if(!email||password||name){
        res.send(Error("Name,Password and Email are required"));
    }
    console.log(email+" "+password+" "+name);
    let user = await User.create({
        name,
        email,
        password
    }).catch(console.log((error)=>console.log(error)));
    const token = user.getjwtToken();
    var options = {
        expires:Date(
            Date.now()+3*60*60*24*1000
        ),
        httpOnly:true
    }
    res.cookie({
        success:true,
        token:token,
        user
    },options);
    next();
})