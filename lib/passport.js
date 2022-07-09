const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/user');

passport.use(
  new LocalStrategy({ usernameField: 'email' }, (email, password, cb) => {
    User.findOne({ email: email }, (err, user) => {
      if (err) return cb(err);

      if (!user) return cb(null, false, { message: 'Incorrect email' });

      bcrypt.compare(password, user.password, (err, res) => {
        if (err) return cb(err);
        if (res) {
          return cb(null, user);
        } else {
          return cb(null, false, { message: 'Incorrect password' });
        }
      });
    });
  })
);

passport.serializeUser((user, done) => {
  return done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    return done(err, user);
  });
});

module.exports = passport;
