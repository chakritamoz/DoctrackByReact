const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  username: String,
  otp: String,
  expiry: Date,
}, { timestamps: true });

module.exports = mongoose.model("otp", otpSchema);