const mysql = require('mysql');

function getPasswordFromDB(email) {
  const connection = mysql.createConnection({
    host: 'project-astra-rds.c5y9t5m5qhwe.ap-south-1.rds.amazonaws.com',
    user: 'admin',
    password: 'heyhey1234',
    database: 'astraDB',
  });

  const query = `SELECT password FROM organisations WHERE email='${email}'`;

  return new Promise((resolve, reject) => {
    connection.query(query, (error, results, fields) => {
      if (error) {
        reject(error);
      } else if (results.length === 0) {
        resolve(false);
      } else {
        resolve(results[0].password);
      }
      connection.end();
    });
  });
}

module.exports = getPasswordFromDB;

// getCodeFromRDS('hello@gmail.com')
//   .then((code) => console.log(code))
