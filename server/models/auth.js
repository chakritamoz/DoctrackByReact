const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
  },
  email: {
    validate: {
      type: Boolean,
      default: false,
    },
    dateVerify: {
      type: Date,
      default: null
    }
  },
  admin: {
    validate: {
      type: Boolean,
      default: false,
    },
    dateVerify: {
      type: Date,
      default: null
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('auth', authSchema);