// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors
const Userrouter = require('./api/routes/user/UserRoutes');
const db = require('./config/db');
const Adminrouter = require('./api/routes/admin/AdminRoutes');
const path = require('path');


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());
app.use(express.json());


// Routes
app.use('/api/user', Userrouter);
app.use('/api/admin', Adminrouter); // Added missing slash before 'api/admin'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test DB connection
db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ', err.stack);
        return;
    }
    console.log('Database connected.');

    // Only start the server if the DB connection is successful
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
