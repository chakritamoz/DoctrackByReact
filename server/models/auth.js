const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
  },
  auth: {
    email: {
      type: Boolean,
      default: false,
    },
    admin: {
      type: Boolean,
      default: false
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('auth', authSchema);