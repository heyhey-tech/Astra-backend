const mysql = require('mysql');

function addUserToRDS(email,username, password) {
  const connection = mysql.createConnection({
    host: 'project-astra-rds.c5y9t5m5qhwe.ap-south-1.rds.amazonaws.com',
    user: 'admin',
    password: 'heyhey1234',
    database: 'astraDB',
  });

  const query = `INSERT INTO users (email,name, password) VALUES ('${email}','${username}', '${password}')`;

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

module.exports = addUserToRDS;

// addUserToRDS('hello@gmail.com','hello','hello1234');
