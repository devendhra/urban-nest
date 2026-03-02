const express = require('express');
const { contactOwner } = require('../controllers/contactController'); 
const router = express.Router();

router.post('/contact-owner', contactOwner);

module.exports = router;
