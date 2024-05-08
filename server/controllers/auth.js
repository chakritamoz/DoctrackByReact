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
    console.log(req.body);
    const { 
      username, 
      password,
      email,
    } = req.body;

    let user = await User.findOne({ username: username });
    if (user) {
      return res.status(409).send('username is already register');
    }

    const isMail = await User.findOne({ email: email });
    if (isMail) {
      return res.status(409).send('email is already register');
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
    return res.send('Send OTP via email');
  } catch (err) {
    console.log(err);
    res.status(500).send('server error');
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
      return res.status(400).send('username is incorrect');
    }

    const payload = {
      user: {
        username: username
      }
    };

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('password is incorrect');
    }

    jwt.sign(payload, 'jwtsecret', {expiresIn: '1h'}, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });

  } catch (err) {
    console.log(err);
    res.status(500).send('server error');
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
    return res.status(500).send('server error');
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

    // Find the user by username
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(400).send('User is invalid');
    }

    // Find the OTP record for the user
    const otp = await OTP.findOne({ user: user._id });
    if (!otp) {
      return res.status(400).send('OTP not found');
    }

    if (expiry < new Date()) {
      return res.status(400).send('OTP lifetime is expired');
    }

    const isMatch = await bcrypt.compare(otpCode, otp.otp);
    if (!isMatch) {
      return res.status(400).send('OTP is invalid');
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
    return res.status(500).send('server error');
  }
}

exports.verifyOTP = async (req, res) => {
  try {
    const { username, otpCode } = req.body;

    // Find the user by username
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(400).send('User is invalid');
    }

    // Find the OTP record for the user
    const otp = await OTP.findOne({ user: user._id });
    if (!otp) {
      return res.status(400).send('OTP not found');
    }

    // check OTP is expired 
    if (otp.expiry <= Date.now()) {
      return res.status(400).send('OTP has expried');
    }

    // compair OTP code
    const isMatch = await bcrypt.compare(otpCode, otp.otp);
    if (!isMatch) {
      return res.status(400).send('OTP is invalid');
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
    res.status(500).send('server error');
  }
}

exports.newOTP = async (req, res) => {
  try {
    const { username } = req.body;

    // Find the user by username
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Find the OTP record for the user
    const otp = await OTP.findOne({ user: user._id });
    
    // Check limit OTP request
    // If limit is equal or morethan 3 times/d
    if (otp.limit.counter >= 3) {
      
      // Set retry date by add 1 date
      const requestDate = otp.limit.requestDate;
      const retryDate = new Date(requestDate);
      retryDate.setDate(retryDate.getDate() + 1);

      // Check retry date is morethan date now
      // send error message try again after 24 hour later
      if (retryDate >= Date.now()) {
        return res
        .staus(400)
        .send('ํYou requested too many OTPs. Please try again 24 hour later.');
      }

      // If request after 24 hour later
      // reset limit couter as 0
      otp.limit.counter = 0;
    }

    const otpCode = await generateOTP(user.username, otp.limit.counter + 1);
    
    // send email for authentication
    sendMail(user, MAIL_REGISTER, otpCode);
    return res.send('A new OTP has been sent to your email')
  } catch (err) {
    console.log(err);
    res.status(500).send('server error');
  }
}

exports.verifyAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    const auth = await Auth.findOne({ user: id });

    if (auth.admin.validate) {
      return res.send('user has been verified.')
    }

    await Auth.updateOne(
      { admin: {
        validate: true,
        dateVerify: Date.now()
      }}
    );

    return res.send('admin has successfully verified.');
  } catch (err) {
    console.log(err);
    res.status(500).send('server error');
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