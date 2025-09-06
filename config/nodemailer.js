const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "franekdev86@gmail.com",
    pass: process.env.EMAIL_PASSWORD,
  },
});

module.exports = transporter;
// pass: process.env.EMAIL_PASSWORD,
