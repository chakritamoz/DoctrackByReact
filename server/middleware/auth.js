const jwt = require('jsonwebtoken');

exports.auth = async (req, res, next) => {
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