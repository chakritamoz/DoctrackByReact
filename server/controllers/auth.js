const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const randomString = require('randomized-string');
const dotenv = require('dotenv');

const User = require('../models/user');
const Role = require('../models/role');
const OTP = require('../models/otp');
const Auth = require('../models/auth');

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
    });
    
    user.password = await bcrypt.hash(password, salt);

    // set default role as user role
    const role = await Role.findOne({ name: 'keeper' });
    user.role = role._id;
    await user.save();

    const auth = new Auth({
      user: user._id,
    });
    await auth.save();
    
    // gen otp code binding user
    const otpCode = await generateOTP(user.username);
    // send email for authentication
    sendMail(user, MAIL_REGISTER, otpCode);

    const payload = {
      user: {
        username: username
      }
    };

    jwt.sign(payload, 'jwtsecret', {expiresIn: '1h'}, (err, token) => {
      if (err) throw err;
      res.json({ token, payload });
    });
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

exports.verifyOTP = async (req, res) => {
  try {
    const { otpCode } = req.body;
    const user = await User.findOne({ username: req.user.username });
    const otp = await OTP.findOne({ user: user._id });

    // check OTP is expired 
    if (expiry >= date.now()) {
      return res.send('OTP has expried');
    }

    // compair OTP code
    const isMatch = await bcrypt.compare(otpCode, otp.otp);
    if (!isMatch) {
      return res.send('OTP is invalid');
    }

    await Auth.findOneAndUpdate(
      { user: user._id },
      { 
        email: {
          validate: true,
          dateVerify: Date.now()
        }
      }
    )

    return res.send('verify success');
  } catch (err) {
    console.log(err);
    res.send('server error').status(500);
  }
}

exports.newOTP = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });
    const otp = await OTP.findOne({ user: user._id });
    const requestDate = otp.limit.requestDate;

    // Check limit OTP request
    if (otp.limit.counter >= 3) {
      const retryDate = new Date(requestDate);
      retryDate.setDate(retryDate.getDate() + 1);

      if (retryDate >= Date.now()) {
        return res.send('ํYou requested too many OTPs. Please try again 24 hour later.')
      }

      otp.limit.counter = 0;
    }


    const otpCode = await generateOTP(user.username, otp.limit.counter + 1);
    // send email for authentication
    sendMail(user, MAIL_REGISTER, otpCode);
    return res.send('A new OTP has been sent to your email')
  } catch (err) {
    console.log(err);
    res.send('server error').status(500);
  }
}

exports.verifyAdmin = async (req, res) => {
  try {
    
  } catch (err) {
    console.log(err);
    res.send('server error').status(500);
  }
}

async function generateOTP(username, counter = 1) {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 5);

  let otpCode = randomString.generate({
    range: "0123456789",
    length: 4,
  });

  const salt = await bcrypt.genSalt(10);
  const otp = await bcrypt.hash(otpCode, salt);

  const user = await User.findOne({ username: username });

  await OTP.findOneAndUpdate(
    { user: user._id },
    { 
      user: user._id,
      otp: otp,
      expiry: expiry,
      limit: {
        counter: counter,
        requestDate: Date.now()
      }
    },
    { new: true, upsert: true}
  )

  return otpCode;
}