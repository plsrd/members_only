var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/profile', userController.user_profile_get);

router.get('/upgrade', userController.user_upgrade_get);

// router.get('/profile/update', userController.user_profile_update_get);

module.exports = router;
