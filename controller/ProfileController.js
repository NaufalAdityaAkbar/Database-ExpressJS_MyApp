const db = require('../config/database')
const path = require('path');
// Penyelesaian profil dengan nama, bio, dan foto
const completeProfile = async (req, res) => {
    const { phone_number, name, bio } = req.body;
    const photo = req.file;
  
    // Validasi input
    if (!phone_number || !name || !bio || !photo) {
      return res.status(400).json({ message: 'Phone number, name, bio, and photo are required' });
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
  
const photoPath = path.join('uploads', photo.filename); // Path untuk foto        
  
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
      res.status(500).json({ message: 'Failed to complete profile', error: error.message });
  }
  };

  // Endpoint to get user profile data
 const getProfile = async (req, res) => {
  const { phone_number } = req.params;

  const sqlSelect = 'SELECT name, bio, photo FROM users WHERE phone_number = ?';
  db.query(sqlSelect, [phone_number], (error, results) => {
      if (error) {
          console.error('Error fetching profile:', error);
          return res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
      }

      if (results.length === 0) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json(results[0]); // Send back the first result
  });
};

module.exports = {completeProfile, getProfile};