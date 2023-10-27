const mysql = require('mysql');

function createTable() {
  const connection = mysql.createConnection({
    host: 'project-astra-rds.c5y9t5m5qhwe.ap-south-1.rds.amazonaws.com',
    user: 'admin',
    password: 'pw',
    database: 'astraDB',
  });

  const query = `
    CREATE TABLE IF NOT EXISTS Temp_Verify (
      email VARCHAR(255) NOT NULL,
      code VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL
    )`;

  return new Promise((resolve, reject) => {
    connection.query(query, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
      connection.end();
    });
  });
}

module.exports = createTable;

createTable();
