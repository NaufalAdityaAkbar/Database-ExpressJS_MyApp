const db = require('../config/database');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'log0990'; // Gantilah dengan kunci rahasia yang lebih kuat

// Fungsi untuk membuat token JWT
const createToken = (user) => {
  return jwt.sign({ userId: user.id, phone_number: user.phone_number }, JWT_SECRET, { expiresIn: '1h' });
};

// Registrasi awal hanya dengan nomor telepon
const registerUser = async (req, res) => {
  const { phone_number } = req.body;

  // Validasi input
  if (!phone_number) {
    return res.status(400).json({ message: 'Nomor telepon harus diisi.' });
  }

  try {
    // Periksa apakah nomor telepon sudah terdaftar
    const sqlCheck = 'SELECT * FROM users WHERE phone_number = ?';
    db.query(sqlCheck, [phone_number], (error, results) => {
      if (error) {
        console.error('Kesalahan saat memeriksa nomor telepon:', error);
        return res.status(500).json({ message: 'Pendaftaran gagal', error: error.message });
      }

      // Jika nomor telepon sudah terdaftar
      if (results.length > 0) {
        return res.status(409).json({ message: 'Nomor telepon sudah terdaftar.' });
      }

      // Jika belum terdaftar, lakukan pendaftaran
      const sql = 'INSERT INTO users (phone_number) VALUES (?)';
      db.query(sql, [phone_number], (error, results) => {
        if (error) {
          console.error('Kesalahan saat pendaftaran:', error);
          return res.status(500).json({ message: 'Pendaftaran gagal', error: error.message });
        }

        // Buat token JWT untuk pengguna yang baru terdaftar
        const token = createToken({ id: results.insertId, phone_number });

        res.status(201).json({ message: 'Pengguna berhasil terdaftar', userId: results.insertId, token });
      });
    });
  } catch (error) {
    console.error('Kesalahan saat pendaftaran:', error);
    res.status(500).json({ message: 'Pendaftaran gagal', error: error.message });
  }
};

// Login menggunakan nomor telepon
const loginUser = async (req, res) => {
  const { phone_number } = req.body;

  // Validasi input
  if (!phone_number) {
    return res.status(400).json({ message: 'Nomor telepon harus diisi.' });
  }

  try {
    const sql = 'SELECT * FROM users WHERE phone_number = ?';
    db.query(sql, [phone_number], (error, results) => {
      if (error) {
        console.error('Kesalahan saat login:', error);
        return res.status(500).json({ message: 'Login gagal', error: error.message });
      }

      // Jika pengguna tidak ditemukan
      if (results.length === 0) {
        return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
      }

      // Membuat token JWT
      const token = createToken(results[0]);

      // Mengembalikan response login berhasil
      res.status(200).json({ message: 'Login berhasil', user: results[0], token });
    });
  } catch (error) {
    console.error('Kesalahan saat login:', error);
    res.status(500).json({ message: 'Login gagal', error: error.message });
  }
};

// Ekspor fungsi untuk digunakan di route
module.exports = { registerUser, loginUser };
