const User = require('../models/user');
const OTP = require('../models/otp');
const Auth = require('../models/auth');

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
    const userId = req.params.id;

    // Delete the user document
    await User.findOneAndDelete({ _id: userId });

    // Delete associated otp document
    await OTP.findOneAndDelete({ user: userId });

    // Delete associated auth document
    await Auth.findOneAndDelete({ user: userId });

    res.send('Remove user successfully')
  } catch (err) {
    console.log(err);
    res.status(500).send('server error');
  }
}