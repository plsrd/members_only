const { body, validationResult } = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Prompt = require('../models/prompt');

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
  }),
  (req, res, next) => {
    User.findById(req.user._id).exec((err, user) => {
      if (err) next(err);
      Object.assign(user, { logins: [...user.logins, new Date()] });

      user.save((err, updatedUser) => {
        if (err) next(err);
        console.log(updatedUser);
        res.redirect('/');
      });
    });
  },
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

exports.user_profile_get = (req, res, next) => {
  User.findById(req.user._id).exec((err, user) => {
    if (err) next(err);

    if (!user) res.redirect('/', { error: 'User profile not found.' });

    res.render('profile', { user });
  });
};

exports.user_upgrade_get = (req, res, next) => {
  Prompt.find().exec((err, prompts) => {
    if (err) next(err);
    res.render('upgrade_form', { prompts });
  });
};

exports.user_upgrade_post = [
  body('question1')
    .trim()
    .escape()
    .toLowerCase()
    .custom(async question => {}),
  body('question2').trim().escape().toLowerCase(),
  body('question2').trim().escape().toLowerCase(),
];

exports.admin_get = (req, res, next) => {
  Prompt.find().exec((err, prompts) => {
    if (err) next(err);
    res.render('admin', { prompts });
  });
};

exports.prompt_create_get = (req, res, next) => {
  res.render('prompt-form');
};

exports.prompt_create_post = [
  body('question').trim().escape(),
  body('answer').trim().escape().toLowerCase(),
  (req, res, next) => {
    const { question, answer } = req.body;

    let prompt = new Prompt({
      question,
      answer,
    });

    prompt.save(err => {
      if (err) next(err);
      res.redirect('/admin');
    });
  },
];

// exports.user_profile_update_get = (req, res, next) => {
//   res.render('profile-update-form');
// };

// exports.user_profile_update_post = (req, res, next) => {

// }
