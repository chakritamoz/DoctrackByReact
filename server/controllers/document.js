const Document = require('../models/document');
const User = require('../models/user');

exports.getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({});
    return res.send(documents);
  } catch (err) {
    console.log(err);
    return res.status(500).send('server error');
  }
}

exports.getDocument = async (req, res) => {
  try {
    const id = req.params.id;
    const document = await Document.findOne({ _id: id });
    return res.send(document);
  } catch (err) {
    console.log(err);
    return res.status(500).send('server error');
  }
}

exports.createDocument = async (req, res) => {
  try {
    const { docNumber } = req.body;
    let document = await Document.findOne({ docNumber: docNumber });

    if(document) {
      return res.status(400).send(`Document number ${docNumber} is already exists.`);
    }
    const user = await User.findOne({ "username": req.user.username })

    document = new Document(req.body);
    document.createBy = user._id;
    await document.save();

    return res.send('create document success');
  } catch (err) {
    console.log(err);
    return res.status(500).send('server error');
  }
}

exports.updateDocument = async (req, res) => {
  try {
    const id = req.params.id;
    await Document.findOneAndUpdate(
      { _id: id },
      req.body,
      { new: true }
    );
    return res.send('update document success');
  } catch (err) {
    console.log(err);
    res.status(500).send('server error');
  }
}

exports.removeDocument = async (req, res) => {
  try {
    const id = req.params.id;
    await Document.findOneAndDelete(id);
    return res.send('remove document success')
  } catch (err) {
    console.log(err);
    return res.status(500).send('server error');
  }
}