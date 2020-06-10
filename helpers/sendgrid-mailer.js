const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const mailToken = (email, data) => {
  // data = username, token, expiration
  const msg = {
    to: email,
    from: process.env.SENDGRID_EMAIL,
    template_id: process.env.SENDGRID_TOKEN,
    dynamic_template_data: data
  };
  sgMail.send(msg);
};

const mailNewUser = (email, data) => {
  // data = username
  const msg = {
    to: email,
    from: process.env.SENDGRID_EMAIL,
    template_id: process.env.SENDGRID_NEW_USER,
    dynamic_template_data: data
  };
  sgMail.send(msg);
};

const mailUpdatedUser = (email, data) => {
  // data = currentUser, newUser
  const msg = {
    to: email,
    from: process.env.SENDGRID_EMAIL,
    template_id: process.env.SENDGRID_UPDATE,
    dynamic_template_data: data
  };
  sgMail.send(msg);
};

const mailDeletedUser = (email, data) => {
  // data = username
  const msg = {
    to: email,
    from: process.env.SENDGRID_EMAIL,
    template_id: process.env.SENDGRID_DELETED_USER,
    dynamic_template_data: data
  };
  sgMail.send(msg);
};

module.exports = {
  mailToken,
  mailNewUser,
  mailUpdatedUser,
  mailDeletedUser
};
