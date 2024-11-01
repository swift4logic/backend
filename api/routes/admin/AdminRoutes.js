const express = require('express');


const { createUser, CreateRole, getAllSalesPerson, getAllSalesPendingSales, AssignFbId, getFacebookIdsByUserId, SaveFBIds, getSalesData, getUnAssignFaceBookeIds, getSalesPersonSalesRecord, setSaleStatus } = require('../../controllers/admin');
const { AuthenticateUser } = require('../../Middleware/JwtAuth');
const { Usertype } = require('../../Middleware/CheckUSerROel');


const Adminrouter = express.Router();

Adminrouter.post('/create-role',AuthenticateUser,Usertype(),CreateRole)

Adminrouter.post('/create-user',AuthenticateUser,Usertype(),createUser);
Adminrouter.get('/all-user',AuthenticateUser,Usertype(),getAllSalesPerson);
Adminrouter.get('/fetch-all-sale',AuthenticateUser,Usertype(),getAllSalesPendingSales);
Adminrouter.get('/:id/facebook-ids',AuthenticateUser,Usertype(),getFacebookIdsByUserId);
Adminrouter.post('/assign-fb-id',AuthenticateUser,Usertype(),AssignFbId);
Adminrouter.post('/facebook-accounts',AuthenticateUser,Usertype(),SaveFBIds);
Adminrouter.get('/cards-data',AuthenticateUser,Usertype(),getSalesData);
Adminrouter.get('/available_facebook_id', AuthenticateUser, Usertype(), getUnAssignFaceBookeIds);
Adminrouter.get('/fetch-data', AuthenticateUser, Usertype(), getUnAssignFaceBookeIds);
Adminrouter.get('/:id/fetch-sales-per', AuthenticateUser, Usertype(), getSalesPersonSalesRecord);
Adminrouter.post('/sales-status', AuthenticateUser, Usertype(),setSaleStatus );



















module.exports = Adminrouter;