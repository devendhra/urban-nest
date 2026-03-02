const express = require('express');
const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');
require('dotenv').config();

const router = express.Router();

// POST route to handle form submission
router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Save the data to the database
    const newContact = new Contact({ name, email, subject, message });
    await newContact.save();

    // Send email notification
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'devadvahdmmd@gmail.com',
        pass: process.env.EMAIL_PASS || 'gppfqopawuasjevb',
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER || 'devadvahdmmd@gmail.com',
      to: 'devadvahdmmd@gmail.com', // Send to the specified email address
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Contact Form Submission</h2>
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <div style="background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid #2563eb;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <p style="color: #666; font-size: 12px;">This message was sent from the Urban Nest contact form.</p>
        </div>
      `,
      text: `New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

This message was sent from the Urban Nest contact form.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending contact form:', error);
    res.status(500).json({ message: 'Failed to send message', error });
  }
});

module.exports = router;
