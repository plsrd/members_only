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

router.get('/admin', userController.admin_get);

router.get('/prompt/create', userController.prompt_create_get);

router.post('/prompt/create', userController.prompt_create_post);

module.exports = router;
