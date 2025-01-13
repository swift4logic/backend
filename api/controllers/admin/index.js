const { CheckEmailInUse, createUser, checkUsername, getAlluser, getAllUsers, getAllPendingSales, AssignFdIdToSeller, getFacebookIds, StoreFacebookIds, getTotalSales, getTodaysSales, getMonthlySales, getNewlyAddedSales, getUnAssignFaceBookeIds, getAssignFaceBookIds, getTotalSalesById, getTodaysSalesById, getMonthlySalesById, getNewlyAddedSalesById, getMonthlyCheckinsByUserId, getTodaysCheckinByUserId, setSaleStatusBySaleId, getPrize, getFbIdsActive, getFbIdsNoNActive, getTodaysCheckINTime, CreateRole} = require("../../services/admin/AdminServices");
const bcrypt = require('bcrypt');

module.exports = {
    
    CreateRole: async (req, res) => {
        try {
            const { role_Name } = req.body;
            if (!role_Name) {
                return res.status(400).json({
                    message: 'Missing required fields: role_Name'
                });
            }
        
            const newRole = await CreateRole(role_Name);

            return res.status(201).json({
                message: 'User created successfully',
                userId: newRole.insertId 
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'An error occurred while creating the user',
                error: error.message
            });
        }
    },
    createUser : async (req, res) => {
        try {
            const { user_Name, password, role_id, laptop_no, laptop_password } = req.body; // Destructure new fields
            console.log("req.body_1", req.body);
    
            // Validate input fields
            if (!user_Name || !password || !role_id || !laptop_no || !laptop_password) {
                return res.status(400).json({
                    message: 'Missing required fields: username, password, role ID, laptop number, or laptop password'
                });
            }
    
            // Check if the username already exists
            const checkUserNameAlreadyExist = await checkUsername(user_Name);
            console.log("checkUserNameAlreadyExist", checkUserNameAlreadyExist);
    
            if (checkUserNameAlreadyExist > 0) {
                return res.status(400).json({
                    message: 'This username is already in use'
                });
            }
    
            // Hash the password using bcrypt
            const hashedPassword = await bcrypt.hash(password, 10);
    
            // Create the new user
            const newUser = await createUser(user_Name, hashedPassword, role_id, laptop_no, laptop_password); // Pass new fields
    
            return res.status(201).json({
                message: 'User created successfully',
                userId: newUser.insertId // Assuming MySQL auto increments user ID
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'An error occurred while creating the user',
                error: error.message
            });
        }
    },
    getAllSalesPerson: async (req, res) => {
        try {
            // Retrieve all users from the database
            const users = await getAllUsers();
            // console.log("users",users)
            // Check if users are found
            if (!users || users.length === 0) {
                return res.status(404).json({
                    message: 'No salespersons found',
                });
            }
    
            // Decrypt passwords (assuming you have the original plain text, otherwise this step is not possible)
            // For this example, let's assume the passwords are stored as hashed values,
            // and you can't "decrypt" a hash. You would need to store the original password 
            // or use a two-way encryption for this to work.
    
            // Respond with the list of users
            return res.status(200).json({
                message: 'Salespersons retrieved successfully',
                users: users
            });
        } catch (error) {
            console.error("Error retrieving salespersons:", error);
            return res.status(500).json({
                message: 'An error occurred while retrieving salespersons',
                error: error.message
            });
        }
    },
    getAllSalesPendingSales: async (req, res) => {
        try {
            // Retrieve all users from the database
            const users = await getAllPendingSales();
            // console.log("users",users)
            // Check if users are found
            if (!users || users.length === 0) {
                return res.status(404).json({
                    message: 'No salespersons found',
                });
            }
            console.log("users",users);
    
            // Decrypt passwords (assuming you have the original plain text, otherwise this step is not possible)
            // For this example, let's assume the passwords are stored as hashed values,
            // and you can't "decrypt" a hash. You would need to store the original password 
            // or use a two-way encryption for this to work.
    
            // Respond with the list of users
            return res.status(200).json({
                message: 'Salespersons retrieved successfully',
                users: users
            });
        } catch (error) {
            console.error("Error retrieving salespersons:", error);
            return res.status(500).json({
                message: 'An error occurred while retrieving salespersons',
                error: error.message
            });
        }
    },
    AssignFbId : async (req, res) => {
        const { user_id, facebook_id, password } = req.body;
        
        try {
            // Fetch the prize for the given Facebook ID and password
            const getFaceBookIdPRize = await getPrize(facebook_id, password);
    
            if (getFaceBookIdPRize.length === 0) {
                return res.status(404).json({ message: 'No prize found for the given Facebook ID and password.' });
            }
    
            const Prize = getFaceBookIdPRize[0].prize;
    
            // Assign the Facebook ID to the seller with the prize
            const facebookIds = await AssignFdIdToSeller(user_id, facebook_id, password, Prize);
    
            if (!facebookIds) {
                return res.status(404).json({ message: 'Facebook ID assignment failed for the given user.' });
            }
    
            res.status(200).json({ message: 'Facebook ID assigned successfully.', facebookIds });
        } catch (error) {
            console.error('Error assigning Facebook ID:', error);
            res.status(500).json({ message: 'Server error while assigning Facebook ID.' });
        }
    },
    
    getFacebookIdsByUserId: async (req, res) => {
        const userId = req.params.id; // Get userId from the URL parameters
        console.log("userId", userId);
      
        try {
            const facebookIds = await getFacebookIds(userId); // Call the service to get Facebook IDs
    
            if (!facebookIds || facebookIds.length === 0) { // Check if facebookIds is empty
                return res.status(404).json({ message: 'Facebook IDs not found for the given user.' });
            }
    
            res.status(200).json(facebookIds); // Return found Facebook IDs
        } catch (error) {
            console.error('Error fetching Facebook IDs:', error);
            res.status(500).json({ message: 'Server error while fetching Facebook IDs.' });
        }
    },

    // SaveFBIds: async (req, res) => {
    //     const user_Name = req.params.facebook_id; // Get userId from the URL parameters
    //     const facebook_password = req.params.facebook_password; // Get userId from the URL parameters

        
      
    //     try {
    //         const facebookIds = await StoreFacebookIds(user_Name,facebook_password); // Call the service to get Facebook IDs
    
    //         if (!facebookIds || facebookIds.length === 0) { // Check if facebookIds is empty
    //             return res.status(404).json({ message: 'Facebook IDs not found for the given user.' });
    //         }
    
    //         res.status(200).json(facebookIds); // Return found Facebook IDs
    //     } catch (error) {
    //         console.error('Error fetching Facebook IDs:', error);
    //         res.status(500).json({ message: 'Server error while fetching Facebook IDs.' });
    //     }
    // },
    // Controller function
// Controller function
// Controller function
SaveFBIds: async (req, res) => {
    console.log("Request Body:", req.body); // Log the entire request body
    const facebookAccounts = req.body.facebookAccounts || []; // Fallback to an empty array

    console.log("facebookAccounts", facebookAccounts); // Log facebookAccounts
    try {
        const promises = facebookAccounts.map(({ username, password, prize, twoFA }) =>
            StoreFacebookIds(username, password, prize, twoFA) // Pass twoFA to the StoreFacebookIds function
        );

        const results = await Promise.all(promises); // Insert all accounts into the database

        res.status(200).json({ message: 'Facebook IDs saved successfully.', results });
    } catch (error) {
        console.error('Error saving Facebook IDs:', error);
        res.status(500).json({ message: 'Server error while saving Facebook IDs.' });
    }
},

getSalesData : async (req, res) => {
    try {
        // Fetching total sales

        console.log("checking ")
        const totalSalesResult = await getTotalSales();
        const totalSales = totalSalesResult[0].total;

        // Fetching today's sales
        const todaysSalesResult = await getTodaysSales();
        const todaysSales = todaysSalesResult[0].today_total;

        // Fetching monthly sales
        const monthlySalesResult = await getMonthlySales();
        const monthlySales = monthlySalesResult[0].monthly_total;

        // Fetching newly added sales
        const newlyAddedSalesResult = await getNewlyAddedSales();
        const newlyAddedSales = newlyAddedSalesResult[0].newly_added;

        // Prepare the response
        const salesData = {
            totalSales,
            todaysSales,
            monthlySales,
            newlyAddedSales,
        };

        return res.status(200).json({
            message: 'Sales data retrieved successfully',
            data: salesData,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'An error occurred while retrieving sales data',
            error: error.message,
        });
    }
},
getUnAssignFaceBookeIds: async (req, res) => {
    try {
        const getIdsAvailABleToAssign = await getUnAssignFaceBookeIds();
        const getAssignFaceBookIdsResult = await getAssignFaceBookIds();

        // Filter out the unassigned Facebook IDs
        const unassignedIds = getIdsAvailABleToAssign.filter((availableId) => {
            // Check if there's a match in the assigned list
            const isAssigned = getAssignFaceBookIdsResult.some(
                (assignedId) =>
                    assignedId.username === availableId.facebook_id &&
                    assignedId.fb_password === availableId.Password
            );
            // Return true if not assigned (i.e., no match found)
            return !isAssigned;
        });

        console.log("Unassigned Facebook IDs:", unassignedIds);

        return res.status(200).json({
            message: 'Sales data retrieved successfully',
            data: {
                unassignedIds,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'An error occurred while retrieving sales data',
            error: error.message,
        });
    }
},
getSalesPersonSalesRecord: async (req, res) => {
    const userId = req.params.id; // Get userId from the URL parameters
    console.log("userId", userId);
    try {
        // Fetching total sales
        console.log("checking ");
        const totalSalesResult = await getTotalSalesById(userId);
        const totalSales = totalSalesResult[0]?.total || 0;

        // Fetching today's sales
        const todaysSalesResult = await getTodaysSalesById(userId);
        const todaysSales = todaysSalesResult[0]?.today_total || 0;

        // Fetching monthly sales
        const monthlySalesResult = await getMonthlySalesById(userId);
        const monthlySales = monthlySalesResult[0]?.monthly_total || 0;

        // Fetching newly added sales
        const newlyAddedSalesResult = await getNewlyAddedSalesById(userId);
        const newlyAddedSales = newlyAddedSalesResult[0]?.newly_added || 0;

        // Fetching attendance
        const totalDaysAvailableResult = await getMonthlyCheckinsByUserId(userId);
        const attendance = totalDaysAvailableResult[0]?.monthly_checkins || 0;

        // Fetching today's check-in time
        const todaysCheckinResult = await getTodaysCheckinByUserId(userId);
        const todayCheckinTime = todaysCheckinResult?.formatted_checkin_time || "No check-in time available";

        // Fetching active Facebook accounts
        const getTottalActiveFaceBookId = await getFbIdsActive(userId) || { total_prize: 0, active_accounts: 0 };
        const Active_Accoutn_Total_prize = getTottalActiveFaceBookId.total_prize;
        const active_accounts = getTottalActiveFaceBookId.active_accounts;

        // Fetching non-active Facebook accounts
        const getTottalNonActiveFaceBookId = await getFbIdsNoNActive(userId);
        const Non_Active_Accoutn_Total_prize = (getTottalNonActiveFaceBookId && getTottalNonActiveFaceBookId.total_prize) ? getTottalNonActiveFaceBookId.total_prize : 0;
        const Non_Active_accounts = (getTottalNonActiveFaceBookId && getTottalNonActiveFaceBookId.active_accounts) ? getTottalNonActiveFaceBookId.active_accounts : 0;

        // Fetch today's check-in time
        const todaysCheckin = await getTodaysCheckINTime(userId);

        // Format check-in time
        let checkinMessage = "No check-in for today"; // Default message
        let formattedCheckinDate = null;

        if (todaysCheckin) {
            const checkinDate = new Date(todaysCheckin.checkin_time);
            formattedCheckinDate = checkinDate.toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
            });
            checkinMessage = `Today's check-in time: ${formattedCheckinDate}`; // Update message if check-in exists
        }

        // Prepare the response
        const salesData = {
            totalSales,
            todaysSales,
            monthlySales,
            newlyAddedSales,
            attendance,
            todayCheckinTime,
            Active_Accoutn_Total_prize,
            active_accounts,
            Non_Active_Accoutn_Total_prize,
            Non_Active_accounts,
            checkinMessage // Add the check-in message to the response
        };

        return res.status(200).json({
            message: 'Sales data retrieved successfully',
            data: salesData,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'An error occurred while retrieving sales data',
            error: error.message,
        });
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








    
    
};
