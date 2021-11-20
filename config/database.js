const mongoose = require('mongoose');
const {DB_URL} = process.env;
exports.connect =()=>{
    mongoose.connect(DB_URL.toString(),{
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then(()=>{
        console.log("database connected succesfully");
    }).catch(()=>{
        console.log("databse connection failed");
    });
}