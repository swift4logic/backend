const { getSessionById } = require("../services/user/UserService");

// Middleware to verify session ID
const verifySessionId = async (req, res, next) => {
  const session_id = req.query.session_id || req.body.session_id || req.headers['session-id'];
  console.log("session_id", session_id);

  if (!session_id) {
    return res.status(400).json({ error: 'Session ID is required.' });
  }

  try {
    // Call the service to get the session information
    const results = await getSessionById(session_id);

    // Check if session exists
    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid session ID.' });
    }

    const { checkin_time } = results[0];

    // Get current date and time
    const now = new Date();
    console.log("results", checkin_time);
    console.log("now", now);

    // Calculate the time difference in hours between the check-in time and the current time
    const checkinDate = new Date(checkin_time);
    const diffInMs = now - checkinDate;
    const diffInHours = diffInMs / (1000 * 60 * 60); // Convert milliseconds to hours

    // Compare time difference (9 hours)
    if (diffInHours > 9) {
      // Session has expired
      return res.status(401).json({ error: 'Session has expired. Please check in again.' });
    }

    // Session is valid, proceed to the next middleware
    next();
  } catch (error) {
    console.error('Error verifying session:', error);
    return res.status(500).json({ error: 'Database error.' });
  }
};

module.exports = verifySessionId;

// like this  getting sessin_id fromreq,body and i am sending in params becouse of get api so add in this it will get session if  session id n req.body req.qury or anyt othe or even give me other logic for it 

