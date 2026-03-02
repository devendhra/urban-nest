const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Ensure the User model is correctly imported

// Reset password route
// Reset password route
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Log the received token and new password
    // console.log('Received token:', token);
    // console.log('Received newPassword:', newPassword);

    // Find user by token and ensure token is not expired
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() } // Token is still valid
    });

    // Log the token and expiration values from the database
    // console.log('Database token:', user ? user.resetToken : 'No user found');
    // console.log('Token expiration:', user ? user.resetTokenExpiration : 'No user found');
    // console.log('Current time:', Date.now());

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    //console.log('Original hashed password:', user.password); // Log original hashed password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    //console.log('New hashed password:', hashedPassword); // Log new hashed password
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res.status(200).json({ message: 'Password successfully updated' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
});

module.exports = router;
