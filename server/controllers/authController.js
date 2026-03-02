const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User'); 
require('dotenv').config(); // Load environment variables

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000; // 1 hour from now
    await user.save();

    // Create a reset password link with the token as a query parameter
    const resetPasswordLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    // Configure Nodemailer using environment variables
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Use environment variables
        pass: process.env.EMAIL_PASS, // Use environment variables
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER, // Use the same email as the sender
      to: user.email,
      subject: 'Password Reset',
      text: `You requested a password reset. Click the following link to reset your password: ${resetPasswordLink}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
};
