var express = require('express');
var router = express.Router();

const userController = require('../controllers/userController');

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/signup', userController.signup_get);

router.post('/signup', userController.signup_post);

router.get('/login', userController.login_get);

router.post('/login', userController.login_post);

router.get('/login-failure', userController.login_failure_get);

router.get('/logout', userController.logout_get);

module.exports = router;
