const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const ACCESS_KEY = process.env.ACCESS_KEY;
const REFRESH_KEY = process.env.REFRESH_KEY;

const generateTokensAndSetCookies = async (res, decodeToken) => {
  const payload = {
    user: {
      username: decodeToken.username
    }
  }

  // Generate a new access token
  const newAccessToken = await jwt.sign(payload, ACCESS_KEY, {expiresIn: 10});
  res.cookie('access_token', newAccessToken, {
    httpOnly: true, // Cookie will not be exposed to client side code
    sameSite: "none", // If client and server origins are different
    secure: true, // use with HTTPS only
    maxAge: 1000 * 60 * 30 // expired after 30 minute
  });

  // Generate a new refresh token
  const newRefreshToken = await jwt.sign(payload, REFRESH_KEY, {expiresIn: 30});
  res.cookie('refresh_token', newRefreshToken, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 1000 * 60 * 60
  });
}

module.exports = generateTokensAndSetCookies;