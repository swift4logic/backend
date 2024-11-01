// auth.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const AuthenticateUser = async (req, res, next) => { 
    const token = req.header('Authorization') ? req.header('Authorization').replace('Bearer ', '') : null;
     console.log("Authenticate",token)
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
      const key = process.env.JWT_SECRET
         
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("key",key)
        
        req.user = decoded; // Attach the decoded user info to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.log("error",error)
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = {
    AuthenticateUser
};
