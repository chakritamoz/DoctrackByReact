const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD= encodeURIComponent(process.env.DB_PASSWORD);
const DB_CLUSTER = process.env.DB_CLUSTER;
const DB_NAME = process.env.DB_NAME;
const uri = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_CLUSTER}/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log(`database is connected`);
  } catch (err) {
    console.log(err);
  }
}

module.exports = connectDB;