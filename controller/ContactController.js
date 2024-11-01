const db = require('../config/database');

// Mendapatkan daftar kontak
const getContacts = (req, res) => {
const sql = 'SELECT id, name, phone_number, bio, photo FROM users';
db.query(sql, (error, results) => {
    if (error) {
    console.error('Error fetching contacts:', error);
    return res.status(500).json({ message: 'Failed to fetch contacts' });
    }
    res.status(200).json(results);
    });
};

module.exports = { getContacts };