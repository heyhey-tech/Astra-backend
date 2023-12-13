const pool = require('./db');

function getCodeFromRDS(email) {
  const query = `SELECT code FROM Temp_Verify WHERE email='${email}'`;

  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject(error);
        return;
      }

      connection.query(query, (error, results, fields) => {
        connection.release();

        if (error) {
          reject(error);
        } else if (results.length === 0) {
          resolve(false);
        } else {
          resolve(results[0].code);
        }
      });
    });
  });
}

module.exports = getCodeFromRDS;
// getCodeFromRDS('hello@gmail.com')
//   .then((code) => console.log(code))
