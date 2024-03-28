const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  email: String,
  role: {
    type: String,
    default: "user"
  },
}, {timestamps: true});

module.exports = mongoose.model('user', userSchema);