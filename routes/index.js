var express = require('express');
var router = express.Router();
const Message = require('../models/message');

const indexController = require('../controllers/indexController');

router.get('/', function (req, res, next) {
  Message.find()
    .populate('user')
    .exec((err, messages) => {
      if (err) return next(err);

      res.render('index', { title: 'Express', messages });
    });
});

router.get('/signup', indexController.signup_get);

router.post('/signup', indexController.signup_post);

router.get('/login', indexController.login_get);

router.post('/login', indexController.login_post);

router.get('/login-failure', indexController.login_failure_get);

router.get('/logout', indexController.logout_get);

router.get('/upgrade', indexController.user_upgrade_get);

router.post('/upgrade', indexController.user_upgrade_post);

router.get('/admin', indexController.admin_get);

router.post('/admin', indexController.admin_post);

module.exports = router;
