const mysql = require('mysql');
require('dotenv').config({ path: '.env'});

const rdspw = process.env.RDS;

function getAllUsers() {
  const connection = mysql.createConnection({
    host: 'project-astra-rds.c5y9t5m5qhwe.ap-south-1.rds.amazonaws.com',
    user: 'admin',
    password: 'heyhey1234',
    database: 'astraDB',
  });

  const query = `SELECT email FROM users`;

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


// getAllUsers()
//   .then(users => {
//     const emails = users.map(user => user.email);
//     console.log(emails);
//   })
//   .catch(err => console.error(err));
module.exports = getAllUsers;