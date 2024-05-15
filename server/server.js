const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { readdirSync } = require('fs');
const cookieParser = require('cookie-parser');

const app = express();
dotenv.config();

connectDB();

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true
};

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(cookieParser());

readdirSync('./routes').map((file) => {
  app.use('/api', require(`./routes/` + file));
});

const SERVER_PORT = process.env.SERVER_PORT;
app.listen(SERVER_PORT, () => {
  console.log(`server start at port ${SERVER_PORT}`);
});