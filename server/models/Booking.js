const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');  

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, default: uuidv4 },  
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },  
  name: { type: String, required: true },  
  email: { type: String, required: true },  
  accountNumber: { type: String, required: true },  
  expiryDate: { type: String, required: true },  
  ccv: { type: String, required: true },  
  amount: { type: Number, required: true },  
  date: { type: Date, default: Date.now }  
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
