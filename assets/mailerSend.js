const { Recipient, EmailParams, MailerSend } = require("mailersend");

const mailersend = new MailerSend({
  apiKey: process.env.MAILER_SEND, // Replace with your real key or use env vars
});
// console.log("mailersend object:", mailersend);
console.log("typeof mailersend:", typeof mailersend);
console.log("mailersend.send exists?", typeof mailersend.send === "function");
console.log("MailerSend object keys:", Object.keys(mailersend));
function sendVerificationEmail(recipientEmail, recipientName, user) {
  const verificationUrl = `${
    process.env.NODE_ENV === "test"
      ? process.env.DOMAIN_NAME_TEST_SERVER
      : process.env.DOMAIN_NAME_SERVER
  }/api/auth/verify/${user.verification_token}`;
  const recipients = [new Recipient(recipientEmail, recipientName)];

  const personalization = [
    {
      email: recipientEmail,
      data: {
        verification_url: verificationUrl,
      },
    },
  ];

  const emailParams = new EmailParams();
  emailParams.setFrom({
    email: "postmaster@ernestverner.it",
    name: "Ti Pianto Per Amore",
  }); // single object instead of two calls
  // .setFrom("postmaster@ernestverner.it") // Your verified sender
  // .setFromName("Ti Pianto Per Amore") // Sender name
  emailParams.setTo(recipients);
  emailParams.setSubject("Verifica il tuo indirizzo mail");
  emailParams.setTemplateId("v69oxl5y2pk4785k"); // Your MailerSend template ID
  emailParams.setPersonalization(personalization);

  return mailersend.email.send(emailParams);
}

module.exports = sendVerificationEmail;
