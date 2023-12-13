const mysql = require('mysql');
const pool = require('./db');

// Wrap the query function in a promise
function query(sql, values) {
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject(error);
        return;
      }

      connection.query(sql, values, (error, results, fields) => {
        connection.release(); // Release the connection back to the pool
        
        if (error) {
          reject(error);
          return;
        }else if (results.length === 0) {
              resolve(false);
            } else {
              resolve(true);
            }
      });
    });
  });
}

      

// Check if the user exists in the database
async function checkUserInDB(email) {
  const sql = `SELECT email FROM users WHERE email='${email}'`;

  const values = [email];

  try {
    const results = await query(sql, values);
    return results;
  } catch (error) {
    throw error;
  }
}



module.exports = checkUserInDB;