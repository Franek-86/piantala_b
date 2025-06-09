const Recipient = require("mailersend").Recipient;
const EmailParams = require("mailersend").EmailParams;
const { MailerSend } = require("mailersend");

const mailersend = new MailerSend({
  apiKey: process.env.MAILER_SEND,
});

const sendVerificationEmail = (a, b, c) => {
  const recipients = [new Recipient(a, b)];
  const verificationUrl = `${
    process.env.NODE_ENV === "test"
      ? process.env.DOMAIN_NAME_TEST_SERVER
      : process.env.DOMAIN_NAME_SERVER
  }/api/auth/verify/${c.verification_token}`;
  const personalization = [
    {
      email: a,
      data: {
        verification_url: verificationUrl,
      },
    },
  ];

  const emailParams = new EmailParams();
  emailParams.setFrom({
    email: "postmaster@ernestverner.it",
    name: "Ti Pianto Per Amore",
  });
  emailParams.setTo(recipients);
  emailParams.setSubject("Verifica indirizzo mail");
  emailParams.setTemplateId("v69oxl5y2pk4785k");
  emailParams.setPersonalization(personalization);

  return mailersend.email.send(emailParams);
};
module.exports = sendVerificationEmail;
