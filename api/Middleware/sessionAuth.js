const { getSessionById } = require("../services/user/UserService");

const sessionOuth = async (req, res) => {
  const session_id = req.query.session_id || req.body.session_id || req.headers['session-id'];

  if (!session_id) {
    return res.status(400).json({ error: 'Session ID is required.' });
  }

  try {
    const results = await getSessionById(session_id);

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid session ID.' });
    }

    const { checkin_time } = results[0];
    const now = new Date();
    const checkinDate = new Date(checkin_time);
    const diffInMs = now - checkinDate;
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours > 9) {
      return res.status(401).json({ error: 'Session has expired.', redirect: '/checkin' });
    }

    // Session is valid, return success
    return res.status(200).json({ message: 'Session is valid.' });
  } catch (error) {
    console.error('Error verifying session:', error);
    return res.status(500).json({ error: 'Database error.' });
  }
};

module.exports = sessionOuth;
