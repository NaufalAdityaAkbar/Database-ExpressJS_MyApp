const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/Register');
const chatRoutes = require('./routes/ChatRoutes'); // Chat routes correctly imported
const contactRoutes = require('./routes/ContactRoutes'); // Contact routes

const app = express();
const PORT = 3000;
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use('/api/users', userRoutes);
app.use('/api', chatRoutes); // Register chat routes under /api/chats
app.use('/api/users', contactRoutes); // Register contact routes under /api/users

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
