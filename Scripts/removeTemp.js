const mysql = require('mysql');
require('dotenv').config({ path: '.env'});

const rdspw = process.env.RDS;

function deleteRowsFromRDSTemp(email) {
  const connection = mysql.createConnection({
    host: 'project-astra-rds.c5y9t5m5qhwe.ap-south-1.rds.amazonaws.com',
    user: 'admin',
    password: rdspw,
    database: 'astraDB',
  });

  console.log("deleteing from temp table:",email);
  const query = `DELETE FROM Temp_Verify WHERE email='${email}'`;

  return new Promise((resolve, reject) => {
    connection.query(query, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results.affectedRows);
      }
      connection.end();
    });
  });
}

module.exports = deleteRowsFromRDSTemp;

// deleteRowsFromRDS('hello@gmail.com')
//   .then((affectedRows) => console.log(`${affectedRows} rows deleted`))
//   .catch((error) => console.error(error));