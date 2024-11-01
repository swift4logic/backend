module.exports = {
    Usertype: () => {
        return async (req, res, next) => {
            const { role_id } = req.user; // Extract role_id from the token
            console.log("role_id",role_id)
            
            if (!role_id) {
                return res.status(400).json({
                    message: "role_id is not available"
                });
            }
        
        if (role_id === 2) {
            return res.status(403).json({ message: 'Access forbidden: You do not have access.' });
        }

        next(); 
        };
    }
};
