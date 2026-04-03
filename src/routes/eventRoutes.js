const express = require('express');
const router = express.Router();
const controller = require('../controllers/bookingController');

// Event routes [cite: 13]
router.get('/events', controller.getAllEvents);
router.post('/events', controller.createEvent);

// Booking route 
router.post('/bookings', controller.createBooking);

// User Booking History 
router.get('/users/:id/bookings', controller.getUserBookings);

// Attendance route 
router.post('/events/:id/attendance', controller.markAttendance);

module.exports = router;