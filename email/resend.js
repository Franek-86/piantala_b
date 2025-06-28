const { Resend } = require("resend");
const verificationEmailHTML = require("./templates/verificationEmailTemplate");
const passwordResetEmailHTML = require("./templates/passwordResetEmailTemplate");
const paymentConfirmationEmailHTML = require("./templates/paymentConfirmationEmailHML");
const resend = new Resend(process.env.RESEND);

const sendVerificationEmail = async (a, b, c) => {
  console.log("send sta qui");
  // const verificationUrl = `${
  //   process.env.NODE_ENV === "test"
  //     ? process.env.DOMAIN_NAME_TEST_CLIENT
  //     : process.env.DOMAIN_NAME_CLIENT
  // }/api/auth/verify/${c.verification_token}`;
  const verificationUrl = `${
    process.env.NODE_ENV === "test"
      ? process.env.DOMAIN_NAME_TEST_CLIENT
      : process.env.DOMAIN_NAME_CLIENT
  }/verify/${c.verification_token}`;
  const emailBody = verificationEmailHTML(a, verificationUrl);
  try {
    await resend.emails.send({
      from: "Ti Pianto Per Amore <postmaster@ernestverner.it>",
      to: [a],
      subject: "Verifica indirizzo mail",
      html: emailBody,
    });
    return;
  } catch (error) {
    return console.error({ error });
  }
};
const sendPasswordResetEmail = async (a, b, c) => {
  console.log("send sta qui");
  // const verificationUrl = `${
  //   process.env.NODE_ENV === "test"
  //     ? process.env.DOMAIN_NAME_TEST_SERVER
  //     : process.env.DOMAIN_NAME_SERVER
  // }/api/auth/verify/${c.verification_token}`;
  const emailBody = passwordResetEmailHTML(a, b, c);
  try {
    await resend.emails.send({
      from: "Ti Pianto Per Amore <postmaster@ernestverner.it>",
      to: [a],
      subject: "Password reset",
      html: emailBody,
    });
    return;
  } catch (error) {
    return console.error({ error });
  }
};

const sendPaymentConfirmationEmail = async (a, b, c) => {
  console.log("send sta qui");
  // const verificationUrl = `${
  //   process.env.NODE_ENV === "test"
  //     ? process.env.DOMAIN_NAME_TEST_SERVER
  //     : process.env.DOMAIN_NAME_SERVER
  // }/api/auth/verify/${c.verification_token}`;
  const emailBody = paymentConfirmationEmailHTML(a, b, c);
  try {
    await resend.emails.send({
      from: "Ti Pianto Per Amore <postmaster@ernestverner.it>",
      to: [a],
      subject: "Conferma di pagamento",
      html: emailBody,
    });
    return;
  } catch (error) {
    return console.error({ error });
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendPaymentConfirmationEmail,
};
