const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "user"
  },
  otp: String,
  expiry: Date,
  limit: {
    counter: Number,
    requestDate: Date
  }
}, { timestamps: true });

module.exports = mongoose.model("otp", otpSchema);