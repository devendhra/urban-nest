const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/payment', bookingController.processPayment);
router.post('/confirmation', bookingController.sendConfirmationEmail);

module.exports = router;
