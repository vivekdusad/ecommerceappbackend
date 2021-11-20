require('dotenv');
const express = require('express');

const app = express();
const morgan = require('morgan');
//middle ware for cookie parsing
const cookiePareser = require('cookie-parser');
app.use(cookiePareser());
//middleware for fileupload
const fileupload = require('express-fileupload');
app.use(fileupload());

//regular middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const home = require('./routes/home');
const user = require('./routes/user');

app.use("/api/v1",home);
app.use("/api/v1",user);
module.exports = app;