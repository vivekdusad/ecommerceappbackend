const mongoose = require('mongoose');
const { Schema } = mongoose;
const bycrypt = require('bcryptjs');
var validator = require('validator');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const userSchema = Schema({
    name: {
        type: String,
        required: [true, "Please provide name"],
        maxLength: [40, "must be smaller than 40"],
    },
    email: {
        type: String,
        required: [true, "Please provide name"],
        maxLength: [40, "must be smaller than 40"],
        validate: [validator.isEmail, "must be an email"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "please provide pasword"],
        select: false,
        minLength: [6, "password must be greater than 6"],
    },
    role: {
        type: String,
        default: 'user'
    },
    photo: {
        id: {
            // required: true,
            type: String
        },
        secure_url: {
            type: String,
            // required: true
        }
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    createdAt: {
        type: Date,
        default: Date.now(),
    }
});

userSchema.pre('save',async function (next) {
    if (!this.isModified('password')){
        return next();
    }
    this.password = await bycrypt.hash(this.password, 10);
    console.log(this.password);
    next();
});
//validate the password with the userpassword
userSchema.methods.isPasswordValidated = async function (userpassword) {
    return await bycrypt.compare(userpassword, this.password);
}
//create and return jwt token
userSchema.methods.getjwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRAT_KEY, {
        expiresIn: process.env.JWT_EXPIREY
    });
}

userSchema.methods.getForgotPasswordToken = function () {
    let forgotToken = crypto.randomBytes(20).toString('hex');
    this.forgotPasswordToken = crypto.createHash('sha256').digest("hex");
    this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;
    return forgotToken;
}


module.exports = mongoose.model('User', userSchema);