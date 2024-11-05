const express = require('express');
const router = express.Router();
const communityController = require('../controller/CommunityRouter');
const multer = require('multer');
const path = require('path');

// Configure Multer for file storage
const storage = multer.diskStorage({
    destination: 'uploads/groups', // Ensure this directory exists
    filename: (req, file, cb) => {
        cb(null, `group_${Date.now()}${path.extname(file.originalname)}`); // Prefix with 'group_' for clarity
    },
});

const upload = multer({ storage });

// Error handling middleware for multer
router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
    } else if (err) {
        return res.status(400).json({ message: err.message });
    }
    next();
});

// Define the route for fetching contacts
router.get('/contact', communityController.getContacts); // This means your endpoint will be /api/contact
router.post('/create-group', upload.single('group_photo'), communityController.createGroup);
router.get('/user-groups/:phone_number', communityController.getGroupsForUser);
router.get('/group/:groupId/messages', communityController.getGroupMessages);
router.post('/group/:groupId/send-message', communityController.sendMessageToGroup);

module.exports = router;
