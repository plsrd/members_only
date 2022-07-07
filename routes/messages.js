const express = require('Express');
const router = express.Router();

const messagesController = require('../controllers/messagesController');

router.get('/create', messagesController.message_create_get);

router.post('/create', messagesController.message_create_post);

module.exports = router;
