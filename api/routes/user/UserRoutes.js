const express = require('express');
const { login, UserCheckin, addNewSales, getSales, getTodaysSales, getUserMonthlySales, getFbIdForSales, getFacebookIdsByUserId, getFaceBookIds, setSaleStatus, getPersonWIthMostSale, UserCheckout, getCheckInTime } = require('../../controllers/user/index');
const { AuthenticateUser } = require('../../Middleware/JwtAuth');
const { Usertype } = require('../../Middleware/CheckUSerROel');
const verifySessionId = require('../../Middleware/checkSession');
const upload = require('../../Middleware/upload');
const sessionOuth = require('../../Middleware/sessionAuth');
const { verifyToken } = require('../../Middleware/verifyToken');





const Userrouter = express.Router();

Userrouter.post('/login',login);
Userrouter.post('/user-checkin', AuthenticateUser,UserCheckin);
Userrouter.post('/add-sale', upload.single('image'), verifySessionId, AuthenticateUser, addNewSales);
Userrouter.get('/get-sale', verifySessionId, AuthenticateUser, getSales);
Userrouter.get('/check-session', sessionOuth);
Userrouter.get('/get-today-sales',verifySessionId,AuthenticateUser,getTodaysSales );
// Userrouter.get('/get-today-sales',verifySessionId,AuthenticateUser,getCompititor );
Userrouter.get('/get-monthly-sales',verifySessionId,AuthenticateUser,getUserMonthlySales );

// Userrouter.get('/get-monthly-sales',verifySessionId,AuthenticateUser,getFbIdForSales );
Userrouter.get('/verifytoken', verifyToken);
Userrouter.get('/:id/facebook-ids',verifySessionId,AuthenticateUser, getFaceBookIds);
Userrouter.post('/facebook-id-status',verifySessionId,AuthenticateUser, setSaleStatus);
Userrouter.get('/most-sales-person',verifySessionId,AuthenticateUser, getPersonWIthMostSale);
Userrouter.post('/user-checkout',verifySessionId,AuthenticateUser, UserCheckout);
Userrouter.get('/get-today-checkin-time',verifySessionId,AuthenticateUser,getCheckInTime);
























// Userrouter.post('/login',Auth,PostSale);




module.exports = Userrouter;