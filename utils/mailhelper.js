const nodemailer = require('nodemailer');

const sendmail=async function(options){
    let transporter = nodemailer.createTransport({
        host: process.env.SMPT_HOST,
        port: process.env.SMPT_PORT,
        auth: {
          user: process.env.SMPT_USER, // generated ethereal user
          pass: process.env.SMPT_PASS, // generated ethereal password
        },
      });
        await transporter.sendMail({
        from: 'no.reply@flutterstack.com', // sender address
        to: options.email, // list of receivers
        subject: options.subject, // Subject line
        text: options.text, // plain text body
      });
}

module.exports=sendmail;