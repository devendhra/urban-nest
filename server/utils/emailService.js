const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendConfirmationEmail = (email, bookingDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Booking is Confirmed!',
    text: `Dear Customer,\n\nYour booking is confirmed.\n\nDetails:\n${bookingDetails}\n\nThank you for booking with us.`,
  };

  return transporter.sendMail(mailOptions);
};
