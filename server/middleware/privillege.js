const User = require('../models/user');
const Role = require('../models/role');
const Privilege = require('../models/privilege');

exports.privilege = (action) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).send('Unauthorized');
      }

      const user = await User
        .findOne({ username: req.user })
        .populate({
          path: 'role',
          populate: { path: 'privilege' }
        })
      
      console.log(user);
      next();
    } catch (err) {
      console.log(err);
      return res.send('ineligible user');
    }
  } 
}