const express = require('express');
const chatController = require('../controller/ChatController');

const router = express.Router();

// Route untuk mendapatkan pesan antara dua pengguna
router.get('/messages/:sender_phone/:receiver_phone', chatController.getMessages);

// Route untuk mengirim pesan
router.post('/send', chatController.sendMessage);

module.exports = router;
