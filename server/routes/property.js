const express = require('express');
const multer = require('multer');
const Property = require('../models/Property');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}


// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage: storage });


// Middleware to serve static files
const app = express();
app.use('/uploads', express.static('uploads'));

// Create property with image upload
router.post('/properties', authMiddleware, upload.array('images', 10), async (req, res) => {
  try {
    // Create URLs for the uploaded files
    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);

    // Create a new property document with the uploaded image URLs
    const property = new Property({
      ...req.body,
      images: imageUrls,
    });

    // Save the property document to the database
    await property.save();

    // Respond with the created property
    res.status(201).json(property);
  } catch (error) {
    console.error('Error creating property:', error.message || error); // Log the specific error
    res.status(400).json({ error: error.message || 'Error creating property' });
  }
});



// Get all properties
router.get('/properties', async (req, res) => {
  try {
    const properties = await Property.find();
    res.status(200).json(properties);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching properties' });
  }
});

// Get single property
router.get('/properties/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ error: 'Property not found' });
    res.status(200).json(property);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching property' });
  }
});

// Update property
router.put('/properties/:id', authMiddleware, async (req, res) => {
  try {
    const updatedPropertyData = {
      name: req.body.name,
      images: req.body.images,
      description: req.body.description,
      bedrooms: req.body.bedrooms,
      bathrooms: req.body.bathrooms,
      floorArea: req.body.floorArea,
      totalFloors: req.body.totalFloors,
      amenities: req.body.amenities,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      contactName: req.body.contactName,
      contactEmail: req.body.contactEmail,
      contactPhoneNumber: req.body.contactPhoneNumber,
      legalDocumentation: req.body.legalDocumentation,
      price: req.body.price,

    };
    const property = await Property.findByIdAndUpdate(req.params.id, updatedPropertyData, { new: true });
    if (!property) return res.status(404).json({ error: 'Property not found' });
    res.status(200).json(property);
  } catch (error) {
    res.status(400).json({ error: 'Error updating property' });
  }
});

// Delete property
router.delete('/properties/:id', authMiddleware, async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ error: 'Property not found' });
    res.status(200).json({ message: 'Property deleted' });
  } catch (error) {
    res.status(400).json({ error: 'Error deleting property' });
  }
});


module.exports = router;
