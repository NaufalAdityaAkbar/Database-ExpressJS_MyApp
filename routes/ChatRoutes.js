const express = require('express');
const chatController = require('../controller/ChatController');

const router = express.Router();

// Route untuk mendapatkan pesan antara dua pengguna
router.get('/messages/:sender_phone/:receiver_phone', chatController.getMessages);

// Route untuk mengirim pesan
router.post('/send', chatController.sendMessage);

// Route untuk mendapatkan daftar chat
router.get('/chat/list/:phoneNumber', chatController.getChats);

// Route untuk menandai pesan sebagai dibaca
router.put('/messages/read/:sender_phone/:receiver_phone', chatController.markAsRead);

// Route untuk mendapatkan total jumlah pesan yang belum dibaca
router.get('/chats/total-unread/:phoneNumber', chatController.getTotalUnreadCount);

// Route untuk menghapus chat
router.delete('/chat/delete/:loggedInPhoneNumber/:contactPhoneNumber', chatController.deleteChat);

module.exports = router;
