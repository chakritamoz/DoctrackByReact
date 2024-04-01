const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const randomString = require('randomized-string');

const User = require('../models/user');
const OTP = require('../models/otp');
const { registerMail } = require('../functions/oauth2');

exports.register = async (req, res) => {
  try {
    const { 
      username, 
      password,
      email,
      role
    } = req.body;
    let user = await User.findOne({ username: username });
    // if (user) {
    //   return res.send('username is already exists');
    // }

    const salt = await bcrypt.genSalt(10);

    user = new User({
      username,
      password,
      email,
      role
    });

    user.password = await bcrypt.hash(password, salt);
    const otpCode = await generateOTP(user.username);

    // Send email for authentication
    registerMail(user, otpCode);

    // user.save();
    return res.send('register succress');
  } catch (err) {
    console.log(err);
    res.send('server error').status(500)
  }
}

exports.signin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOneAndUpdate(
      { username: username },
      { new: true }
    );

    if (!user) {
      return res.send('username is incorrect');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.send('password is incorrect');
    }

    const payload = {
      user: {
        username: username
      }
    };

    jwt.sign(payload, 'jwtsecret', (err, token) => {
      if (err) throw err;
      res.json({ token, payload });
    })
  } catch (err) {
    console.log(err);
    res.send('server error').status(500);
  }
}

exports.forget = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.send('username is invalid');
    }

    await generateOTP(username);

    return res.send('send OTP to your email');
  } catch (err) {
    console.log(err);
    return res.send('server error').status(500);
  }
}

exports.reset = async (req, res) => {
  try {
    const { 
      username,
      password,
      confirmPassword,
      otpCode
    } = req.body;

    const otp = await OTP.findOne({ username: username});
    if (!otp) {
      return res.send('Username is invalid');
    }

    if (expiry < new Date()) {
      return res.send('OTP lifetime is expired');
    }

    const isMatch = await bcrypt.compare(otpCode, otp.otp);
    if (!isMatch) {
      return res.send('OTP is invalid');
    }

    if (password !== confirmPassword) {
      return res.send('New password and old password not match');
    }

    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(password, salt);

    await User.findOneAndUpdate(
      { username: username },
      { password: newPassword},
      { new: true }
    );

    res.send('Reset password is successfully');
  } catch (err) {
    console.log(err);
    return res.send('server error').status(500);
  }
}

exports.remove = async (req, res) => {
  try {
    const { username } = req.params;
    await User.findOneAndDelete({ username: username });

    res.send('Remove user successfully')
  } catch (err) {
    console.log(err);
    res.send('server error').status(500);
  }
}

async function generateOTP(username) {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 5);

  let otpCode = randomString.generate({
    range: "0123456789",
    length: 4,
  });

  const salt = await bcrypt.genSalt(10);
  const otp = await bcrypt.hash(otpCode, salt);

  await OTP.findOneAndUpdate(
    { username: username },
    { username: username, otp: otp, expiry: expiry},
    { new: true, upsert: true}
  )

  return otpCode;
}