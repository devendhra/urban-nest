const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetToken: String,
  resetTokenExpiration: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  //this.password = await bcrypt.hash(this.password, 10);

  // Check if the password is already hashed
  const isPasswordHashed = this.password.startsWith('$2a$');
  if (!isPasswordHashed) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
