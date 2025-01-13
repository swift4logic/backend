const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const { loginUserByEmail, CheckinUser, addNewSales, GetSales, GetTodaySales, getMonthlySales, getFbIDS, getSellerNameById, getFacebookIds, setSaleStatusBySaleId, getTopSalesMan, getTodaySales, getCheckTime, AddCheckoutTime } = require("../../services/user/UserService");
const { generateOTP } = require('../../Middleware/OtpGenerator');
const path = require('path');
// const { checkout } = require('../../routes/user/UserRoutes');

module.exports = {
  login: async (req, res) => {
    const { email, password } = req.body;
    console.log("req.body", req.body);
    
    // Validate that email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Missing email or password' });
    }

    try {
      // Fetch user by email from the service
      const user = await loginUserByEmail(email);

      // If user does not exist
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Compare the provided password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Incorrect password' });
      }

      // Generate JWT token if login is successful
      const token = jwt.sign(
        { userId: user.id, role_id: user.role_id }, // Payload
        process.env.JWT_SECRET,                     // Secret key
        { expiresIn: '10h' }                         // Token expiration
      );

      // Send response with token and user info
      return res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          role_id: user.role_id
        }
      });
    } catch (error) {
      console.log("error", error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
  PostSale:async (req, res) => {
    const { VvinNumber, password } = req.body;

    
    // Validate that email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Missing email or password' });
    }

    try {
      // Fetch user by email from the service
      const user = await loginUserByEmail(email);

      // If user does not exist
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Compare the provided password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Incorrect password' });
      }

      // Generate JWT token if login is successful
      const token = jwt.sign(
        { userId: user.id, role_id: user.role_id }, // Payload
        process.env.JWT_SECRET,                     // Secret key
        { expiresIn: '10h' }                         // Token expiration
      );

      // Send response with token and user info
      return res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          role_id: user.role_id
        }
      });
    } catch (error) {
      console.log("error", error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
  UserCheckin: async (req, res) => {
    // console.log("coNTROLELR")
    const { user_id, User_email } = req.body;

    // Validate that user_id and User_email are provided
    if (!User_email || !user_id) {
      return res.status(400).json({ message: 'Missing email or user ID' });
    }

    // Generate a session token (OTP)
    const session_id = generateOTP();
   console.log("user_id",user_id)
   console.log("session_id",session_id)
    try {
      // Insert check-in details into the database using the CheckinUser service
      const user = await CheckinUser(User_email, user_id, session_id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Send response with session_id and user info
      return res.status(200).json({
        message: 'Check-in successful',
        session_id,  // Send session_id (OTP) in response
        });
    } catch (error) {
      console.log("error", error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
 

 addNewSales : async (req, res) => {
  const { user_id, vin_number, session_id } = req.body;
  const image = req.file; // Get the uploaded file
   const getSellerName =  await getSellerNameById(user_id)
   const SellerName = getSellerName[0]?.sellerName || "Not Name Fount Check AddNewSAle COntroller";
  // Validate that user_id, vin_number, and session_id are provided
  if (!vin_number || !user_id || !session_id || !image) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  // Generate the image URL
  const Image_url = `${req.protocol}://${req.get('host')}/uploads/${image.filename}`;

  try {
    // Insert new sale into the database
    const NewSale = await addNewSales(user_id, vin_number, session_id, Image_url,SellerName);

    return res.status(200).json({
      message: 'Sale added successfully',
      session_id,  // Send session_id in response
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
},
getSales: async (req, res) => {
  const { user_id, session_id } = req.query; // Use req.query for GET requests
    console.log("req.query",req.query)
  // Validate that user_id and session_id are provided
  if (!user_id || !session_id) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    // Fetch sales data from the database
    const salesData = await GetSales(user_id, session_id);

    return res.status(200).json({
      message: 'Sales data retrieved successfully',
      salesData,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
},
getTodaysSales: async (req, res) => {
  const { user_id, session_id } = req.query; // Use req.query for GET requests
    console.log("req.query",req.query)
  // Validate that user_id and session_id are provided
  if (!user_id || !session_id) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    // Fetch sales data from the database
    const salesData = await GetTodaySales(user_id, session_id);

    return res.status(200).json({
      message: 'Sales data retrieved successfully',
      salesData,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
},
getUserMonthlySales : async (req, res) => {
  try {
    const { user_id } = req.query; // Extract user_id from query parameters

    if (!user_id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Get the current month and year
    const now = new Date();
    const month = now.getMonth() + 1; // JavaScript months are 0-11
    const year = now.getFullYear();

    // Call the service to get sales data
    console.log("user_id",user_id)
    const salesData = await getMonthlySales(user_id, month, year);

    // Set the monthly target (you can also fetch this from DB if dynamic)
    const MONTHLY_TARGET = 20;
    const salesCount = salesData.salesCount || 0;
    const remainingSales = MONTHLY_TARGET - salesCount;

    // Respond with sales data and target progress
    res.json({
      salesCount,
      remainingSales,
      monthlyTarget: MONTHLY_TARGET,
    });
  } catch (error) {
    console.error('Error fetching user sales:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
},

getFaceBookIds: async (req, res) => {
  const userId = req.params.id; // Get userId from the URL parameters
  console.log("userId ", userId);

  try {
      const facebookIds = await getFacebookIds(userId); // Call the service to get Facebook IDs

      if (!facebookIds || facebookIds.length === 0) { // Check if facebookIds is empty
          return res.status(404).json({ message: 'Facebook IDs not found for the given user.' });
      }

      res.status(200).json(facebookIds); // Return found Facebook IDs
  } catch (error) {
      console.error('Error fetching Facebook IDs:', error.message);
      res.status(500).json({ message: 'Server error while fetching Facebook IDs.' });
  }
},

setSaleStatus: async (req, res) => {
  try {
      const { status, sale_id, userId } = req.body;
      const result = await setSaleStatusBySaleId(status, sale_id, userId);
      return res.status(200).json({
          message: 'Sales status updated successfully',
          result,
      });
  } catch (error) {
      console.error("Error updating sales status:", error);
      return res.status(500).json({
          message: 'An error occurred while updating sales status',
          error: error.message,
      });
  }
},
getPersonWIthMostSale : async (req, res) => {
  try {
      // Get the top salesperson for the current month
      const topSalesMan = await getTopSalesMan();
      // Get today's sales for all salespeople
      const todaySales = await getTodaySales();

      return res.status(200).json({
          message: 'Sales data fetched successfully',
          topSalesMan,
          todaySales,
      });
  } catch (error) {
      console.error("Error fetching sales data:", error);
      return res.status(500).json({
          message: 'An error occurred while fetching sales data',
          error: error.message,
      });
  }
},
 UserCheckout : async (req, res) => {
  try {
    const { session_id, user_id } = req.body;

    const checkoutTime = new Date();
    const getCheckinTime = await getCheckTime(session_id, user_id);
    
    if (!getCheckinTime || getCheckinTime.length === 0) {
      return res.status(404).json({
        message: 'Check-in time not found for this session.',
      });
    }

    const checkInTime = new Date(getCheckinTime[0].checkin_time);
    const TottolHoursOnline = ((checkoutTime - checkInTime) / (1000 * 60 * 60)).toFixed(1); // Calculate hours online with one decimal
 // Calculate hours online

    // Update checkout time and total hours online
    await AddCheckoutTime(checkoutTime, session_id, user_id, TottolHoursOnline);

    return res.status(200).json({
      message: 'User checked out successfully',
      checkoutTime,
      TottolHoursOnline
    });
  } catch (error) {
    console.error("Error during checkout:", error);
    return res.status(500).json({
      message: 'An error occurred during checkout',
      error: error.message,
    });
  }
},
getCheckInTime: async (req, res) => {
  try {
    const { session_id, user_id } = req.query; // Use req.query to get query parameters
    console.log("req.body 1224556", session_id, user_id);

    const getCheckinTime = await getCheckTime(session_id, user_id);
    
    if (!getCheckinTime || getCheckinTime.length === 0) {
      return res.status(404).json({
        message: 'Check-in time not found for this session.',
      });
    }

    const checkinDate = new Date(getCheckinTime[0].checkin_time);

    // Format the date
    const optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedCheckinDate = checkinDate.toLocaleDateString('en-US', optionsDate);

    // Format the time
    const optionsTime = { hour: 'numeric', minute: 'numeric', hour12: true }; // Use hour12: false for 24-hour format
    const formattedCheckinTime = checkinDate.toLocaleTimeString('en-US', optionsTime);

    return res.status(200).json({
      message: 'Check-in time retrieved successfully',
      formattedCheckinDate,
      formattedCheckinTime, // Add the formatted time to the response
    });
  } catch (error) {
    console.error("Error during checkout:", error);
    return res.status(500).json({
      message: 'An error occurred while retrieving check-in time',
      error: error.message,
    });
  }
}






};
