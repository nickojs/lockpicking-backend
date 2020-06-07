const User = require('../models/User');

const locateUsername = async (username, { req }) => {
  const { id } = req.body;
  // checks for an id and switches to 'update' validation
  if (id) {
    const user = await User.findOne({
      where: {
        id,
        username
      }
    });
    /*
      bails the validation if the username already belongs
      to the user that are currently trying to update his data
    */
    if (user) return;
  }
  // 'signup' validation
  const user = await User.findOne({ where: { username } });
  if (user) return Promise.reject();
};

const locateEmail = async (email, { req }) => {
  const { id } = req.body;
  // checks for an id and switches to 'update' validation
  if (id) {
    const user = await User.findOne({
      where: {
        id,
        email
      }
    });
    /*
      bails the validation if the email already belongs
      to the user that are currently trying to update his data
    */
    if (user) return;
  }
  // 'signup' validation
  const user = await User.findOne({ where: { email } });
  if (user) return Promise.reject();
};

const signupSchema = {
  username: {
    in: ['body'],
    isLength: {
      errorMessage: 'invalid user length',
      options: { min: 4, max: 18 }
    },
    custom: {
      options: locateUsername,
      errorMessage: 'username already in use'
    },
    trim: true
  },
  password: {
    in: ['body'],
    isLength: {
      options: { min: 8, max: 20 },
      errorMessage: 'invalid password length'
    },
    matches: {
      options: /([0-9].*[a-zA-Z])|([a-zA-Z].*[0-9])/,
      errorMessage: 'password should have at least one number and one char'
    }
  },
  email: {
    in: ['body'],
    isEmail: true,
    errorMessage: 'insert valid email',
    custom: {
      options: locateEmail,
      errorMessage: 'email already in use'
    },
    trim: true
  }
};

module.exports = {
  signupSchema
};
