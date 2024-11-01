// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const verifyToken = async (req, res) => { // Update this line to send a response
    console.log("verifyToken 1", req.headers);
    const token = req.header('Authorization') ? req.header('Authorization').replace('Bearer ', '') : null;
    console.log("Authenticate", token);
    
    if (!token) {
        return res.status(401).json({ isValid: false, message: 'Access denied. No token provided.' });
    }
    
    const key = process.env.JWT_SECRET;
    
    try {
        const decoded = jwt.verify(token, key);
        console.log("key", key);
        
        req.user = decoded; // Attach the decoded user info to the request object
        
        // Send a success response indicating the token is valid
        return res.status(200).json({ isValid: true, message: 'Token is valid' });
    } catch (error) {
        console.log("error", error);
        // Send a response indicating the token is invalid
        return res.status(401).json({ isValid: false, message: 'Invalid token' });
    }
};

module.exports = {
    verifyToken
};
