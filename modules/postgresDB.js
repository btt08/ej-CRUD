const { Client } = require('pg');
const config = require('./config');

const client = new Client({
  user: config.DB_USER,
  host: config.DB_HOST,
  database: config.DB_NAME,
  password: config.DB_PWD,
  port: config.DB_PORT
});

client.connect();

module.exports = client;