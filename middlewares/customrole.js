const User= require('../models/user');
const { isLoggedIn } = require('./user');

exports.customRole=(...roles)=>{
    return async (req,res,next)=>{
        const user = await User.findById(req.user.id);
        const isAllowed = roles.includes(user.role);
        console.log(`roles==${roles} &&& user.role===${user.role} &&& isAllowed===${isAllowed}`);
        if(!isAllowed){
            next(Error("You are not allowed to authorize this resource"));
        }
        next();
    }
}