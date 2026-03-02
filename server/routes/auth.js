const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


const { forgotPassword } = require('../controllers/authController');
const router = express.Router();


// Forgot password route
router.post('/forgot-password', forgotPassword);


//signup route
router.post('/signup', async (req, res) => {
  try {
    const { username, phone, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create a new user
    const user = new User({ username, phone, email, password });
    await user.save();

    // Generate a token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || '46f6b54812d84a6d43da82c64075f55d69a386c04d62581c7e20c1122174e024', { expiresIn: '1h' });

    // Send the token to the client
    res.status(201).json({ token, message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(400).json({ error: 'Error creating user' });
  }
});


// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log('Received email:', email);
    // console.log('Received password:', password);

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    //console.log('Stored hashed password:', user.password); // Log stored hashed password

    const isMatch = await user.comparePassword(password);
    //console.log('Password match:', isMatch); // Add this line

    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    // console.log('User Found:', user); // Log user details
    // console.log('Password Match:', isMatch); // Log password match result

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || '46f6b54812d84a6d43da82c64075f55d69a386c04d62581c7e20c1122174e024', { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(400).json({ error: 'Error logging in' });
  }
});

module.exports = router;
