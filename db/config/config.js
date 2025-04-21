// config/config.js
require("dotenv").config(); // Ensure this is at the top to load environment variables
const fs = require('fs');
const path = require('path');

// Load SSL certificate
const caCert = fs.readFileSync(path.resolve(__dirname, 'cert', 'ca-certificate.crt'));

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // You might need to adjust this based on your SSL certificate
        ca: caCert,
      },
    },
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // You might need to adjust this based on your SSL certificate
        ca: caCert,
      },
    },
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // You might need to adjust this based on your SSL certificate
        ca: caCert,
      },
    },
  },
};