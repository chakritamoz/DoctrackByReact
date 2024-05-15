const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Auth = require('../models/auth');
const dotenv = require('dotenv');

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

exports.authToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      return res.sendStatus(401);
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) return res.status(401).send('Unauthorized');
      req.user = decoded.user;
    });

    next();
  } catch (err) {
    console.log(err);
    return res.status(500).send('invalid token');
  }
}

exports.authVerify = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401)
    }

    const { username } = req.user;
    const user = await User.findOne({ username: username });
    const auth = await Auth.findOne({ user: user._id });

    if (!auth.email.validate) {
      return res.status(403).send('please verify your email address')
    }

    if (!auth.admin.validate) {
      return res.status(403).send('please wait admin confirm your account');
    }

    next();
  } catch (err) {
    console.log(err);
    return res.status(400).send('not verified');
  }
}