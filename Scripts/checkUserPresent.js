const mysql = require('mysql');

function checkUserInDB(email) {
  const connection = mysql.createConnection({
    host: 'project-astra-rds.c5y9t5m5qhwe.ap-south-1.rds.amazonaws.com',
    user: 'admin',
    password: 'pw',
    database: 'astraDB',
  });

  const query = `SELECT email FROM users WHERE email='${email}'`;

  return new Promise((resolve, reject) => {
    connection.query(query, (error, results, fields) => {
      if (error) {
        reject(error);
      } else if (results.length === 0) {
        resolve(false);
      } else {
        resolve(true);
      }
      connection.end();
    });
  });
}

module.exports = checkUserInDB;

// getCodeFromRDS('hello@gmail.com')
//   .then((code) => console.log(code))
