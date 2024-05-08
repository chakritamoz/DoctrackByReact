const User = require('../models/user');

exports.accounts = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    console.log(err);
    res.status(500).send('server error');
  }
}

exports.remove = async (req, res) => {
  try {
    const id = req.params.id;
    await User.findOneAndDelete({ _id: id });

    res.send('Remove user successfully')
  } catch (err) {
    console.log(err);
    res.status(500).send('server error');
  }
}