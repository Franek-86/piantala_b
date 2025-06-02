const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: "8e9587001@smtp-brevo.com",
    pass: process.env.EMAIL_PASSWORD,
  },
});

module.exports = transporter;
