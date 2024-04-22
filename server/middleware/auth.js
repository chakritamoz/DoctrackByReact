const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Auth = require('../models/auth');

exports.authToken = async (req, res, next) => {
  try {
    const token = req.headers['authtoken'];
    if (!token) {
      return res.send('no token');
    }

    const decode = jwt.verify(token, 'jwtsecret');
    req.user = decode.user;

    next();
  } catch (err) {
    console.log(err);
    return res.send('invalid token');
  }
}

exports.authVerify = async (req, res, next) => {
  try {
    const { username } = req.user;
    const user = await User.findOne({ username: username });
    const auth = await Auth.findOne({ user: user._id });

    if (!auth.email.validate) {
      return res.send('please verify your email address')
    }

    if (!auth.admin.validate) {
      return res.send('please contact admin verify your account');
    }

    next();
  } catch (err) {
    return res.send('not verified')
  }
}