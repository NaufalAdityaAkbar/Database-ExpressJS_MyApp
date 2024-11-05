const express = require('express');
const userController = require('../controller/RegisterController');

const router = express.Router();

// Routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

module.exports = router;
