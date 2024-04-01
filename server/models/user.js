const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  email: String,
  role: {
    type: String,
    default: "user"
  },
  emailAuth: {
    type: Boolean,
    default: false,
  },
  adminAuth: {
    type: Boolean,
    default: false,
  },
}, {timestamps: true});

module.exports = mongoose.model('user', userSchema);