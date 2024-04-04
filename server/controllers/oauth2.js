const sendMail = require("../config/oauth2");


exports.registerMail = (user, otpCode) => {
  try {
    const action = 'sign up';
    sendMail(user, action, otpCode);
  } catch (err) {
    console.log(err);
  }
}

exports.forgetMail = (user, otpCode) => {
  try {
    const action = 'forget';
    sendMail(user, action, otpCode);
  } catch (err) {
    console.log(err);
  }
}