const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true 
  },
  privilege: [{
    type: mongoose.Schema.ObjectId,
    ref: 'privilege'
  }]
});

module.exports = mongoose.model('role', roleSchema)