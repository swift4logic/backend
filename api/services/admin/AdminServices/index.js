const db = require("../../../../config/db");
const { CreateRole } = require("../../../controllers/admin");

module.exports = {
    CheckEmailInUse: (username) => {
        console.log("username", username);
    
        return new Promise((resolve, reject) => {
            const query = 'SELECT COUNT(*) AS count FROM users WHERE username = ?';
            
            db.query(query, [username], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results[0].count); // Return the count of users with the given username
            });
        });
    },
    
    
    createUser : (user_Name, hashedPassword, role_id, laptop_no, laptop_password) => {
        console.log("user_Name", user_Name, "hashedPassword", hashedPassword, "role_id", role_id, "laptop_no", laptop_no, "laptop_password", laptop_password);
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO Users (username, password, role_id, laptop_Id, laptop_password) VALUES (?, ?, ?, ?, ?)'; // Include new fields in the query
            db.query(query, [user_Name, hashedPassword, role_id, laptop_no, laptop_password], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    },
    CreateRole: (role_Name) => {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO roles ( role_name) VALUES (?)';
            db.query(query, [role_Name], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    },

    checkUsername: (username) => {
        console.log("username", username);
    
        return new Promise((resolve, reject) => {
            const query = 'SELECT COUNT(*) AS count FROM users WHERE username = ?';
            
            db.query(query, [username], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results[0].count); // Return the count of users with the given username
            });
        });
    },
    getAllUsers: () => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM users WHERE role_id = 2';
            
            db.query(query, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results); // Return all user data
            });
        });
    },

    getAllPendingSales: () => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM  sales ORDER BY sale_date DESC';
            
            db.query(query, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results); // Return all user data
            });
        });
    },
    AssignFdIdToSeller: (userId, facebook_id, password,Prize) => {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO sales_fb_account (user_id, username, fb_password,Prize) VALUES (?, ?, ?,Prize)';
            const values = [userId, facebook_id, password,Prize];
    
            db.query(query, values, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results); // Return the result of the query
            });
        });
    },
     getPrize :(facebook_id, password) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT prize FROM facebook_ids WHERE facebook_id = ? AND Password = ?';
            
            db.query(query, [facebook_id, password], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    },
    
     AssignFdIdToSeller : (userId, facebook_id, password, Prize) => {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO sales_fb_account (user_id, username, fb_password, Prize) VALUES (?, ?, ?, ?)';
            const values = [userId, facebook_id, password, Prize];
            
            db.query(query, values, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    },
    
    // Service function
// Service function
StoreFacebookIds: (username, password, prize, twoFA) => {
    return new Promise((resolve, reject) => {
        // Update the query to include twoFA and remove the extra comma
        const query = 'INSERT INTO facebook_ids (facebook_id, Password, prize, 2fa) VALUES (?, ?, ?, ?)';
        const values = [username, password, prize, twoFA || null]; // Set twoFA to null if it's not provided

        db.query(query, values, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results); // Return the result of the query
        });
    });
},
getTotalSales : () => {
    const query = 'SELECT COUNT(*) as total FROM sales';
    return new Promise((resolve, reject) => {
        db.query(query, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
},
getTodaysSales : () => {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const query = 'SELECT COUNT(*) as today_total FROM sales WHERE DATE(sale_date) = ?';
    return new Promise((resolve, reject) => {
        db.query(query, [today], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
},
getMonthlySales :() => {
    const currentMonth = new Date().toISOString().slice(0, 7); // Format: YYYY-MM
    const query = 'SELECT COUNT(*) as monthly_total FROM sales WHERE DATE_FORMAT(sale_date, "%Y-%m") = ?';
    return new Promise((resolve, reject) => {
        db.query(query, [currentMonth], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
},
getNewlyAddedSales : () => {
    const query = 'SELECT COUNT(*) as newly_added FROM sales WHERE sale_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
    return new Promise((resolve, reject) => {
        db.query(query, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
},
getUnAssignFaceBookeIds:() => {
    const query = 'SELECT  *  FROM facebook_ids';
    return new Promise((resolve, reject) => {
        db.query(query, (err, results) => {
            if (err) {
                return reject(err);
            }
            // console.log(results)
            resolve(results);

        });
    });
},
getAssignFaceBookIds:() => {
    const query = 'SELECT  *  FROM sales_fb_account';
    return new Promise((resolve, reject) => {
        db.query(query, (err, results) => {
            if (err) {
                return reject(err);
            }
            // console.log(results)
            resolve(results);
        });
    });
},
getTotalSalesById : (user_id ) => {
    const query = 'SELECT COUNT(*) as total FROM sales WHERE user_id = ? ';
    return new Promise((resolve, reject) => {
        db.query(query,[user_id] ,(err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
},
getTodaysSalesById: (user_id) => {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const query = 'SELECT COUNT(*) as today_total FROM sales WHERE DATE(sale_date) = ? AND user_id = ?';
    return new Promise((resolve, reject) => {
        db.query(query, [today, user_id], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
},

getMonthlySalesById: (user_id) => {
    const currentMonth = new Date().toISOString().slice(0, 7); // Format: YYYY-MM
    const query = 'SELECT COUNT(*) as monthly_total FROM sales WHERE DATE_FORMAT(sale_date, "%Y-%m") = ? AND user_id = ?';
    return new Promise((resolve, reject) => {
        db.query(query, [currentMonth, user_id], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
},

getNewlyAddedSalesById: (user_id) => {
    const query = 'SELECT COUNT(*) as newly_added FROM sales WHERE sale_date >= DATE_SUB(NOW(), INTERVAL 7 DAY) AND user_id = ?';
    return new Promise((resolve, reject) => {
        db.query(query, [user_id], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
},
getMonthlyCheckinsByUserId: (user_id) => {
    const currentMonth = new Date().toISOString().slice(0, 7); // Format: YYYY-MM
    const query = 'SELECT COUNT(*) as monthly_checkins FROM checkins WHERE DATE_FORMAT(checkin_time, "%Y-%m") = ? AND user_id = ?';
    return new Promise((resolve, reject) => {
        db.query(query, [currentMonth, user_id], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
},

getTodaysCheckinByUserId: (user_id) => {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const query = `
        SELECT 
            DATE_FORMAT(checkin_time, '%W, %M %d, %Y - %h:%i %p') as formatted_checkin_time 
        FROM checkins 
        WHERE DATE(checkin_time) = ? 
        AND user_id = ?
        LIMIT 1;
    `;
    return new Promise((resolve, reject) => {
        db.query(query, [today, user_id], (err, results) => {
            if (err) {
                return reject(err);
            }
            if (results.length > 0) {
                resolve(results[0]); // Return the first result
            } else {
                resolve({ formatted_checkin_time: null }); // No check-in found
            }
        });
    });
},
setSaleStatusBySaleId: (status, sale_id, userId) => {
    return new Promise((resolve, reject) => {
        const query = `
          UPDATE sales 
          SET status = ? 
          WHERE id = ? AND user_id = ?;
        `;
    
        db.query(query, [status, sale_id, userId], (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
},
 getFbIdsActive : (user_id) => {
    const query = `
        SELECT SUM(Prize) AS total_prize, COUNT(username) AS active_accounts
        FROM sales_fb_account
        WHERE user_id = ? AND status = 1
    `;
    
    return new Promise((resolve, reject) => {
        db.query(query, [user_id], (err, results) => {
            if (err) {
                return reject(err);
            }
            if (results.length > 0 && results[0].total_prize !== null) {
                // Return results if they exist and total_prize is not null
                resolve(results[0]);
            } else {
                // Return a default object if no records found or total_prize is null
                resolve({ total_prize: 0, active_accounts: 0 });
            }
        });
    });
},

getFbIdsNoNActive : (user_id) => {
    const query = `
        SELECT SUM(Prize) AS total_prize, COUNT(username) AS active_accounts
        FROM sales_fb_account
        WHERE user_id = ? AND status = 0
    `;
    
    return new Promise((resolve, reject) => {
        db.query(query, [user_id], (err, results) => {
            if (err) {
                return reject(err);
            }
            if (results.length > 0) {
                resolve(results[0]); // Return the aggregated result
            } else {
                resolve({ total_prize: 0, active_accounts: 0 }); // No active accounts found
            }
        });
    });
},
getTodaysCheckINTime: (user_id) => { 
    return new Promise((resolve, reject) => {
      // Get today's date in YYYY-MM-DD format
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Start of today
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // End of today
  
      // Query to get check-in times for today only
      const query = `SELECT checkin_time FROM checkins WHERE user_id = ? AND checkin_time BETWEEN ? AND ?`;
      
      db.query(query, [user_id, startOfDay, endOfDay], (error, results) => { 
        if (error) {
          return reject(error);
        }
        // Return the latest check-in time for today
        if (results.length > 0) {
          const latestCheckin = results[results.length - 1]; // Assuming results are sorted by time
          resolve(latestCheckin);
        } else {
          resolve(null); // No check-in found for today
        }
      });
    });
  }
  









};
