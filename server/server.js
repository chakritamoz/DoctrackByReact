const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { readdirSync } = require('fs');

const app = express();
dotenv.config();

connectDB();

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: "10mb" }));

readdirSync('./routes').map((file) => {
  app.use('/api', require(`./routes/` + file));
});

const port = process.env.SERVER_PORT;
app.listen(port, () => {
  console.log(`server start at port ${port}`);
});