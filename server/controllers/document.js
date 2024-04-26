const Document = require('../models/document');
const User = require('../models/user');

exports.getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({});
    return res.send(documents);
  } catch (err) {
    console.log(err);
    return res.send('server error').status(500);
  }
}

exports.getDocument = async (req, res) => {
  try {
    const id = req.params.id;
    const document = await Document.findOne({ _id: id });
    return res.send(document);
  } catch (err) {
    console.log(err);
    return res.send('server error').status(500);
  }
}

exports.createDocument = async (req, res) => {
  try {
    const { docNumber } = req.body;
    let document = await Document.findOne({ docNumber: docNumber });

    if(document) {
      return res.send(`Document number ${docNumber} is already exists.`);
    }
    const user = await User.findOne({ "username": req.user.username })

    document = new Document (req.body);
    document.createBy = user._id;
    await document.save();

    return res.send('document create success');
  } catch (err) {
    console.log(err);
    return res.send('server error').status(500);
  }
}