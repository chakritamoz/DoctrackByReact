const mongoose = require('mongoose');

const privilegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String
}, { timestamps: true });

module.exports = mongoose.model('privilege', privilegeSchema);