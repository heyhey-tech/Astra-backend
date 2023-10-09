const mysql = require('mysql');

function getCodeFromRDS(email) {
  const connection = mysql.createConnection({
    host: 'project-astra-rds.c5y9t5m5qhwe.ap-south-1.rds.amazonaws.com',
    user: 'admin',
    password: 'heyhey1234',
    database: 'astraDB',
  });

  const query = `SELECT code FROM Temp_Verify WHERE email='${email}'`;

  return new Promise((resolve, reject) => {
    connection.query(query, (error, results, fields) => {
      if (error) {
        reject(error);
      } else if (results.length === 0) {
        resolve(false);
      } else {
        resolve(results[0].code);
      }
      connection.end();
    });
  });
}

module.exports = getCodeFromRDS;

// getCodeFromRDS('hello@gmail.com')
//   .then((code) => console.log(code))
