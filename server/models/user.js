const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  email: String,
  role: {
    type: mongoose.Schema.ObjectId,
    ref: "role",
    required: true,
  }
}, {timestamps: true});

module.exports = mongoose.model('user', userSchema);