const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Auth = require('../models/auth');

exports.authToken = async (req, res, next) => {
  try {
    const token = req.headers['authorizations'];
    if (!token) {
      return res.status(401).send('no token');
    }

    // Extract token without 'Bearer' prefix
    const tokenWithoutBearer = token.split(' ')[1];

    const decode = jwt.verify(tokenWithoutBearer, 'jwtsecret');
    req.user = decode.user;

    next();
  } catch (err) {
    console.log(err);
    return res.status(400).send('invalid token');
  }
}

exports.authVerify = async (req, res, next) => {
  try {
    const { username } = req.user;
    const user = await User.findOne({ username: username });
    const auth = await Auth.findOne({ user: user._id });

    if (!auth.email.validate) {
      return res.status(403).send('please verify your email address')
    }

    if (!auth.admin.validate) {
      return res.status(403).send('please contact admin verify your account');
    }

    next();
  } catch (err) {
    console.log(err);
    return res.status(400).send('not verified');
  }
}