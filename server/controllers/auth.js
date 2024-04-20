const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const randomString = require('randomized-string');
const dotenv = require('dotenv');

const User = require('../models/user');
const Role = require('../models/role');
const OTP = require('../models/otp');

const sendMail = require('../config/oauth2');

dotenv.config();
const MAIL_REGISTER = process.env.MAIL_REGISTER;
const MAIL_FORGET = process.env.MAIL_FORGET;

exports.register = async (req, res) => {
  try {
    const { 
      username, 
      password,
      email,
    } = req.body;

    let user = await User.findOne({ username: username });
    if (user) {
      return res.send('username is already register');
    }

    const isMail = await User.findOne({ email: email });
    if (isMail) {
      return res.send('email is already register');
    }

    const salt = await bcrypt.genSalt(10);
    
    user = new User({
      username,
      password,
      email,
      role
    });
    
    user.password = await bcrypt.hash(password, salt);

    // set default role as user role
    const role = await Role.findOne({ name: 'user' });
    user.role = role._id;

    const otpCode = await generateOTP(user.username);

    // Send email for authentication
    sendMail(user, MAIL_REGISTER, otpCode);

    await user.save();
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

    const payload = {
      user: {
        username: username
      }
    };

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.send('password is incorrect');
    }

    jwt.sign(payload, 'jwtsecret', {expiresIn: '1h'}, (err, token) => {
      if (err) throw err;
      res.json({ token, payload });
    });

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

exports.confirm = async (req, res) => {
  try {
    
  } catch (err) {
    console.log(err);
    res.send('server error').status(500);
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