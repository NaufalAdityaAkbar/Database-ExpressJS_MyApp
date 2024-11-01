const express = require('express');
const router = express.Router();
const contactsController = require('../controller/ContactController');

// Define the route for fetching contacts
router.get('/', contactsController.getContacts); // This means your endpoint will be /api/contacts

module.exports = router;
