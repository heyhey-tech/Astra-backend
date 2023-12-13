const pool = require('./db');

function addUserToRDS(email, username, password) {
  const query = `INSERT INTO users (email, name, password) VALUES (?, ?, ?)`;
  const values = [email, username, password];

  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject(error);
        return;
      }

      connection.query(query, values, (error, results, fields) => {
        connection.release();

        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  });
}


module.exports = addUserToRDS;