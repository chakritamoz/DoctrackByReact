const mongoose = require('mongoose');

const docSchema = new mongoose.Schema({
  docNumber: String,
  receiveDate: {
    type: Date,
    default: Date.now()
  },
  type: String,
  title: String,
  locate: String,
  sendDate: Date,
  endDate: Date,
  remark: String,
  createBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
}, { timestamps: true });

module.exports = mongoose.model('document', docSchema);