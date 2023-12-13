const pool = require('./db');

function deleteRowsFromRDSTemp(email) {
  const query = `DELETE FROM Temp_Verify WHERE email = ?`;
  const values = [email];

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
          resolve(results.affectedRows);
        }
      });
    });
  });
}


module.exports = deleteRowsFromRDSTemp;