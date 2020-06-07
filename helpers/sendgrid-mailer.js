const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const mailToken = (email, data) => {
  const msg = {
    to: email,
    from: process.env.SENDGRID_EMAIL,
    template_id: process.env.SENDGRID_TOKEN_TEMPLATE,
    dynamic_template_data: data
  };
  sgMail.send(msg);
};

const mailNewUser = (email, data) => {
  const msg = {
    to: email,
    from: process.env.SENDGRID_EMAIL,
    template_id: process.env.SENDGRID_UPDATE_TEMPLATE,
    dynamic_template_data: data
  };
  sgMail.send(msg);
};

module.exports = {
  mailToken,
  mailNewUser
};
