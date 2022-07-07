const { body, validationResult } = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.signup_get = (req, res, next) => {
  res.render('signup-form');
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
  body(
    'password',
    'Password must be at least 8 characters and include 1 of each of the following: uppercase, lowercase, number, special character'
  )
    .trim()
    .escape()
    .isStrongPassword(),
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
      res.render('signup-form', { errors: errors.array(), user });
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
  res.render('login-form');
};

exports.login_post = [
  body('email').trim().escape(),
  body('password').trim().escape(),
  passport.authenticate('local', {
    failureRedirect: '/login-failure',
    successRedirect: '/',
  }),
];

exports.login_failure_get = (req, res, next) => {
  res.render('login-form', {
    error: 'Incorrect login',
  });
};

exports.logout_get = (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect('/');
  });
};
