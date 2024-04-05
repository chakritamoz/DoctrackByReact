const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  email: String,
  role: {
    type: String,
    default: "user"
  },
  auth: {
    email: {
      type: Boolean,
      default: false,
    },
    admin: {
      type: Boolean,
      default: false,
    }
  }
}, {timestamps: true});

module.exports = mongoose.model('user', userSchema);