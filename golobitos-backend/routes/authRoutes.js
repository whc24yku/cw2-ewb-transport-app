const express = require('express');
const { test, registerUser, loginUser, mapRoleToUser, fetchUserPhone, fetchUserWithPhone } = require('../controllers/authController');
const { calculateDistance, calculatePrice, initiateBooking, getNotifications, assignDriver, getDriverNotifications, addVehicleDetails, completeBooking } = require('../controllers/bookTransportController');
const router = express.Router();

router.get('/', test);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/user/map-role', mapRoleToUser);
router.get('/user/phone', fetchUserPhone);
router.get('/user/find-user', fetchUserWithPhone);
//router.post('/customer/book-transport/calculate-distance', calculateDistance);
router.post('/customer/book-transport/calculate-price', calculatePrice);
router.post('/customer/book-transport/initiate-booking', initiateBooking);
router.get('/customer/book-transport/get-notifications', getNotifications);
router.post('/customer/book-transport/assign-driver', assignDriver);
router.get('/customer/book-transport/get-driver-notifications', getDriverNotifications);
router.post('/customer/book-transport/add-vehicle', addVehicleDetails);
router.post('/customer/book-transport/complete-booking', completeBooking);

module.exports = router;
