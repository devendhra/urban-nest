const nodemailer = require('nodemailer');
require('dotenv').config();

exports.contactOwner = async (req, res) => {
  const { name, email, message, ownerEmail } = req.body;

  // Debugging: Log the ownerEmail to ensure it's not undefined
  console.log(' Contact Owner Debug:');
  console.log('ownerEmail:', ownerEmail);
  console.log('name:', name);
  console.log('email:', email);
  console.log('message length:', message?.length);

  if (!ownerEmail) {
    console.log('Owner email is missing');
    return res.status(400).json({ message: 'Owner email is required' });
  }

  try {
    console.log(' Setting up email transporter...');
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER || 'devadvahdmmd@gmail.com',
        pass: process.env.EMAIL_PASS || 'gppfqopawuasjevb',
      },
    });

    console.log(' Sending email...');
    const mailOptions = {
      from: process.env.EMAIL_USER || 'devadvahdmmd@gmail.com', // Use authenticated email as from
      to: ownerEmail,
      subject: 'Inquiry about your property',
      text: `You have received a message from ${name} (${email}):\n\n${message}`,
    };

    console.log('Mail options:', { from: mailOptions.from, to: mailOptions.to, subject: mailOptions.subject });

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error in contactOwner:', error);
    res.status(500).json({ message: 'Failed to send email, please try again later' });
  }
};
