const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendgrid = (email, data) => {
  const msg = {
    to: email,
    from: 'lockpicking-inc@no-reply.com',
    subject: 'Here is your token',
    template_id: process.env.SENDGRID_TEMPLATE,
    dynamic_template_data: data
  };
  sgMail.send(msg);
};

module.exports = sendgrid;
