const nodeMailer = require("nodemailer");

//SMTP is simple mail transfer protocol jeczaonjrnquodrg owhkaiirlpagvpfo jifmtmhfmfnsvpgr  lfvicuglworgwugn

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    service: process.env.SMPT_SERVICE,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
    attachments: options.attachments || [], // Add support for attachments
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;