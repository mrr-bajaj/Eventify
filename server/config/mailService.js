const nodemailer = require("nodemailer");

const mailConfig =  nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.ID,
    pass: process.env.PASSWORD,
  }
});


module.exports = mailConfig;