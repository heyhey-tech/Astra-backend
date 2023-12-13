const mysql = require('mysql');
require('dotenv').config({ path: './.env' });

const rdspw = process.env.RDS;

// Create a connection pool
const pool = mysql.createPool({
  connectionLimit: 15,
  host: 'project-astra-rds.c5y9t5m5qhwe.ap-south-1.rds.amazonaws.com',
  user: 'admin',
  password: rdspw,
  database: 'astraDB',
});


module.exports = pool;