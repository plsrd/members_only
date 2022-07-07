const { body, validationResult } = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.signup_get = (req, res, next) => {
  res.render('signup');
};

exports.signup_post = [
  body('firstname', 'First name is required').escape().trim().isLength(1),
  body('lastname', 'Last name is required').escape().trim().isLength(1),
  body('email', 'A valid email address is required')
    .escape()
    .trim()
    .toLowerCase()
    .isEmail()
    .custom(async email => {
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        throw new Error('Email already in use');
      }
    }),
  body('password', 'Password is required').isLength(1),
  body('passwordConfirm')
    .escape()
    .trim()
    .custom(async (passwordConfirm, { req }) => {
      if (req.body.password !== passwordConfirm) {
        throw new Error('Passwords must match');
      }
    }),
  (req, res, next) => {
    const { firstname, lastname, email, password } = req.body;

    const errors = validationResult(req);

    let user = new User({
      firstname,
      lastname,
      email,
      password,
    });

    if (!errors.isEmpty()) {
      res.render('signup', { errors: errors.array(), user });
    } else {
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return next(err);
        Object.assign(user, {
          password: hashedPassword,
          created_at: new Date(),
        });

        user.save(err => {
          if (err) return next(err);
          res.redirect('/');
        });
      });
    }
  },
];

exports.login_get = (req, res, next) => {
  res.render('login');
};

exports.login_post = passport.authenticate('local', {
  failureRedirect: '/login',
  successRedirect: '/',
});

exports.login_failure_get = (req, res, next) => {
  res.render('login', {
    error: 'Incorrect login',
  });
};
