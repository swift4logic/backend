// api/services/user/UserService.js

const db = require("../../../../config/db");




module.exports = {
    loginUserByEmail: (email) => {
        console.log("email",email)
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM Users WHERE username = ?';

            db.query(query, [email], (err, results) => {
                if (err) {
                    return reject(err);
                }

                if (results.length === 0) {
                    return resolve(null); // No user found with this email
                }

                resolve(results[0]); // Return user details
            });
        });
    }, 
     CheckinUser: ( User_email, user_id, session_id) => {
        console.log("Checking in user", user_id,session_id)
        // return 
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO checkins ( user_id, session_id, checkin_time, status)
                VALUES (?, ?, NOW(), 1)
            `;

            db.query(query, [ user_id, session_id], (err, results) => {
                if (err) {
                    return reject(err); // Handle any errors
                }

                resolve(results); // Return the result of the insert
            });
        });
    },
    getSessionById: (sessionId) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT checkin_time FROM checkins WHERE session_id = ?', [sessionId], (error, results) => {
            if (error) {
              return reject(error);
            }
            resolve(results);
          });
        });
      },
      addNewSales: (user_id, vin_number, session_id, Image_url,SellerName) => {
        return new Promise((resolve, reject) => {
          const query = `
            INSERT INTO sales (user_id, vin_number, picture_url, sale_date, session_id,Sale_Man)
            VALUES (?, ?, ?, NOW(), ?,?)
          `;
      
          db.query(query, [user_id, vin_number, Image_url, session_id,SellerName], (error, results) => {
            if (error) {
              return reject(error);
            }
            resolve(results);
          });
        });
      },
      GetSales: (user_id, session_id) => {
        return new Promise((resolve, reject) => {
          const query = `SELECT * FROM sales WHERE user_id = ?`;
      
          db.query(query, [user_id], (error, results) => {
            if (error) {
              return reject(error);
            }
            resolve(results);
          });
        });
      },
      GetTodaySales: (user_id, session_id) => {
        return new Promise((resolve, reject) => {
          const query = `SELECT * FROM sales WHERE user_id = ? AND session_id = ?`;
      
          db.query(query, [user_id, session_id], (error, results) => {
            if (error) {
              return reject(error);
            }
            resolve(results);
          });
        });
      },
      getMonthlySales : (user_id, month, year) => {
        return new Promise((resolve, reject) => {
          const query = `
            SELECT COUNT(*) AS salesCount 
            FROM sales 
            WHERE user_id = ? 
              AND MONTH(sale_date) = ? 
              AND YEAR(sale_date) = ?
          `;
      
          // Execute the query
          db.query(query, [user_id, month, year], (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results[0]);
            }
          });
        });
      },
      getFbIDS: (user_id) => {
        return new Promise((resolve, reject) => {
          const query = `
            SELECT *  
            FROM sales_fb_account 
            WHERE user_id = ? 
             
          `;
      
          // Execute the query
          db.query(query, [user_id], (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results[0]);
            }
          });
        });
      },
      AssignFdIdToSeller: (user_id) => {
        return new Promise((resolve, reject) => {
          const query = `
            SELECT *  
            FROM sales_fb_account 
            WHERE user_id = ? 
             
          `;
      
          // Execute the query
          db.query(query, [user_id], (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results[0]);
            }
          });
        });
      },
      getSellerNameById: (user_id) => {
        return new Promise((resolve, reject) => {
          const query = `
            SELECT username As sellerName 
            FROM users
            WHERE id = ? 
             
          `;
      
          // Execute the query
          db.query(query, [user_id], (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results[0]);
            }
          });
        });
      },
      getFacebookIds: (userId) => { // Make sure to accept userId as the parameter
        return new Promise((resolve, reject) => {
            const query = 'SELECT username, fb_password, status FROM sales_fb_account WHERE user_id = ?';
            
            db.query(query, [userId], (err, results) => { // Pass userId as a parameter to the query
                if (err) {
                    return reject(err);
                }
                resolve(results); // Resolve with the fetched results
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
  getTopSalesMan: () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT Sale_Man, COUNT(*) AS total_sales
            FROM sales
            WHERE MONTH(sale_date) = MONTH(CURRENT_DATE()) 
              AND YEAR(sale_date) = YEAR(CURRENT_DATE())
            GROUP BY Sale_Man
            ORDER BY total_sales DESC
            LIMIT 1;
        `;

        db.query(query, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
},

getTodaySales: () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT Sale_Man, COUNT(*) AS today_sales
            FROM sales
            WHERE DATE(sale_date) = CURDATE()
            GROUP BY Sale_Man
            ORDER BY today_sales DESC;
        `;

        db.query(query, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
},
getCheckTime : (session_id, user_id) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT checkin_time FROM checkins WHERE user_id = ? AND session_id = ?`;
    
    db.query(query, [user_id, session_id], (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
},
AddCheckoutTime : (checkoutTime, session_id, user_id, TottolHoursOnline) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE checkins 
      SET checkout_time = ?, Tottal_Hors = ?
      WHERE session_id = ? AND user_id = ?
    `;
    
    db.query(query, [checkoutTime, TottolHoursOnline, session_id, user_id], (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
},
 

};
