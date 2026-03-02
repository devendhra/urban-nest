const express = require('express');
const path = require('path');
const Property = require('../models/Property');
const generatePDF = require('../utils/generatePDF'); // Ensure this path is correct
const fs = require('fs'); // Ensure fs is imported

const router = express.Router();

router.get('/properties/:id/brochure', async (req, res) => {
  try {
    const propertyId = req.params.id;
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Generate the PDF using the generatePDF function
    const filePath = generatePDF(property);

    // Send the generated PDF as a response
    res.download(filePath, `${property.name}-brochure.pdf`, (err) => {
      if (err) {
        console.error('Error sending the PDF:', err);
        res.status(500).send('Internal server error');
      } else {
        // Optionally, delete the file after sending it
        try {
          fs.unlinkSync(filePath);
        } catch (unlinkErr) {
          console.error('Error deleting PDF file:', unlinkErr);
        }
      }
    });
  } catch (error) {
    console.error('Error generating brochure:', error);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;

