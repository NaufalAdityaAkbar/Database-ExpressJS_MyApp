const db = require('../config/database');
const path = require('path');

// Registrasi awal hanya dengan nomor telepon
const registerUser = async (req, res) => {
  const { phone_number } = req.body;

  if (!phone_number) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  try {
    const sqlCheck = 'SELECT * FROM users WHERE phone_number = ?';
    db.query(sqlCheck, [phone_number], (error, results) => {
      if (error) {
        console.error('Error checking phone number:', error);
        return res.status(500).json({ message: 'Registration failed', error: error.message });
      }

      if (results.length > 0) {
        return res.status(409).json({ message: 'Phone number already registered' });
      }

      const sql = 'INSERT INTO users (phone_number) VALUES (?)';
      db.query(sql, [phone_number], (error, results) => {
        if (error) {
          console.error('Error during registration:', error);
          return res.status(500).json({ message: 'Registration failed', error: error.message });
        }
        res.status(201).json({ message: 'User registered successfully', userId: results.insertId });
      });
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// Penyelesaian profil dengan nama, bio, dan foto
const completeProfile = async (req, res) => {
  const { phone_number, name, bio } = req.body;
  const photo = req.file;

  if (!phone_number || !name || !photo) {
    return res.status(400).json({ message: 'Phone number, name, and photo are required' });
  }

  try {
    const sqlSelect = 'SELECT * FROM users WHERE phone_number = ?';
    db.query(sqlSelect, [phone_number], (error, results) => {
      if (error) {
        console.error('Error finding user:', error);
        return res.status(500).json({ message: 'Failed to find user', error: error.message });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const photoPath = path.join('uploads', photo.filename);

      const sqlUpdate = 'UPDATE users SET name = ?, bio = ?, photo = ? WHERE phone_number = ?';
      db.query(sqlUpdate, [name, bio, photoPath, phone_number], (error, results) => {
        if (error) {
          console.error('Error updating profile:', error);
          return res.status(500).json({ message: 'Failed to complete profile', error: error.message });
        }
        res.status(200).json({ message: 'Profile completed successfully' });
      });
    });
  } catch (error) {
    console.error('Error completing profile:', error);
    res.status(500).json({ message: 'Failed to complete profile', error: error.message });
  }
};

// Login menggunakan nomor telepon
const loginUser = async (req, res) => {
  const { phone_number } = req.body;

  if (!phone_number) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  try {
    const sql = 'SELECT * FROM users WHERE phone_number = ?';
    db.query(sql, [phone_number], (error, results) => {
      if (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Login failed', error: error.message });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ message: 'Login successful', user: results[0] });
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

module.exports = { registerUser, completeProfile, loginUser };
