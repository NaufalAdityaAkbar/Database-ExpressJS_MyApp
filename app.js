const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/Register');
const chatRoutes = require('./routes/ChatRoutes');
const contactRoutes = require('./routes/ContactRoutes');
const profileRoutes = require('./routes/Profile');
const groupRoutes = require('./routes/Community'); // Group routes
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Serve static files from uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/groups', express.static(path.join(__dirname, 'uploads')));
// Set up routes
app.use('/api', groupRoutes);
app.use('/api/users', profileRoutes);
app.use('/api/users', userRoutes);
app.use('/api', chatRoutes);
app.use('/api/users', contactRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
