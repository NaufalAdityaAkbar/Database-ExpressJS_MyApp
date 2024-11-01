const express = require('express');
const multer = require('multer');
const path = require('path');
const userController = require('../controller/RegisterController');

const router = express.Router();

// Konfigurasi Multer dengan penyimpanan file
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Routes
router.post('/register', userController.registerUser);
router.put('/profile', upload.single('photo'), userController.completeProfile); // Rute untuk menyelesaikan profil
router.post('/login', userController.loginUser);

// Middleware untuk menangani error multer
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
});

module.exports = router;
