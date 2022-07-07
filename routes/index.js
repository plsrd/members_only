var express = require('express');
var router = express.Router();
const Message = require('../models/message');

const userController = require('../controllers/userController');

router.get('/', function (req, res, next) {
  Message.find()
    .populate('user')
    .exec((err, messages) => {
      if (err) return next(err);

      console.log(messages);

      res.render('index', { title: 'Express', messages });
    });
});

router.get('/signup', userController.signup_get);

router.post('/signup', userController.signup_post);

router.get('/login', userController.login_get);

router.post('/login', userController.login_post);

router.get('/login-failure', userController.login_failure_get);

router.get('/logout', userController.logout_get);

module.exports = router;
