const { body, validationResult } = require('express-validator');
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
    .isEmail(),
  body(
    'password',
    'Password must be at least 8 character, with 1 lowercase & uppercase letter, as well as 1 number & symbol'
  )
    .escape()
    .trim()
    .isStrongPassword(),
  body('passwordConfirm')
    .escape()
    .trim()
    .custom(async (passwordConfirm, { req }) => {
      if (req.body.password !== passwordConfirm)
        throw new Error('Passowords must match');
    }),
  (req, res, next) => {
    const { firstname, lastname, email, password } = req.body;

    User.findOne({ email }).exec((err, user) => {
      if (err) return next(err);

      const errors = validationResult(req);

      if (user) errors.errors.push({ msg: 'Email already in use' });

      console.log(errors);

      if (!errors.isEmpty()) {
        res.render('signup', { errors });
      } else {
        bcrypt.hash(password, 10, (err, hashedPassword) => {
          if (err) return next(err);

          new User({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            created_at: new Date(),
          }).save((err, newUser) => {
            if (err) return next(err);
            console.log(newUser);
            res.redirect('/');
          });
        });
      }
    });
  },
];
