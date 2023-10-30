const mysql = require('mysql');

function checkBrandInDB(email) {
  const connection = mysql.createConnection({
    host: 'project-astra-rds.c5y9t5m5qhwe.ap-south-1.rds.amazonaws.com',
    user: 'admin',
    password: rdspw,
    database: 'astraDB',
  });

  const query = `SELECT email FROM organisations WHERE email='${email}'`;

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

module.exports = checkBrandInDB;

// getCodeFromRDS('hello@gmail.com')
//   .then((code) => console.log(code))
