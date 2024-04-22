const User = require('../models/user');

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
        });

      const isPrivilege = user.role.privilege.find((priv => priv === action));

      if (!isPrivilege) {
        return res.status(403).send('Forbidden');
      }
      
      next();
    } catch (err) {
      console.log(err);
      return res.send('ineligible user');
    }
  } 
}