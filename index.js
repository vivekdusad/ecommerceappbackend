require('dotenv').config();
const app = require('./app');
const { connect } = require('./config/database');

//connect with database
connect();

const PORT = 4000;
console.log(PORT);
app.listen(PORT,()=>"server is listning"+PORT);


