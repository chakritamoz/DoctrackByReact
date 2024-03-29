// import required dependencies
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

// init dotenv
dotenv.config();

// get environment variables
const OAUTH_EMAIL = process.env.OAUTH_EMAIL;
const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
const OAUTH_REFRESH_TOKEN = process.env.OAUTH_REFRESH_TOKEN;

const oauth2Client = new OAuth2(
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({
  refresh_token: OAUTH_REFRESH_TOKEN
});

const accessToken = oauth2Client.getAccessToken();

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      type: 'OAuth2',
      user: OAUTH_EMAIL,
      clientId: OAUTH_CLIENT_ID,
      clientSecret: OAUTH_CLIENT_SECRET,
      refreshToken: OAUTH_REFRESH_TOKEN,
      accessToken: accessToken.toString()
  }
});

exports.sendMail = (recipient) => {
  const mailOptions = {
    from: OAUTH_EMAIL,
    to: recipient,
    subject: 'Authentication email',
    html: '<div><h1>Hello This is authentication</h1></div>'
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }

    console.log(`Message sent: ${info.messageId}`);
  })
}

// module.exports = transporter;

// create mail options
// const mailOptions = {
//   from: OAUTH_EMAIL,
//   to: 'chakrit.artamoz@gmail.com',
//   subject: 'Hello ✔',
//   text: 'Hello world?',
// };

// send mail
// transporter.sendMail(mailOptions, (error, info) => {
//   if (error) {
//       return console.log(error);
//   }
//   console.log('Message sent: %s', info.messageId);
// });