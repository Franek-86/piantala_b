const { text } = require("body-parser");

const emailToBeSent = (email, user) => {
  return {
    from: "franekdev86@gmail.com",
    to: email,
    subject: "Email Verification",
    html: `<p>Completa la tua registrazione cliccando su <a href="${
      process.env.NODE_ENV === "test"
        ? process.env.DOMAIN_NAME_TEST_SERVER
        : process.env.DOMAIN_NAME_SERVER
    }/api/auth/verify/${
      user.verification_token
    }"target="_blank"">questo link</span>
    </a>. Grazie!</p>`,
  };
};
module.exports = emailToBeSent;
