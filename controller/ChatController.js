const db = require('../config/database');


// Ambil pesan antara dua pengguna
const getMessages = (req, res) => {
    const { sender_phone, receiver_phone } = req.params;

    const fetchMessagesSql = `
        SELECT message, sender_phone, receiver_phone, created_at, unread_count 
        FROM chats
        WHERE (sender_phone = ? AND receiver_phone = ?) 
        OR (sender_phone = ? AND receiver_phone = ?)
        ORDER BY created_at ASC
    `;

    db.query(fetchMessagesSql, [sender_phone, receiver_phone, receiver_phone, sender_phone], (error, results) => {
        if (error) {
            console.error('Error fetching messages:', error);
            return res.status(500).json({ message: 'Error fetching messages', error: error.message });
        }
        res.status(200).json({ messages: results });
    });
};

// Menandai pesan sebagai dibaca
const markAsRead = (req, res) => {
    const { sender_phone, receiver_phone } = req.params;

    const sql = `
        UPDATE chats 
        SET unread_count = 0 
        WHERE sender_phone = ? AND receiver_phone = ? AND unread_count > 0
    `;

    db.query(sql, [sender_phone, receiver_phone], (error) => {
        if (error) {
            console.error('Error marking messages as read:', error);
            return res.status(500).json({ message: 'Error marking messages as read', error: error.message });
        }
        res.status(200).json({ message: 'Messages marked as read successfully' });
    });
};



// Kirim pesan dari satu pengguna ke pengguna lain
const sendMessage = (req, res) => {
    const { sender_phone, receiver_phone, message } = req.body;

    const sql = `
        INSERT INTO chats (sender_phone, receiver_phone, message, unread_count, created_at)
        VALUES (?, ?, ?, 1, NOW())
    `;

    db.query(sql, [sender_phone, receiver_phone, message], (error) => {
        if (error) {
            console.error('Error sending message:', error);
            return res.status(500).json({ message: 'Error sending message', error: error.message });
        }
        res.status(200).json({ message: 'Message sent successfully' });
    });
};



//Tampilan ChatPage
const getChats = (req, res) => {
    const { phoneNumber } = req.params;

    const sql = `
        SELECT 
            CASE 
                WHEN c.sender_phone = ? THEN c.receiver_phone 
                ELSE c.sender_phone 
            END AS contact_phone,
            u.name AS contact_name, 
            u.photo,
            MAX(c.message) AS message,  -- Use MAX to get the latest message
            SUM(CASE 
                    WHEN c.sender_phone != ? AND c.unread_count > 0 THEN c.unread_count 
                    ELSE 0 
                END) AS total_unread,
            MAX(c.created_at) AS created_at
        FROM chats c
        JOIN users u ON u.phone_number = CASE 
                                            WHEN c.sender_phone = ? THEN c.receiver_phone 
                                            ELSE c.sender_phone 
                                         END
        WHERE (c.sender_phone = ? OR c.receiver_phone = ?)
        GROUP BY contact_phone, contact_name, u.photo
        ORDER BY created_at DESC;
    `;

    db.query(sql, [phoneNumber, phoneNumber, phoneNumber, phoneNumber, phoneNumber], (error, results) => {
        if (error) {
            console.error('Error fetching chats:', error);
            return res.status(500).json({ message: 'Error fetching chats', error: error.message });
        }

        // Return the results
        res.status(200).json(results);
    });
};





const getTotalUnreadCount = (req, res) => {
    const { phoneNumber } = req.params;

    const sql = `
        SELECT SUM(unread_count) AS total_unread
        FROM chats
        WHERE receiver_phone = ? AND unread_count > 0
    `;

    db.query(sql, [phoneNumber], (error, results) => {
        if (error) {
            console.error('Error fetching total unread count:', error);
            return res.status(500).json({ message: 'Error fetching total unread count', error: error.message });
        }
        res.status(200).json(results[0]);
    });
};



module.exports = { getMessages, sendMessage, getChats, markAsRead, getTotalUnreadCount };
