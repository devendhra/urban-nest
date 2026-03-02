const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/property');
const userRoutes = require('./routes/userRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const { forgotPassword } = require('./controllers/authController'); // Import the forgotPassword controller
const resetPasswordRoutes = require('./routes/resetPasswordRoutes');
const contactRoutes = require('./routes/contact');
const pdfRoutes = require('./routes/pdfRoutes'); // Import the new PDF route
const contactOwnerRoutes = require('./routes/contactOwnerRoutes');
const bookingRoutes = require('./routes/booking');
require('dotenv').config();  // Ensure .env variables are loaded


console.log('🔍 DEBUG - DATABASE_URL:', process.env.DATABASE_URL ? 'LOADED ✅' : 'MISSING ❌');
console.log('🔍 DEBUG - JWT_SECRET:', process.env.JWT_SECRET ? 'LOADED ✅' : 'MISSING ❌');
console.log('🔍 DEBUG - Full keys:', Object.keys(process.env).filter(k => k.includes('DATABASE')));

const app = express();
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static('uploads'));


mongoose.connect(process.env.DATABASE_URL)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:', error.message);
  });


// Serve the main page
app.get('/', (req, res) => {
  res.send('Welcome to the homepage!');
});

// Serve the admin page (accessible directly at /admin)
app.get('/admin', (req, res) => {
  res.send('Welcome to the admin page!');
});

app.use('/api', authRoutes);
app.use('/api', propertyRoutes);
app.use('/api', userRoutes);
app.use('/api', resetPasswordRoutes);
app.use('/api', contactRoutes);
app.use('/api', pdfRoutes);
app.use('/api', contactOwnerRoutes);
app.use('/booking', bookingRoutes);


// Forgot Password route
app.post('/api/forgot-password', forgotPassword);


// Dashboard route
app.get('/api/dashboard', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});


// Vercel Serverless Function requirement
if (process.env.NODE_ENV !== 'production') {
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
  });
}

// Export the app for Vercel integration
module.exports = app;
