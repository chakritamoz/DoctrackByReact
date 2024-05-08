// import required dependencies
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const { readFileSync } = require('fs');
const path = require('path');

// init dotenv
dotenv.config();

// get environment variables
const OAUTH_EMAIL = process.env.OAUTH_EMAIL;
const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
const OAUTH_REFRESH_TOKEN = process.env.OAUTH_REFRESH_TOKEN;

// get template and style
let template = readFileSync('./emails/template.html', "utf8");
const style = readFileSync('./emails/index.css', 'utf8');
const paperplane = path.join(__dirname, '../asset/paperplane.png');

// add style into template
template = template.replace('{style}', `<style>${style}</style>`)

const oauth2Client = new OAuth2(
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({
  refresh_token: OAUTH_REFRESH_TOKEN
});

const accessToken = oauth2Client.getAccessToken();

// // create reusable transporter object using the default SMTP transport
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

const mailOptions = {
  from: OAUTH_EMAIL,
  subject: 'Authentication email',
  html: template,
  attachments: [{
    filename: 'paperplane.png',
    path: paperplane,
    cid: 'paperplane'
  }]
}

const sendMail = (user, action, otpCode) => {
  mailOptions.html = mailOptions.html.replace("{username}", user.username);
  mailOptions.html = mailOptions.html.replace('{action}', action)
  mailOptions.html = mailOptions.html.replace("{otp}", otpCode);
  mailOptions.to = user.email;

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return console.log(err);
    }

    console.log(`Message sent: ${info.messageId}`);
  })
}

module.exports = sendMail;