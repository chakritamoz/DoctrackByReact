const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Auth = require('../models/auth');
const dotenv = require('dotenv');
const generateTokensAndSetCookies = require('../utils/tokenUtils');

dotenv.config();
const REFRESH_KEY = process.env.REFRESH_KEY;
const ACCESS_KEY = process.env.ACCESS_KEY;

exports.authToken = async (req, res, next) => {
  try {
    const {refresh_token, access_token} = req.cookies;

    if (!access_token) {
      if (!refresh_token) {
        return res.sendStatus(401);
      }

      const decodedRefreshToken = await jwt.verify(refresh_token, REFRESH_KEY);
      req.user = decodedRefreshToken.user;
      // Generate both token access and refresh
      // set both cookies acress and refresh
      await generateTokensAndSetCookies(res, decodedRefreshToken.user)
      next();
    }

    try {
      const decodedAcessToken = await jwt.verify(access_token, ACCESS_KEY);
      req.user = decodedAcessToken.user;
      
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        if (!refresh_token) {
          return res.sendStatus(401);
        }

        const decodedRefreshToken = await jwt.verify(refresh_token, REFRESH_KEY);
        req.user = decodedRefreshToken.user;

        // Generate both token access and refresh
        // set both cookies acress and refresh
        await generateTokensAndSetCookies(res, decodedRefreshToken.user);
        next();
      }
    }
  } catch (err) {
    if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
      return res.sendStatus(401)
    }
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