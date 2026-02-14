
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.post('/register', chatController.register);
router.post('/login', chatController.login);
router.post('/send', chatController.sendMessage);
router.get('/', chatController.getMessages);

module.exports = router;
