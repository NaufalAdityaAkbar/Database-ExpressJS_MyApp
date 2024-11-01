const db = require('../config/database');

// Ambil pesan antara dua pengguna
const getMessages = (req, res) => {
    const { sender_phone, receiver_phone } = req.params;

    const sql = `
        SELECT * FROM chats
        WHERE (sender_phone = ? AND receiver_phone = ?) 
        OR (sender_phone = ? AND receiver_phone = ?)
        ORDER BY created_at ASC
    `;

    db.query(sql, [sender_phone, receiver_phone, receiver_phone, sender_phone], (error, results) => {
        if (error) {
            console.error('Error fetching messages:', error);
            return res.status(500).json({ message: 'Error fetching messages', error: error.message });
        }
        res.status(200).json({ messages: results });
    });
};

// Kirim pesan dari satu pengguna ke pengguna lain
const sendMessage = (req, res) => {
    const { sender_phone, receiver_phone, message } = req.body;

    if (!sender_phone || !receiver_phone || !message) {
        return res.status(400).json({ message: 'Sender, receiver, and message are required' });
    }

    const sql = 'INSERT INTO chats (sender_phone, receiver_phone, message) VALUES (?, ?, ?)';
    db.query(sql, [sender_phone, receiver_phone, message], (error, results) => {
        if (error) {
            console.error('Error sending message:', error);
            return res.status(500).json({ message: 'Error sending message', error: error.message });
        }
        res.status(201).json({ message: 'Message sent successfully' });
    });
};

module.exports = { getMessages, sendMessage };
